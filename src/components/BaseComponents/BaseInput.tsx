import { type ReactNode } from "react";

import {
	inputIconSizeStyles,
	inputSizeStyles,
	inputVariantStyles,
} from "@/constants/components.constants";
import { type BaseInputProps } from "@/interfaces/components.interfaces";

export default function BaseInput({
	className = "",
	disabled,
	leftIcon,
	rightIcon,
	id,
	inputClassName = "",
	isRequired = false,
	label,
	size = "md",
	variant = "default",
	...rest
}: BaseInputProps) {
	const leftIconNode = leftIcon as ReactNode;
	const rightIconNode = rightIcon as ReactNode;
	const iconSize = inputIconSizeStyles[size];

	const baseStyle =
		"flex items-center w-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

	const baseInputStyle =
		"w-full outline-none bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:cursor-not-allowed";

	return (
		<div className={["flex flex-col gap-1"].filter(Boolean).join(" ")}>
			{label && (
				<label
					className="text-sm font-medium text-slate-700 dark:text-slate-300"
					htmlFor={id}
				>
					{label}
					{isRequired && <span className="ml-1 text-red-500">*</span>}
				</label>
			)}
			<div
				className={[
					baseStyle,
					inputVariantStyles[variant],
					inputSizeStyles[size],
					className,
				]
					.filter(Boolean)
					.join(" ")}
			>
				{leftIconNode && (
					<span
						className="shrink-0 items-center text-slate-400 dark:text-slate-500"
						style={{ fontSize: iconSize }}
					>
						{leftIconNode}
					</span>
				)}
				<input
					className={[baseInputStyle, inputClassName].filter(Boolean).join(" ")}
					disabled={disabled}
					id={id}
					{...rest}
				/>
				{rightIconNode && (
					<span
						className="shrink-0 items-end text-slate-400 dark:text-slate-500"
						style={{ fontSize: iconSize }}
					>
						{rightIconNode}
					</span>
				)}
			</div>
		</div>
	);
}
