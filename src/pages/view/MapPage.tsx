import type { IncidentCategory } from "@/types/services.types";
import type { Map } from "leaflet";

import { useState } from "react";
import { Filter, LocateFixed, Minus, Plus, RefreshCw } from "lucide-react";

import { Z_INDEX } from "@/constants/pages.constants";
import { CENTER_LOCATION } from "@/constants/components.constants";
import BaseButton from "@/components/BaseComponents/BaseButton";
import FilterModal from "@/components/ModalComponent/FilterModal";
import MapBoard from "@/components/MapBoard";
import { useAlert } from "@/providers/AlertContext";

export default function MapPage(): React.JSX.Element {
	const [mapRef, setMapRef] = useState<Map | null>(null);
	const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
	const [mapFilter, setMapFilter] = useState<IncidentCategory[]>([]);
	const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);

	const { showAlert } = useAlert();

	const handleLocateUser = () => {
		if (!navigator.geolocation) return;
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const lat = position.coords.latitude;
				const lng = position.coords.longitude;
				setUserPosition({ lat, lng });
				if (mapRef) {
					mapRef.flyTo([lat, lng], 15);
				}
			},
			(error) => {
				showAlert("ข้อผิดพลาด", `ไม่สามารถระบุตำแหน่งของคุณได้: ${error.message}`, "error");
				setUserPosition(null);
			}
		);
	};

	const handleLocateCenter = () => {
		if (mapRef) {
			mapRef.flyTo([CENTER_LOCATION.lat, CENTER_LOCATION.lng], 13);
		}
	};

	const handleZoomIn = () => {
		if (mapRef) {
			mapRef.zoomIn();
		}
	};

	const handleZoomOut = () => {
		if (mapRef) {
			mapRef.zoomOut();
		}
	};

	return (
		<div className="flex h-full flex-col overflow-hidden">
			<div className="relative flex grow overflow-hidden">
				{/* Map */}
				<div className="relative z-0 h-full w-full">
					{/* Placeholder for Map */}
					<MapBoard
						draggable={!isFilterModalOpen}
						setMapRef={setMapRef}
						userLocation={userPosition}
					/>
				</div>

				{/* Map Tool Overlay */}
				<div
					className="absolute top-4 right-4 flex flex-col gap-2 sm:right-6"
					style={{ zIndex: Z_INDEX.mapToolOverlay }}
				>
					<BaseButton
						isIconOnly
						className="p-2.5! shadow-xl"
						leftIcon={<Filter size={24} />}
						size="xl"
						variant="secondary"
						onClick={() => {
							setIsFilterModalOpen(true);
						}}
					/>

					{/* Locate User */}
					<BaseButton
						isIconOnly
						className="p-2.5! shadow-xl"
						leftIcon={<LocateFixed size={24} />}
						size="xl"
						variant="secondary"
						onClick={handleLocateUser}
					/>

					{/* Locate CENTER */}
					<BaseButton
						isIconOnly
						className="group p-2.5! shadow-xl"
						leftIcon={
							<RefreshCw
								className="transition-transform duration-300 group-hover:rotate-90"
								size={24}
							/>
						}
						size="xl"
						variant="secondary"
						onClick={handleLocateCenter}
					/>
				</div>

				{/* Zoom Overlay */}
				<div
					className="absolute top-4 left-4 flex flex-col gap-2 sm:left-6"
					style={{ zIndex: Z_INDEX.mapToolOverlay }}
				>
					{/* Zoom In */}
					<BaseButton
						isIconOnly
						className="p-2.5! shadow-xl"
						leftIcon={<Plus size={24} />}
						size="xl"
						variant="secondary"
						onClick={handleZoomIn}
					/>

					{/* Zoom Out */}
					<BaseButton
						isIconOnly
						className="p-2.5! shadow-xl"
						leftIcon={<Minus size={24} />}
						size="xl"
						variant="secondary"
						onClick={handleZoomOut}
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
