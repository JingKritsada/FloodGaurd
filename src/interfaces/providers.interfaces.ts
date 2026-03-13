import type { AlertType } from "@/types/components.types";
import type { Role } from "@/types/index.types";

/**
 * Raw JWT payload fields used for decoding the token.
 * Only the fields the app actually reads are declared here.
 */
export interface TokenPayload {
	sub?: string;
	username?: string;
	name?: string;
	role?: string;
	exp?: number;
}

/**
 * Shape of the auth slice held in React state.
 */
export interface AuthState {
	token: string | null;
	username: string | null;
	userRole: Role;
	/** Raw role string as it appears in the token (e.g. "เจ้าหน้าที่") */
	rawRole: string | null;
	isAuthenticated: boolean;
}

/**
 * Value exposed by AuthContext.
 */
export interface AuthContextType extends AuthState {
	login: (username: string, password: string) => Promise<void>;
	logout: () => void;
}

/**
 * Shape of the alert state held in React state.
 */
export interface AlertState {
	isOpen: boolean;
	type: AlertType;
	title: string;
	message: string;
	isConfirm: boolean;
	onConfirm?: () => void | Promise<void>;
	confirmText?: string;
	cancelText?: string;
}

/**
 * Value exposed by AlertContext.
 */
export interface AlertContextType {
	showAlert: (title: string, message: string, type?: AlertType, confirmText?: string) => void;
	showConfirm: (
		title: string,
		message: string,
		onConfirm: () => void | Promise<void>,
		type?: AlertType,
		confirmText?: string,
		cancelText?: string
	) => void;
}
