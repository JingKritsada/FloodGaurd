import api from "./api";

export async function login(username: string, password: string) {
	const res = await api.post("/auth/login", { username, password });
	const data =
		(res as { data?: { token?: string; user?: { role?: string } } })?.data ??
		(res as { token?: string; user?: { role?: string } });
	const token = (data as { token?: string })?.token ?? null;
	const user = (data as { user?: { role?: string } })?.user ?? null;

	return { user, token };
}

export function logout(): void {
	sessionStorage.removeItem("auth_token");
}

export const authService = { login, logout };
export default authService;
