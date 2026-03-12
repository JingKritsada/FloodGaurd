import type { ApiOptions } from "@/interfaces/services.interfaces";

import { loadingManager } from "@/utils/loadingManager";

// ─── Configuration ────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "token";

// ─── Token Management ─────────────────────────────────────────────────────────

let getToken = (): string | null =>
	typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

/** Override the default token getter (useful for testing or SSR). */
export const setTokenGetter = (getter: () => string | null) => {
	getToken = getter;
};

// ─── Request Error ────────────────────────────────────────────────────────────

interface RequestError extends Error {
	status: number;
	body: unknown;
}

// ─── Core Request ─────────────────────────────────────────────────────────────

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...((options.headers as Record<string, string>) || {}),
	};

	const token = getToken();

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
	const text = await res.text();
	let data: T | null = null;

	try {
		data = text ? JSON.parse(text) : null;
	} catch {
		data = text as unknown as T;
	}

	if (!res.ok) {
		// Handle 401 Unauthorized — clear token
		if (res.status === 401) {
			localStorage.removeItem(TOKEN_KEY);
		}

		const err = new Error(
			(data as Record<string, string>)?.message || res.statusText || "Request failed"
		) as RequestError;

		err.status = res.status;
		err.body = data;
		throw err;
	}

	return data as T;
}

// ─── Error Helpers ────────────────────────────────────────────────────────────

/** Extract a user-friendly error message from an unknown error. */
export function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		const status = (error as RequestError).status;

		if (status) {
			switch (status) {
				case 400:
					return "คำขอไม่ถูกต้อง";
				case 401:
					return "กรุณาเข้าสู่ระบบใหม่";
				case 403:
					return "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้";
				case 404:
					return "ไม่พบข้อมูลที่ต้องการ";
				case 500:
					return "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์";
				default:
					return error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
			}
		}

		if (error.name === "TypeError") {
			return "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต";
		}

		return error.message;
	}

	return "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
}

// ─── Loading Wrapper ──────────────────────────────────────────────────────────

/** Wrap any async call with automatic global-loading management. */
export async function apiRequest<T>(requestFn: () => Promise<T>, options?: ApiOptions): Promise<T> {
	const showLoading = !options?.skipGlobalLoading;

	try {
		if (showLoading) loadingManager.show();

		return await requestFn();
	} finally {
		if (showLoading) loadingManager.hide();
	}
}

// ─── Typed HTTP Methods ───────────────────────────────────────────────────────

const api = {
	get: <T>(path: string) => request<T>(path, { method: "GET" }),

	post: <T>(path: string, body?: unknown) =>
		request<T>(path, {
			method: "POST",
			body: body ? JSON.stringify(body) : undefined,
		}),

	put: <T>(path: string, body?: unknown) =>
		request<T>(path, {
			method: "PUT",
			body: body ? JSON.stringify(body) : undefined,
		}),

	patch: <T>(path: string, body?: unknown) =>
		request<T>(path, {
			method: "PATCH",
			body: body ? JSON.stringify(body) : undefined,
		}),

	delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export default api;
