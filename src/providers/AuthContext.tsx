import type { Role } from "@/types/index.types";
import type { AuthContextType, AuthState, TokenPayload } from "@/interfaces/providers.interfaces";

import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Safely decode a JWT payload without any third-party library. */
function decodeJwtPayload(token: string): TokenPayload | null {
	try {
		const parts = token.split(".");

		if (parts.length !== 3) return null;

		// Base64url → Base64 → decode
		const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
		const json = decodeURIComponent(
			atob(base64)
				.split("")
				.map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
				.join("")
		);

		return JSON.parse(json) as TokenPayload;
	} catch {
		return null;
	}
}

/** Map the raw token role string to the app's `Role` type. */
function mapRole(raw: string | undefined): Role {
	if (!raw) return "CITIZEN";

	const normalised = raw.toUpperCase();

	if (normalised === "ADMIN" || raw === "ศูนย์บัญชาการ") return "ADMIN";

	if (normalised === "OFFICER" || raw === "เจ้าหน้าที่") return "OFFICER";

	return "CITIZEN";
}

/** Return `true` if the token has not yet expired. */
function isTokenValid(payload: TokenPayload): boolean {
	if (!payload.exp) return true; // no expiry claim → trust it

	return payload.exp * 1000 > Date.now();
}

const STORAGE_KEY = "auth_token";

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [state, setState] = useState<AuthState>(() => {
		try {
			const stored = sessionStorage.getItem(STORAGE_KEY);

			if (stored) {
				const payload = decodeJwtPayload(stored);

				if (payload && isTokenValid(payload)) {
					return {
						token: stored,
						username: payload.username ?? payload.name ?? payload.sub ?? null,
						rawRole: payload.role ?? null,
						userRole: mapRole(payload.role),
						isAuthenticated: true,
					};
				}

				// Stale / invalid token — clear it
				sessionStorage.removeItem(STORAGE_KEY);
			}
		} catch {
			// sessionStorage unavailable (private-browsing edge cases)
		}

		return {
			token: null,
			username: null,
			rawRole: null,
			userRole: "CITIZEN",
			isAuthenticated: false,
		};
	});

	// Auto-logout when the token expires
	const expiryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const scheduleExpiry = useCallback((payload: TokenPayload) => {
		if (expiryTimer.current) clearTimeout(expiryTimer.current);
		if (!payload.exp) return;
		const ms = payload.exp * 1000 - Date.now();

		if (ms <= 0) return;

		expiryTimer.current = setTimeout(() => {
			setState({
				token: null,
				username: null,
				rawRole: null,
				userRole: "CITIZEN",
				isAuthenticated: false,
			});
			sessionStorage.removeItem(STORAGE_KEY);
		}, ms);
	}, []);

	const login = useCallback(
		(token: string) => {
			const payload = decodeJwtPayload(token);

			if (!payload || !isTokenValid(payload)) {
				return;
			}
			try {
				sessionStorage.setItem(STORAGE_KEY, token);
			} catch {
				// ignore storage errors
			}
			setState({
				token,
				username: payload.username ?? payload.name ?? payload.sub ?? null,
				rawRole: payload.role ?? null,
				userRole: mapRole(payload.role),
				isAuthenticated: true,
			});
			scheduleExpiry(payload);
		},
		[scheduleExpiry]
	);

	const logout = useCallback(() => {
		if (expiryTimer.current) clearTimeout(expiryTimer.current);

		try {
			sessionStorage.removeItem(STORAGE_KEY);
		} catch {
			// ignore
		}

		setState({
			token: null,
			username: null,
			rawRole: null,
			userRole: "CITIZEN",
			isAuthenticated: false,
		});
	}, []);

	// Schedule expiry when the provider mounts if a token was restored
	useEffect(() => {
		if (state.token) {
			const payload = decodeJwtPayload(state.token);

			if (payload) scheduleExpiry(payload);
		}

		return () => {
			if (expiryTimer.current) clearTimeout(expiryTimer.current);
		};
		// Only run on mount
	}, []);

	return (
		<AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>
	);
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) throw new Error("useAuth must be used within an AuthProvider");

	return context;
};
