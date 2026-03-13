import { useCallback, useState } from "react";
import { Minus, Plus } from "lucide-react";

import {
	inputIconSizeStyles,
	inputSizeStyles,
	inputVariantStyles,
} from "@/constants/components.constants";
import BaseButton from "@/components/BaseComponents/BaseButton";
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
	defaultValue,
	onChange,
	min,
	max,
	step = 1,
	disabled,
	...rest
}: BaseInputProps) {
	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = useState<number>(
		defaultValue !== undefined ? Number(defaultValue) : 0
	);

	const numericValue = isControlled ? (value !== "" ? Number(value) : undefined) : internalValue;
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
		const clamped = clamp(newVal);

		if (!isControlled) {
			setInternalValue(clamped);
		}

		if (onChange) {
			const syntheticEvent = {
				target: { value: String(clamped) },
			} as React.ChangeEvent<HTMLInputElement>;

			onChange(syntheticEvent);
		}
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
					{isRequired && <span className="ml-1 text-red-500">*</span>}
				</label>
			)}
			<div
				className={[
					baseWrapperStyle,
					inputVariantStyles[variant],
					inputSizeStyles[size],
					disabled ? "cursor-not-allowed opacity-60" : "",
					"px-2!",
				]
					.filter(Boolean)
					.join(" ")}
			>
				<BaseButton
					isIconOnly
					aria-label="Decrease value"
					className={buttonClass}
					disabled={!!isDecrementDisabled}
					leftIcon={<Minus size={iconSize} />}
					tabIndex={-1}
					type="button"
					variant="secondary"
					onClick={handleDecrement}
				/>

				<input
					className={[baseInputStyle, inputClassName].filter(Boolean).join(" ")}
					disabled={disabled}
					id={id}
					max={max}
					min={min}
					step={step}
					type="number"
					value={isControlled ? value : String(internalValue)}
					onChange={(e) => {
						if (!isControlled)
							setInternalValue(e.target.value === "" ? 0 : Number(e.target.value));
						if (onChange) onChange(e);
					}}
					{...rest}
				/>

				<BaseButton
					isIconOnly
					aria-label="Increase value"
					className={buttonClass}
					disabled={!!isIncrementDisabled}
					leftIcon={<Plus size={iconSize} />}
					tabIndex={-1}
					type="button"
					variant="secondary"
					onClick={handleIncrement}
				/>
			</div>
		</div>
	);
}
