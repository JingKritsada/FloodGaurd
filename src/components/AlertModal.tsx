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
			className="fixed inset-0 flex items-center justify-center p-4 animate-in fade-in duration-300"
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

			<div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-sm w-full p-4 transform scale-100 transition-all animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-700">
				<BaseButton
					className="absolute top-4 right-4 p-2! dark:hover:bg-slate-900"
					size="sm"
					variant="ghost"
					onClick={onClose}
				>
					<X size={20} />
				</BaseButton>

				<div className="flex flex-col items-center text-center">
					<div className={`p-4 rounded-full mb-6 ${bgColors[type]}`}>{icons[type]}</div>

					<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
						{title}
					</h3>

					<p className="text-slate-500 dark:text-slate-400 mb-6 text-sm leading-relaxed">
						{message}
					</p>

					<div className="flex gap-3 w-full">
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
