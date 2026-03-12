import { type ReactNode } from "react";

import {
	inputIconSizeStyles,
	inputSizeStyles,
	inputVariantStyles,
} from "@/constants/components.constants";
import { type BaseInputProps } from "@/interfaces/components.interfaces";

export default function BaseInput({
	className = "",
	inputClassName = "",
	icon: Icon,
	iconPosition = "left",
	size = "md",
	variant = "default",
	isRequired = false,
	label,
	id,
	disabled,
	...rest
}: BaseInputProps) {
	const iconNode = Icon as ReactNode;
	const iconSize = inputIconSizeStyles[size];

	const baseStyle =
		"flex items-center w-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

	const baseInputStyle =
		"w-full outline-none bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:cursor-not-allowed";

	return (
		<div className={["flex flex-col gap-1", className].filter(Boolean).join(" ")}>
			{label && (
				<label
					className="text-sm font-medium text-slate-700 dark:text-slate-300"
					htmlFor={id}
				>
					{label}
					{isRequired && <span className="text-red-500 ml-1">*</span>}
				</label>
			)}
			<div
				className={[baseStyle, inputVariantStyles[variant], inputSizeStyles[size]]
					.filter(Boolean)
					.join(" ")}
			>
				{iconNode && iconPosition === "left" && (
					<span
						className="flex-shrink-0 text-slate-400 dark:text-slate-500"
						style={{ fontSize: iconSize }}
					>
						{iconNode}
					</span>
				)}
				<input
					className={[baseInputStyle, inputClassName].filter(Boolean).join(" ")}
					disabled={disabled}
					id={id}
					{...rest}
				/>
				{iconNode && iconPosition === "right" && (
					<span
						className="flex-shrink-0 text-slate-400 dark:text-slate-500"
						style={{ fontSize: iconSize }}
					>
						{iconNode}
					</span>
				)}
			</div>
		</div>
	);
}
