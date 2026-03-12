import { useState, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

import BaseInput from "@/components/BaseComponents/BaseInput";
import { type BaseInputProps } from "@/interfaces/components.interfaces";

export default function PasswordInput({ size = "md", ...props }: BaseInputProps) {
	const [visible, setVisible] = useState(false);

	const toggleIcon: ReactNode = visible ? <EyeOff size={16} /> : <Eye size={16} />;

	return (
		<BaseInput
			icon={
				<button
					aria-label={visible ? "Hide password" : "Show password"}
					className="flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 cursor-pointer"
					tabIndex={-1}
					type="button"
					onClick={() => setVisible((prev) => !prev)}
				>
					{toggleIcon}
				</button>
			}
			iconPosition="right"
			size={size}
			type={visible ? "text" : "password"}
			{...props}
		/>
	);
}
