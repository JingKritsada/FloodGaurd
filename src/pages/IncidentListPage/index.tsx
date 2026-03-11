import { useNavigate } from "react-router-dom";

import { DEFAULT_REPORTER_NAME } from "@/constants/incidents.constants";
import { useAuth } from "@/providers/AuthContext";
import { useIncidentList } from "@/pages/IncidentListPage/hooks/useIncidentList";
import IncidentListSection from "@/pages/IncidentListPage/sections/IncidentListSection";

export default function IncidentListPage() {
	const { userRole } = useAuth();
	const navigate = useNavigate();
	const { incidents, loading, error, handleStatusUpdate } = useIncidentList();

	const visibleIncidents =
		userRole === "CITIZEN"
			? incidents.filter((i) => i.reporterName !== DEFAULT_REPORTER_NAME && i.reporterName !== "")
			: incidents;

	const handleViewOnMap = () => {
		navigate("/");
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-full text-slate-400 font-bold">
				กำลังโหลด...
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-full text-red-500 font-bold">
				{error}
			</div>
		);
	}

	return (
		<IncidentListSection
			incidents={visibleIncidents}
			role={userRole}
			onStatusUpdate={handleStatusUpdate}
			onViewOnMap={handleViewOnMap}
		/>
	);
}
