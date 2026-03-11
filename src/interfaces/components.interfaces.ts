import type { FontSize } from "@/types/index.types";

import { type ButtonHTMLAttributes, type ReactNode, type Ref } from "react";

import {
	type AlertType,
	type ButtonSize,
	type ButtonVariant,
	type IconPosition,
} from "@/types/components.types";

/**
 * BaseButtonProps extends the standard ButtonHTMLAttributes
 */
export interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string;
	icon?: ReactNode;
	iconPosition?: IconPosition;
	ref?: Ref<HTMLButtonElement>;
	size?: ButtonSize;
	variant?: ButtonVariant;
	isLoading?: boolean;
	isIconOnly?: boolean;
}

/**
 * FontSizeControlProps
 */
export interface FontSizeControlProps {
	className?: string;
	fontSize: FontSize;
	setFontSize: (size: FontSize) => void;
}

/**
 * FuzzyTextProps
 */
export interface FuzzyTextProps {
	children: React.ReactNode;
	fontSize?: number | string;
	fontWeight?: string | number;
	fontFamily?: string;
	color?: string;
	enableHover?: boolean;
	baseIntensity?: number;
	hoverIntensity?: number;
	className?: string;
}

/**
 * AlertModalProps
 */
export interface AlertModalProps {
	isOpen: boolean;
	type: AlertType;
	title: string;
	message: string;
	isConfirm?: boolean;
	onClose: () => void;
	onConfirm?: () => void;
	confirmText?: string;
	cancelText?: string;
}
