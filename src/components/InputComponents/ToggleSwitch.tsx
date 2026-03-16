import type { ToggleSwitchProps } from "@/interfaces/components.interfaces";

export default function ToggleSwitch({
	checked,
	className = "",
	label,
	description,
	onChange,
}: ToggleSwitchProps) {
	return (
		<div
			className={`flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900 ${className}`}
		>
			<div>
				<div className="text-base font-bold text-slate-700 dark:text-slate-300">
					{label}
				</div>
				{description && (
					<div className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
						{description}
					</div>
				)}
			</div>
			<button
				className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${checked ? "bg-green-600" : "bg-slate-200 dark:bg-slate-600"} `}
				type="button"
				onClick={() => onChange(!checked)}
			>
				<span className="sr-only">Use setting</span>
				<span
					aria-hidden="true"
					className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-5" : "translate-x-0"} `}
				/>
			</button>
		</div>
	);
}
