import type { IncidentCategory } from "@/types/services.types";
import type { FilterModalProps } from "@/interfaces/components.interfaces";

import { useState } from "react";
import { X, Check, RefreshCw } from "lucide-react";

import BaseButton from "@/components/BaseComponents/BaseButton";
import { incidentCategories } from "@/constants/components.constants";
import { Z_INDEX } from "@/constants/pages.constants";

export default function FilterModal({
	isOpen,
	currentFilters,
	onApply,
	onClose,
	onReset,
}: FilterModalProps) {
	const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
	const [tempFilters, setTempFilters] = useState<IncidentCategory[]>(currentFilters);

	// Sync state when modal opens
	if (isOpen !== prevIsOpen) {
		setPrevIsOpen(isOpen);
		if (isOpen) {
			setTempFilters(currentFilters);
		}
	}

	const toggleFilter = (categoryId: IncidentCategory) => {
		setTempFilters((prev) =>
			prev.includes(categoryId) ? prev.filter((t) => t !== categoryId) : [...prev, categoryId]
		);
	};

	const handleApply = () => {
		onApply(tempFilters);
		onClose();
	};

	const handleLocalReset = () => {
		setTempFilters([]);
		if (onReset) onReset();
	};

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 flex items-center justify-center p-6 pb-30"
			style={{ zIndex: Z_INDEX.filterModal }}
		>
			{/* Backdrop */}
			<div
				className="animate-in fade-in absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-200"
				role="button"
				tabIndex={0}
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Escape") onClose();
				}}
			/>

			{/* Modal Content */}
			<div className="relative flex max-h-[80vh] w-full max-w-md flex-col rounded-3xl rounded-t-3xl bg-white shadow-2xl duration-300 dark:bg-slate-900">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-slate-100 p-4 pt-6 dark:border-slate-800">
					<h3 className="text-xl font-bold text-slate-900 dark:text-white">
						ตัวกรอง (Filter)
					</h3>
					<BaseButton className="p-2!" size="md" variant="ghost" onClick={onClose}>
						<X size={24} />
					</BaseButton>
				</div>

				{/* Scrollable Content */}
				<div className="grow overflow-y-auto p-4">
					{/* Section: Filter */}
					<div>
						<h4 className="mb-3 text-sm font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
							ประเภทเหตุการณ์
						</h4>

						<div className="grid grid-cols-2 gap-3">
							{incidentCategories.map((type) => {
								const isSelected = tempFilters.includes(type.id);

								return (
									<button
										key={type.id}
										className={`relative flex h-18 flex-col items-center justify-center gap-2 rounded-xl border-2 p-3 transition-all ${
											isSelected
												? "border-gold-500 bg-gold-50 text-gold-800 dark:bg-gold-900/20 dark:text-gold-300"
												: "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600"
										} `}
										onClick={() => toggleFilter(type.id)}
									>
										{isSelected && (
											<div className="absolute top-2 right-2 text-gold-600">
												<Check size={16} strokeWidth={3} />
											</div>
										)}
										<span className="text-md text-center font-semibold">
											{type.label}
										</span>
									</button>
								);
							})}
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="rounded-b-3xl border-t border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
					<div className="flex gap-3">
						<BaseButton
							className="group flex-1 rounded-xl!"
							leftIcon={
								<RefreshCw className="transition-transform duration-300 group-hover:rotate-90" />
							}
							size="lg"
							variant="outline"
							onClick={handleLocalReset}
						>
							ล้างค่า
						</BaseButton>
						<BaseButton
							className="flex-1 rounded-xl!"
							size="lg"
							variant="primary"
							onClick={handleApply}
						>
							ยืนยัน
						</BaseButton>
					</div>
				</div>
			</div>
		</div>
	);
}
