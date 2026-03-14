import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

import {
	iconOnlySizeStyles,
	iconSizeStyles,
	sizeStyles,
	variantStyles,
	verticalSizeStyles,
	verticalIconSizeStyles,
} from "@/constants/components.constants";
import { type BaseButtonProps } from "@/interfaces/components.interfaces";

export default function BaseButton({
	className = "",
	leftIcon,
	rightIcon,
	ref,
	size = "md",
	variant = "primary",
	orientation = "horizontal",
	type = "button",
	isLoading = false,
	isIconOnly = false,
	disabled,
	children,
	...rest
}: BaseButtonProps) {
	const isDisabled = disabled || isLoading;

	const defaultSize =
		orientation === "vertical" ? verticalIconSizeStyles[size] : iconSizeStyles[size];
	const sizeIcon = (node: ReactNode): ReactNode => {
		if (!isValidElement(node)) return node;

		const el = node as ReactElement<{ size?: number }>;

		return cloneElement(el, { size: el.props.size ?? defaultSize });
	};

	const leftIconElement: ReactNode = isLoading ? (
		<Loader2 className="animate-spin" size={defaultSize} />
	) : (
		sizeIcon(leftIcon ?? null)
	);

	const rightIconElement: ReactNode = sizeIcon(rightIcon ?? null);

	const baseStyle =
		"inline-flex text-nowrap items-center justify-center transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60";

	return (
		<button
			ref={ref}
			className={[
				baseStyle,
				orientation === "vertical" ? "flex-col" : "flex-row",
				variantStyles[variant],
				isIconOnly
					? iconOnlySizeStyles[size]
					: orientation === "vertical"
						? verticalSizeStyles[size]
						: sizeStyles[size],
				className,
			]
				.filter(Boolean)
				.join(" ")}
			disabled={isDisabled}
			type={type}
			{...rest}
		>
			{isIconOnly ? (
				isLoading ? (
					<Loader2 className="animate-spin" size={defaultSize} />
				) : (
					sizeIcon(leftIcon ?? rightIcon ?? null)
				)
			) : (
				<>
					{leftIconElement}
					{children}
					{!isLoading && rightIconElement}
				</>
			)}
		</button>
	);
}
