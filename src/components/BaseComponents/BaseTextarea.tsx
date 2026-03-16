import { inputSizeStyles, inputVariantStyles } from "@/constants/components.constants";
import { type BaseTextareaProps } from "@/interfaces/components.interfaces";

export default function BaseTextarea({
	rows = 3,
	className = "",
	labelClassName = "",
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
					className={[
						labelClassName,
						"text-sm font-medium text-slate-700 dark:text-slate-300",
					]
						.filter(Boolean)
						.join(" ")}
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
					"pr-1 pb-0",
				]
					.filter(Boolean)
					.join(" ")}
			>
				<textarea
					className={[baseTextareaStyle, textareaClassName, "-mb-1"]
						.filter(Boolean)
						.join(" ")}
					disabled={disabled}
					id={id}
					required={isRequired}
					rows={rows}
					style={{ resize: "vertical" }}
					{...rest}
				/>
			</div>
		</div>
	);
}
