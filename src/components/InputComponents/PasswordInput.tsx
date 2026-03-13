import { useState, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

import BaseInput from "@/components/BaseComponents/BaseInput";
import BaseButton from "@/components/BaseComponents/BaseButton";
import { type BaseInputProps } from "@/interfaces/components.interfaces";

export default function PasswordInput({ size = "md", ...props }: BaseInputProps) {
	const [visible, setVisible] = useState(false);

	const toggleIcon: ReactNode = visible ? <EyeOff size={18} /> : <Eye size={18} />;

	return (
		<BaseInput
			className="pr-2!"
			icon={
				<BaseButton
					isIconOnly
					aria-label={visible ? "Hide password" : "Show password"}
					icon={toggleIcon}
					size="md"
					tabIndex={-1}
					type="button"
					variant="ghost"
					onClick={() => setVisible((prev) => !prev)}
				/>
			}
			iconPosition="right"
			size={size}
			type={visible ? "text" : "password"}
			{...props}
		/>
	);
}
