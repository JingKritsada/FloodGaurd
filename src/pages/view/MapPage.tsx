import type { IncidentCategory } from "@/types/services.types";

import { useState } from "react";
import { Filter, LocateFixed, Minus, Plus, RefreshCw } from "lucide-react";

import { Z_INDEX } from "@/constants/pages.constants";
import BaseButton from "@/components/BaseComponents/BaseButton";
import FilterModal from "@/components/ModalComponent/FilterModal";

export default function MapPage(): React.JSX.Element {
	const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
	const [mapFilter, setMapFilter] = useState<IncidentCategory[]>([]);

	return (
		<div className="flex h-full flex-col overflow-hidden">
			<div className="relative flex grow overflow-hidden">
				{/* Map */}

				{/* Map Tool Overlay */}
				<div
					className="absolute top-4 right-4 flex flex-col gap-2 sm:right-6"
					style={{ zIndex: Z_INDEX.mapToolOverlay }}
				>
					<BaseButton
						isIconOnly
						className="p-2.5!"
						leftIcon={<Filter size={24} />}
						size="xl"
						variant="secondary"
						onClick={() => {
							setIsFilterModalOpen(true);
						}}
					/>

					<BaseButton
						isIconOnly
						className="p-2.5!"
						leftIcon={<LocateFixed size={24} />}
						size="xl"
						variant="secondary"
						onClick={() => {}}
					/>

					<BaseButton
						isIconOnly
						className="group p-2.5!"
						leftIcon={
							<RefreshCw
								className="transition-transform duration-300 group-hover:rotate-90"
								size={24}
							/>
						}
						size="xl"
						variant="secondary"
						onClick={() => {}}
					/>
				</div>

				{/* Zoom Overlay */}
				<div
					className="absolute top-4 left-4 flex flex-col gap-2 sm:right-6"
					style={{ zIndex: Z_INDEX.mapToolOverlay }}
				>
					<BaseButton
						isIconOnly
						className="p-2.5!"
						leftIcon={<Plus size={24} />}
						size="xl"
						variant="outline"
						onClick={() => {}}
					/>

					<BaseButton
						isIconOnly
						className="p-2.5!"
						leftIcon={<Minus size={24} />}
						size="xl"
						variant="outline"
						onClick={() => {}}
					/>
				</div>
			</div>

			{/* Filter Modal */}
			<FilterModal
				currentFilters={mapFilter}
				isOpen={isFilterModalOpen}
				onApply={(filters) => setMapFilter(filters)}
				onClose={() => setIsFilterModalOpen(false)}
				onReset={() => setMapFilter([])}
			/>
		</div>
	);
}
