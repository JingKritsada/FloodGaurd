import type { AlertModalProps } from "@/interfaces/components.interfaces";

import { X } from "lucide-react";

import BaseButton from "./BaseComponents/BaseButton";

import { Z_INDEX } from "@/constants/pages.constants";
import { bgColors, icons } from "@/constants/components.constants";

export default function AlertModal({
	isOpen,
	type,
	title,
	message,
	isConfirm = false,
	onClose,
	onConfirm,
	confirmText = "ตกลง",
	cancelText = "ยกเลิก",
}: AlertModalProps): React.JSX.Element | null {
	if (!isOpen) return null;

	return (
		<div
			className="animate-in fade-in fixed inset-0 flex items-center justify-center p-4 duration-300"
			style={{ zIndex: Z_INDEX.alertModal }}
		>
			<div
				className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
				role="button"
				tabIndex={0}
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Escape") onClose();
				}}
			/>

			<div className="animate-in zoom-in-95 relative w-full max-w-sm scale-100 transform rounded-3xl border border-slate-100 bg-white p-4 shadow-2xl transition-all duration-200 dark:border-slate-700 dark:bg-slate-800">
				<BaseButton
					className="absolute top-4 right-4 p-2! dark:hover:bg-slate-900"
					size="sm"
					variant="ghost"
					onClick={onClose}
				>
					<X size={20} />
				</BaseButton>

				<div className="flex flex-col items-center text-center">
					<div className={`mb-6 rounded-full p-4 ${bgColors[type]}`}>{icons[type]}</div>

					<h3 className="mb-1 text-xl font-bold text-slate-900 dark:text-white">
						{title}
					</h3>

					<p className="mb-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
						{message}
					</p>

					<div className="flex w-full gap-3">
						{isConfirm ? (
							<>
								<BaseButton
									className="w-full"
									size="lg"
									variant="secondary"
									onClick={onClose}
								>
									{cancelText}
								</BaseButton>
								<BaseButton
									className="w-full"
									size="lg"
									variant={
										type === "success"
											? "success"
											: type === "warning"
												? "warning"
												: type === "error"
													? "danger"
													: type === "info"
														? "link"
														: "primary"
									}
									onClick={() => {
										if (onConfirm) onConfirm();
										onClose();
									}}
								>
									{confirmText}
								</BaseButton>
							</>
						) : (
							<BaseButton
								className="w-full"
								size="lg"
								variant={
									type === "success"
										? "success"
										: type === "warning"
											? "warning"
											: type === "error"
												? "danger"
												: type === "info"
													? "link"
													: "primary"
								}
								onClick={onClose}
							>
								{confirmText}
							</BaseButton>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
