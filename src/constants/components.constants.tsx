import type { Role } from "@/types/index.types";
import type { IncidentCategory } from "@/types/services.types";

import {
	CheckCircle,
	AlertCircle,
	AlertTriangle,
	Info,
	User,
	Shield,
	Siren,
	Sun,
	Moon,
	Monitor,
} from "lucide-react";

import {
	type ButtonSize,
	type ButtonVariant,
	type InputSize,
	type InputVariant,
} from "@/types/components.types";

/**
 * Base Button Constant
 * - variantStyles
 * - sizeStyles
 * - iconOnlySizeStyles
 * - iconSizeStyles
 */
export const variantStyles: Record<ButtonVariant, string> = {
	primary:
		"bg-gold-500 dark:bg-gold-600 text-white dark:text-white hover:bg-gold-600 dark:hover:bg-gold-700 active:bg-gold-700 dark:active:bg-gold-700",
	secondary:
		"bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 active:bg-slate-400 dark:active:bg-slate-600",
	success:
		"bg-green-600 dark:bg-green-600 text-white dark:text-white hover:bg-green-700 dark:hover:bg-green-700 active:bg-green-800 dark:active:bg-green-800",
	warning:
		"bg-amber-500 dark:bg-amber-600 text-white dark:text-white hover:bg-amber-500 dark:hover:bg-amber-600 active:bg-amber-700 dark:active:bg-amber-700",
	danger: "bg-red-600 dark:bg-red-700 text-white dark:text-white hover:bg-red-700 dark:hover:bg-red-800 active:bg-red-700 dark:active:bg-red-700",
	link: "bg-blue-600 dark:bg-blue-700 text-white dark:text-white hover:bg-blue-700 dark:hover:bg-blue-800 active:bg-blue-800 dark:active:bg-blue-800",
	outline:
		"bg-transparent text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 active:bg-slate-100 dark:active:bg-slate-600 border border-slate-300 dark:border-slate-600",
	ghost: "bg-transparent text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600",
	none: "",
};

export const sizeStyles: Record<ButtonSize, string> = {
	xs: "font-normal text-xs px-2 py-1.5 gap-1.5 rounded",
	sm: "font-semibold text-sm px-3 py-2 gap-2 rounded-md",
	md: "font-semibold text-sm px-4 py-2.5 gap-2.5 rounded-md",
	lg: "font-bold text-md px-5 py-3 gap-3 rounded-lg",
	xl: "font-bold text-lg px-6 py-3.5 gap-3.5 rounded-xl",
};

export const iconOnlySizeStyles: Record<ButtonSize, string> = {
	xs: "p-1.5 rounded",
	sm: "p-2 rounded-md",
	md: "p-2.5 rounded-md",
	lg: "p-3 rounded-lg",
	xl: "p-3.5 rounded-xl",
};

export const iconSizeStyles: Record<ButtonSize, number> = {
	xs: 14,
	sm: 16,
	md: 16,
	lg: 18,
	xl: 20,
};

export const verticalSizeStyles: Record<ButtonSize, string> = {
	xs: "text-xs px-3 py-2 gap-1.5 rounded",
	sm: "text-sm px-4 py-2 gap-1.5 rounded-md",
	md: "text-sm px-5 py-2.5 gap-2.5 rounded-md",
	lg: "text-md px-6 py-3 gap-3 rounded-lg",
	xl: "text-lg px-7 py-3 gap-3.5 rounded-xl",
};

export const verticalIconSizeStyles: Record<ButtonSize, number> = {
	xs: 20,
	sm: 22,
	md: 24,
	lg: 28,
	xl: 32,
};

/**
 * Alert Modal Constants
 * - icons
 * - bgColors
 */
export const icons = {
	success: <CheckCircle className="h-12 w-12 text-green-500" />,
	error: <AlertCircle className="h-12 w-12 text-red-500" />,
	warning: <AlertTriangle className="h-12 w-12 text-amber-500" />,
	info: <Info className="h-12 w-12 text-blue-500" />,
};

export const bgColors = {
	success: "bg-green-50 dark:bg-green-900/20",
	error: "bg-red-50 dark:bg-red-900/20",
	warning: "bg-amber-50 dark:bg-amber-900/20",
	info: "bg-blue-50 dark:bg-blue-900/20",
};

/**
 *  AppBar Constants
 * - roles
 * - ThemeIcon
 */
export const roles: { id: Role; label: string; icon: React.ReactNode }[] = [
	{ id: "CITIZEN", label: "ประชาชน", icon: <User size={20} /> },
	{ id: "OFFICER", label: "เจ้าหน้าที่", icon: <Shield size={20} /> },
	{ id: "ADMIN", label: "ศูนย์บัญชาการ", icon: <Siren size={20} /> },
];

export function ThemeIcon({ theme }: { theme: string }) {
	switch (theme) {
		case "light":
			return <Sun size={20} />;
		case "dark":
			return <Moon size={20} />;
		case "system":
			return <Monitor size={20} />;
		default:
			return <Sun size={20} />;
	}
}

/**
 * Base Input Constants
 * - inputSizeStyles
 * - inputVariantStyles
 * - inputIconSizeStyles
 */
export const inputSizeStyles: Record<InputSize, string> = {
	xs: "text-xs px-2 py-1 gap-1 rounded",
	sm: "text-sm px-3 py-1.5 gap-1.5 rounded-md",
	md: "text-sm px-3.5 py-1.5 gap-1.5 rounded-md",
	lg: "text-md px-4 py-2 gap-2 rounded-lg",
	xl: "text-lg px-5 py-2.5 gap-2.5 rounded-xl",
};

export const inputVariantStyles: Record<InputVariant, string> = {
	default:
		"border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus-within:border-gold-500 dark:focus-within:border-gold-400 focus-within:ring-2 focus-within:ring-gold-500/20",
	filled: "border border-transparent bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus-within:border-gold-500 dark:focus-within:border-gold-400 focus-within:bg-white dark:focus-within:bg-slate-800",
	outlined:
		"border border-slate-300 dark:border-slate-600 bg-transparent text-slate-800 dark:text-slate-200 focus-within:border-gold-500 dark:focus-within:border-gold-400",
	ghost: "border border-transparent bg-transparent text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus-within:border-gold-500 dark:focus-within:border-gold-400",
};

export const inputIconSizeStyles: Record<InputSize, number> = {
	xs: 12,
	sm: 14,
	md: 16,
	lg: 18,
	xl: 20,
};

/**
 * Login Modal Constants
 * - LoginModalProps
 */
export interface LoginModalProps {
	isOpen: boolean;
	isSubmitting?: boolean;
	error?: string;
	onClose: () => void;
	onSubmit: (username: string, password: string) => void;
}

export const incidentCategories: { id: IncidentCategory; label: string }[] = [
	{ id: "MEDICAL", label: "เจ็บป่วย/พยาบาล" },
	{ id: "SUPPLIES", label: "อาหาร/น้ำดื่ม" },
	{ id: "EVACUATION", label: "อพยพคน" },
	{ id: "ROAD_BLOCKED", label: "เส้นทางถูกตัดขาด" },
	{ id: "RISK_AREA", label: "พื้นที่เสี่ยงภัย" },
	{ id: "LEVEE_BREACH", label: "น้ำล้น/ผนังกั้นน้ำพัง" },
];
