import type { FontSize } from "@/types/index.types";
import type { IncidentStatus } from "@/types/services.types";
import type { Announcement, Incident } from "@/interfaces/services.interfaces";

import {
	type ButtonHTMLAttributes,
	type InputHTMLAttributes,
	type ReactNode,
	type Ref,
	type SelectHTMLAttributes,
	type TextareaHTMLAttributes,
} from "react";

import {
	type AlertType,
	type ButtonSize,
	type ButtonVariant,
	type ButtonOrientation,
	type InputSize,
	type InputVariant,
} from "@/types/components.types";

/**
 * ButtonProps
 * - BaseButtonProps extends the standard ButtonHTMLAttributes
 * - NavButtonProps extends BaseButtonProps with additional props for navigation
 */
export interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	ref?: Ref<HTMLButtonElement>;
	size?: ButtonSize;
	type?: "button" | "submit" | "reset";
	variant?: ButtonVariant;
	orientation?: ButtonOrientation;
	isLoading?: boolean;
	isIconOnly?: boolean;
}

export interface NavButtonProps extends BaseButtonProps {
	navClassName?: string;
	destination: string;
	label: string;
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
	onConfirm?: () => void | Promise<void>;
	confirmText?: string;
	cancelText?: string;
}

/**
 * SelectOption - represents an individual option in select/multiselect
 */
export interface SelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

/**
 * BaseInputProps extends the standard InputHTMLAttributes
 */
export interface BaseInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
	size?: InputSize;
	variant?: InputVariant;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	className?: string;
	inputClassName?: string;
	labelClassName?: string;
	isRequired?: boolean;
	label?: string;
}

/**
 * BaseSelectProps extends the standard SelectHTMLAttributes
 */
export interface BaseSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
	options: SelectOption[];
	size?: InputSize;
	variant?: InputVariant;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	className?: string;
	selectClassName?: string;
	isRequired?: boolean;
	label?: string;
	placeholder?: string;
	searchable?: boolean;
	value?: string;
	onValueChange?: (value: string) => void;
}

/**
 * BaseTextareaProps extends the standard TextareaHTMLAttributes
 */
export interface BaseTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	size?: InputSize;
	variant?: InputVariant;
	className?: string;
	labelClassName?: string;
	textareaClassName?: string;
	isRequired?: boolean;
	label?: string;
}

/**
 * MultiselectProps for multiselect input component
 */
export interface MultiselectProps {
	options: SelectOption[];
	value?: string[];
	onValueChange?: (values: string[]) => void;
	size?: InputSize;
	variant?: InputVariant;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	className?: string;
	inputClassName?: string;
	isRequired?: boolean;
	label?: string;
	placeholder?: string;
	searchable?: boolean;
	disabled?: boolean;
	name?: string;
	id?: string;
}

/**
 * Input (smart wrapper) discriminated union props
 */
export type TextInputProps = { type: "text" | "email" | "search" | "tel" | "url" } & BaseInputProps;
export type NumberInputProps = { type: "number" } & BaseInputProps;
export type PasswordInputProps = { type: "password" } & BaseInputProps;
export type SelectInputProps = { type: "select" } & BaseSelectProps;
export type MultiselectInputProps = { type: "multiselect" } & MultiselectProps;
export type TextareaInputProps = { type: "textarea" } & BaseTextareaProps;

export type InputProps =
	| TextInputProps
	| NumberInputProps
	| PasswordInputProps
	| SelectInputProps
	| MultiselectInputProps
	| TextareaInputProps;

/**
 * TaskCardProps
 */
export interface TaskCardProps {
	incident: Incident;
	currentRole: string | null;
	onStatusUpdate?: (id: string, newStatus: IncidentStatus) => void;
	onNavigateClick?: () => void;
}

/**
 * AnnoucementCardProps
 */
export interface AnnoucementCardProps {
	announcement: Announcement;
	onEdit?: (id: string) => void;
	onDelete?: (id: string) => void;
}

/**
 * ToggleSwitchProps
 */
export interface ToggleSwitchProps {
	checked: boolean;
	className?: string;
	label: string;
	description?: string;
	onChange: (checked: boolean) => void;
}

/**
 * StatCardProps
 */
export interface StatCardProps {
	id: "ALL" | IncidentStatus;
	label: string;
	sublabel?: string;
	value: number | string;
}
