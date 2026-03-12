import { inputSizeStyles, inputVariantStyles } from "@/constants/components.constants";
import { type BaseTextareaProps } from "@/interfaces/components.interfaces";

export default function BaseTextarea({
	className = "",
	textareaClassName = "",
	size = "md",
	variant = "default",
	isRequired = false,
	label,
	id,
	disabled,
	...rest
}: BaseTextareaProps) {
	const baseStyle =
		"w-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

	const baseTextareaStyle =
		"w-full outline-none bg-transparent resize-y placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:cursor-not-allowed";

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
				<textarea
					className={[baseTextareaStyle, textareaClassName].filter(Boolean).join(" ")}
					disabled={disabled}
					id={id}
					{...rest}
				/>
			</div>
		</div>
	);
}
