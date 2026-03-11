import type { AppView, Role } from "@/types/index.types";

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

import { type ButtonSize, type ButtonVariant } from "@/types/components.types";

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
		"bg-green-600 dark:bg-green-700 text-white dark:text-white hover:bg-green-700 dark:hover:bg-green-800 active:bg-green-800 dark:active:bg-green-800",
	warning:
		"bg-amber-500 dark:bg-amber-500 text-white dark:text-white hover:bg-amber-600 dark:hover:bg-amber-700 active:bg-amber-700 dark:active:bg-amber-700",
	danger: "bg-red-600 dark:bg-red-700 text-white dark:text-white hover:bg-red-700 dark:hover:bg-red-800 active:bg-red-700 dark:active:bg-red-700",
	link: "bg-blue-600 dark:bg-blue-700 text-white dark:text-white hover:bg-blue-700 dark:hover:bg-blue-800 active:bg-blue-800 dark:active:bg-blue-800",
	outline:
		"bg-transparent text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 active:bg-slate-100 dark:active:bg-slate-600 border border-slate-300 dark:border-slate-600",
	ghost: "bg-transparent text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600",
	none: "",
};

export const sizeStyles: Record<ButtonSize, string> = {
	xs: "text-xs px-2 py-1.5 gap-1.5 rounded",
	sm: "text-sm px-3 py-2 gap-2 rounded-md",
	md: "text-sm px-4 py-2.5 gap-2.5 rounded-md",
	lg: "text-md px-5 py-3 gap-3 rounded-lg",
	xl: "text-lg px-6 py-3.5 gap-3.5 rounded-xl",
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

/**
 * Alert Modal Constants
 * - icons
 * - bgColors
 */
export const icons = {
	success: <CheckCircle className="w-12 h-12 text-green-500" />,
	error: <AlertCircle className="w-12 h-12 text-red-500" />,
	warning: <AlertTriangle className="w-12 h-12 text-amber-500" />,
	info: <Info className="w-12 h-12 text-blue-500" />,
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
export const roles: { id: Role; label: string; icon: React.ReactNode; view: AppView }[] = [
	{ id: "CITIZEN", label: "ประชาชน", icon: <User size={20} />, view: "MAP" },
	{ id: "OFFICER", label: "เจ้าหน้าที่", icon: <Shield size={20} />, view: "LIST" },
	{ id: "ADMIN", label: "ศูนย์บัญชาการ", icon: <Siren size={20} />, view: "STATS" },
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
