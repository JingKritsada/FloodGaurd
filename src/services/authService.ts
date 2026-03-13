import type {
	ApiOptions,
	AuthUser,
	LoginResponse,
	ProfileResponse,
	RegisterResponse,
	VerifyTokenResponse,
} from "@/interfaces/services.interfaces";

import api, { apiRequest } from "@/services/api";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOKEN_KEY = "token";

// ─── Auth Functions ───────────────────────────────────────────────────────────

/** Login with username and password. Stores token on success. */
async function login(username: string, password: string, options?: ApiOptions) {
	const res = await apiRequest(
		() => api.post<LoginResponse>("/auth/login", { username, password }),
		options
	);

	const token = res.data.token;
	const user: AuthUser = res.data.user;

	if (token) localStorage.setItem(TOKEN_KEY, token);

	return { user, token };
}

/** Register a new user. */
async function register(username: string, password: string, email?: string, options?: ApiOptions) {
	const res = await apiRequest(
		() => api.post<RegisterResponse>("/auth/register", { username, password, email }),
		options
	);

	return res.data;
}

/** Get current user profile. Requires auth token. */
async function getProfile(options?: ApiOptions) {
	const res = await apiRequest(() => api.get<ProfileResponse>("/auth/profile"), options);

	return res.data;
}

/** Update current user profile. Cannot change username or password. */
async function updateProfile(data: { email?: string; role?: string }, options?: ApiOptions) {
	const res = await apiRequest(() => api.put<ProfileResponse>("/auth/profile", data), options);

	return res.data;
}

/** Verify whether the current token is still valid. */
async function verifyToken(options?: ApiOptions) {
	const res = await apiRequest(() => api.get<VerifyTokenResponse>("/auth/verify"), options);

	return res.data;
}

/** Logout — intercept and optionally call API to invalidate token, then remove from storage. */
async function logout(_options?: ApiOptions) {
	// Usually there might be an API call here.
	// await apiRequest(() => api.post("/auth/logout"), _options);

	// Add a fake delay for UX response
	await new Promise((resolve) => setTimeout(resolve, 500));

	localStorage.removeItem(TOKEN_KEY);
}

/** Retrieve the stored JWT. */
function getToken() {
	return localStorage.getItem(TOKEN_KEY);
}

/** Decode the `role` field from a JWT without a third-party library. */
function decodeTokenRole(token?: string | null): string | null {
	try {
		const t = token || getToken();

		if (!t) return null;

		const parts = t.split(".");

		if (parts.length < 2) return null;

		const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));

		return payload.role || null;
	} catch {
		return null;
	}
}

export default {
	login,
	register,
	getProfile,
	updateProfile,
	verifyToken,
	logout,
	getToken,
	decodeTokenRole,
};
