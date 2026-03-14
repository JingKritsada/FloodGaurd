import type { NavButtonProps } from "@/interfaces/components.interfaces";

import { useLocation, useNavigate } from "react-router-dom";

import BaseButton from "./BaseComponents/BaseButton";

export default function NavButton({ label, destination, ...rest }: NavButtonProps) {
	const navigate = useNavigate();
	const location = useLocation();

	const active = location.pathname === destination;

	const handleOnClick = () => {
		navigate(destination);
	};

	return (
		<BaseButton
			className={`w-18! rounded-2xl! pt-3! font-semibold ${
				active
					? "bg-gold-500/10 text-gold-500 dark:text-gold-400"
					: "text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
			} `}
			orientation="vertical"
			size="sm"
			variant="none"
			onClick={handleOnClick}
			{...rest}
		>
			{label}
		</BaseButton>
	);
}
