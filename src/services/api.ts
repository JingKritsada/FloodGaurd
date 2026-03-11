const BASE = import.meta.env.VITE_API_URL || "/api";

const getToken = (): string | null =>
	typeof window !== "undefined" ? sessionStorage.getItem("auth_token") : null;

async function request(path: string, options: RequestInit = {}): Promise<unknown> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...((options.headers as Record<string, string>) || {}),
	};

	const token = getToken();

	if (token) headers["Authorization"] = `Bearer ${token}`;

	const res = await fetch(`${BASE}${path}`, { ...options, headers });

	// Read body once; needed for both success and error messages
	const text = await res.text();
	let data: unknown = null;

	if (text) {
		try {
			data = JSON.parse(text);
		} catch {
			// Non-JSON bodies (e.g. plain text errors) kept as string
			data = text;
		}
	}

	if (!res.ok) {
		const msg = (data as { message?: string })?.message || res.statusText || "Request failed";
		const err = new Error(msg) as Error & { status?: number; body?: unknown };

		err.status = res.status;
		err.body = data;
		throw err;
	}

	return data;
}

export const api = {
	get: (path: string) => request(path, { method: "GET" }),
	post: (path: string, body?: unknown) =>
		request(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
	put: (path: string, body?: unknown) =>
		request(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
	patch: (path: string, body?: unknown) =>
		request(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
	delete: (path: string) => request(path, { method: "DELETE" }),
};

export default api;
