import { useCallback } from "react";
import { Minus, Plus } from "lucide-react";

import {
	inputIconSizeStyles,
	inputSizeStyles,
	inputVariantStyles,
} from "@/constants/components.constants";
import { type BaseInputProps } from "@/interfaces/components.interfaces";

export default function NumberInput({
	className = "",
	inputClassName = "",
	size = "md",
	variant = "default",
	isRequired = false,
	label,
	id,
	value,
	onChange,
	min,
	max,
	step = 1,
	disabled,
	...rest
}: BaseInputProps) {
	const numericValue = value !== undefined && value !== "" ? Number(value) : undefined;
	const iconSize = inputIconSizeStyles[size];

	const clamp = useCallback(
		(val: number): number => {
			let result = val;

			if (min !== undefined) result = Math.max(Number(min), result);
			if (max !== undefined) result = Math.min(Number(max), result);

			return result;
		},
		[min, max]
	);

	function fireChange(newVal: number) {
		if (!onChange) return;
		const clamped = clamp(newVal);
		const syntheticEvent = {
			target: { value: String(clamped) },
		} as React.ChangeEvent<HTMLInputElement>;

		onChange(syntheticEvent);
	}

	function handleDecrement() {
		const base = numericValue ?? 0;

		fireChange(base - Number(step));
	}

	function handleIncrement() {
		const base = numericValue ?? 0;

		fireChange(base + Number(step));
	}

	const isDecrementDisabled =
		disabled ||
		(min !== undefined && numericValue !== undefined && numericValue <= Number(min));
	const isIncrementDisabled =
		disabled ||
		(max !== undefined && numericValue !== undefined && numericValue >= Number(max));

	const buttonClass =
		"flex items-center justify-center flex-shrink-0 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer";

	const baseWrapperStyle =
		"flex items-center w-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

	const baseInputStyle =
		"w-full outline-none bg-transparent text-center placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

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
				className={[
					baseWrapperStyle,
					inputVariantStyles[variant],
					inputSizeStyles[size],
					disabled ? "opacity-60 cursor-not-allowed" : "",
				]
					.filter(Boolean)
					.join(" ")}
			>
				<button
					aria-label="Decrease value"
					className={buttonClass}
					disabled={!!isDecrementDisabled}
					tabIndex={-1}
					type="button"
					onClick={handleDecrement}
				>
					<Minus size={iconSize} />
				</button>

				<input
					className={[baseInputStyle, inputClassName].filter(Boolean).join(" ")}
					disabled={disabled}
					id={id}
					max={max}
					min={min}
					step={step}
					type="number"
					value={value}
					onChange={onChange}
					{...rest}
				/>

				<button
					aria-label="Increase value"
					className={buttonClass}
					disabled={!!isIncrementDisabled}
					tabIndex={-1}
					type="button"
					onClick={handleIncrement}
				>
					<Plus size={iconSize} />
				</button>
			</div>
		</div>
	);
}
