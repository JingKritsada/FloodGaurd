import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

import {
	iconOnlySizeStyles,
	iconSizeStyles,
	sizeStyles,
	variantStyles,
} from "@/constants/components.constants";
import { type BaseButtonProps } from "@/interfaces/components.interfaces";

export default function BaseButton({
	className = "",
	icon: Icon,
	iconPosition = "left",
	ref,
	size = "md",
	variant = "primary",
	isLoading = false,
	isIconOnly = false,
	disabled,
	children,
	...rest
}: BaseButtonProps) {
	const isDisabled = disabled || isLoading;

	const defaultSize = iconSizeStyles[size];
	const sizeIcon = (node: ReactNode): ReactNode => {
		if (!isValidElement(node)) return node;

		const el = node as ReactElement<{ size?: number }>;

		return cloneElement(el, { size: el.props.size ?? defaultSize });
	};

	const iconElement: ReactNode = isLoading ? (
		<Loader2 className="animate-spin" size={defaultSize} />
	) : (
		sizeIcon(Icon ?? null)
	);

	const baseStyle =
		"inline-flex text-nowrap items-center justify-center transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60";

	return (
		<button
			ref={ref}
			className={[
				baseStyle,
				variantStyles[variant],
				isIconOnly ? iconOnlySizeStyles[size] : sizeStyles[size],
				className,
			]
				.filter(Boolean)
				.join(" ")}
			disabled={isDisabled}
			{...rest}
		>
			{isIconOnly ? (
				iconElement
			) : (
				<>
					{iconPosition === "left" && iconElement}
					{children}
					{iconPosition === "right" && iconElement}
				</>
			)}
		</button>
	);
}
