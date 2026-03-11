import type { MapFilter } from "@/pages/MapPage/hooks/useMapPage";

import { AlertTriangle, Bell, Home, Map as MapIcon, Waves } from "lucide-react";

interface MapFiltersProps {
	filter: MapFilter;
	onFilterChange: (f: MapFilter) => void;
}

const FILTERS: { id: MapFilter; icon: React.ReactNode; label: string }[] = [
	{ id: "ALL", icon: <MapIcon size={18} />, label: "ทั้งหมด" },
	{ id: "SOS", icon: <Bell size={18} />, label: "SOS" },
	{ id: "TRAFFIC", icon: <AlertTriangle size={18} />, label: "จราจร" },
	{ id: "SHELTER", icon: <Home size={18} />, label: "ที่พักพิง" },
	{ id: "WATER", icon: <Waves size={18} />, label: "ระดับน้ำ" },
];

export default function MapFilters({ filter, onFilterChange }: MapFiltersProps) {
	return (
		<div className="absolute top-4 left-4 flex flex-col gap-2 z-[1000] pointer-events-auto">
			{FILTERS.map((f) => (
				<button
					key={f.id}
					className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs shadow-lg transition-all border ${
						filter === f.id
							? "bg-amber-600 text-white border-amber-700 shadow-amber-600/30"
							: "bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-white/20 hover:bg-amber-50 dark:hover:bg-slate-800"
					}`}
					onClick={() => onFilterChange(f.id)}
				>
					{f.icon}
					<span>{f.label}</span>
				</button>
			))}
		</div>
	);
}
