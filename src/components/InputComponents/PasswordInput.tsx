import { useState, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

import BaseInput from "@/components/BaseComponents/BaseInput";
import BaseButton from "@/components/BaseComponents/BaseButton";
import { type BaseInputProps } from "@/interfaces/components.interfaces";

const inputPr = {
	xs: "!pr-2",
	sm: "!pr-2.5",
	md: "!pr-3",
	lg: "!pr-3.5",
	xl: "!pr-4",
};

export default function PasswordInput({ size = "md", ...props }: BaseInputProps) {
	const [visible, setVisible] = useState(false);

	const toggleIcon: ReactNode = visible ? (
		<EyeOff className="text-slate-500 dark:text-slate-400" size={20} strokeWidth={2} />
	) : (
		<Eye className="text-slate-500 dark:text-slate-400" size={20} strokeWidth={2} />
	);

	return (
		<BaseInput
			{...props}
			className="relative overflow-hidden"
			inputClassName={inputPr[size]}
			rightIcon={
				<div className="absolute top-1 right-1 bottom-1 z-10 flex">
					<BaseButton
						isIconOnly
						aria-label={visible ? "Hide password" : "Show password"}
						className="aspect-square h-full! w-auto! rounded-xl! p-0!"
						leftIcon={toggleIcon}
						tabIndex={-1}
						type="button"
						variant="ghost"
						onClick={() => setVisible((prev) => !prev)}
					/>
				</div>
			}
			size={size}
			type={visible ? "text" : "password"}
		/>
	);
}
