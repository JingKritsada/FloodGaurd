import { FILTER_LABELS } from "@/constants/incidents.constants";
import { useAuth } from "@/providers/AuthContext";
import { useMapPage } from "@/pages/MapPage/hooks/useMapPage";
import MapSection from "@/pages/MapPage/sections/MapSection";
import MapFilters from "@/pages/MapPage/sections/MapFilters";
import IncidentModal from "@/pages/MapPage/sections/IncidentModal";

export default function MapPage() {
	const { userRole } = useAuth();
	const {
		incidents, roads, shelters,
		selectedIncident, setSelectedIncident,
		filter, filterToast,
		handleStatusUpdate, handleFilterChange,
	} = useMapPage();

	return (
		<div className="relative w-full h-full">
			<MapSection
				incidents={incidents}
				roads={roads}
				shelters={shelters}
				filter={filter}
				onMarkerClick={setSelectedIncident}
			/>

			<MapFilters filter={filter} onFilterChange={handleFilterChange} />

			{filterToast && (
				<div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1100] pointer-events-none">
					<div className="bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl border border-white/20">
						{FILTER_LABELS[filterToast] ?? filterToast}
					</div>
				</div>
			)}

			<IncidentModal
				incident={selectedIncident}
				onClose={() => setSelectedIncident(null)}
				role={userRole}
				onStatusUpdate={handleStatusUpdate}
			/>
		</div>
	);
}
