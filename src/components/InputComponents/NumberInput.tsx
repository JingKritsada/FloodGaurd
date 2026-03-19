import type { BaseInputProps } from "@/interfaces/components.interfaces";

import { useCallback, useState } from "react";
import { Minus, Plus } from "lucide-react";

import BaseInput from "@/components/BaseComponents/BaseInput";
import BaseButton from "@/components/BaseComponents/BaseButton";
import { inputIconSizeStyles } from "@/constants/components.constants";

export default function NumberInput({
	defaultValue,
	disabled,
	inputClassName,
	min,
	max,
	size = "md",
	step = 1,
	value,
	onChange,
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
		"flex items-center justify-center flex-shrink-0 bg-slate-200! dark:bg-slate-800!";

	const baseWrapperStyle =
		"flex items-center w-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

	const baseInputStyle =
		"w-full outline-none bg-transparent text-center placeholder:text-slate-400 dark:placeholder:text-slate-500";

	return (
		<BaseInput
			className={`${baseWrapperStyle} px-2! text-3xl! font-medium!`}
			disabled={disabled}
			inputClassName={[baseInputStyle, inputClassName].filter(Boolean).join(" ")}
			leftIcon={
				<BaseButton
					isIconOnly
					aria-label="Decrease value"
					className={buttonClass}
					disabled={!!isDecrementDisabled}
					leftIcon={<Minus size={iconSize} strokeWidth={2.5} />}
					tabIndex={-1}
					type="button"
					variant="secondary"
					onClick={handleDecrement}
				/>
			}
			rightIcon={
				<BaseButton
					isIconOnly
					aria-label="Increase value"
					className={buttonClass}
					disabled={!!isIncrementDisabled}
					leftIcon={<Plus size={iconSize} strokeWidth={2.5} />}
					tabIndex={-1}
					type="button"
					variant="secondary"
					onClick={handleIncrement}
				/>
			}
			size={size}
			value={numericValue !== undefined ? String(numericValue) : ""}
			onChange={(e) => {
				if (!isControlled)
					setInternalValue(e.target.value === "" ? 0 : Number(e.target.value));
				if (onChange) onChange(e);
			}}
			{...rest}
		/>
	);
}
