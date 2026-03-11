import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import type { Location } from "@/interfaces/incidents.interfaces";
import type { IncidentType, OfficerReportMode, ReportType } from "@/types/index.types";
import { incidentsService } from "@/services/incidents.service";
import { useAuth } from "@/providers/AuthContext";

export function useReportForm() {
	const { userRole } = useAuth();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const rawType = searchParams.get("type");
	const reportType: ReportType = rawType === "TRAFFIC" ? "TRAFFIC" : "SOS";

	const [officerReportMode, setOfficerReportMode] = useState<OfficerReportMode>("NONE");
	const [formLocation, setFormLocation] = useState<Location | null>(null);
	const [draftPoints, setDraftPoints] = useState<Location[]>([]);
	const [formType, setFormType] = useState<IncidentType>("MEDICAL");
	const [formDesc, setFormDesc] = useState("");
	const [victimCount, setVictimCount] = useState(1);
	const [hasBedridden, setHasBedridden] = useState(false);
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");

	const resetForm = () => {
		setOfficerReportMode("NONE");
		setFormLocation(null);
		setDraftPoints([]);
		setFormDesc("");
		setVictimCount(1);
		setHasBedridden(false);
		setPhone("");
		setAddress("");
	};

	const handleSubmit = async () => {
		const isRoad = officerReportMode === "ROAD_CLOSURE";
		const isLevee = officerReportMode === "LEVEE";

		const type: IncidentType = isRoad ? "ROAD_BLOCKED" : isLevee ? "LEVEE_BREACH" : formType;
		const location = formLocation ?? (draftPoints[0] ?? { lat: 17.007, lng: 99.826 });

		const payload: Record<string, unknown> = {
			type,
			description: formDesc.trim() || "ไม่มีรายละเอียด",
			location: { latitude: location.lat, longitude: location.lng },
			reporterName: userRole === "CITIZEN" ? "พลเมืองดี" : userRole,
			...(isRoad && draftPoints.length > 0 ? { path: draftPoints.map((p) => ({ lat: p.lat, lng: p.lng })) } : {}),
			...(userRole === "CITIZEN" ? { victimCount, hasBedridden, phone, address } : {}),
		};

		try {
			await incidentsService.createIncident(payload);
			resetForm();
			navigate("/");
		} catch (e) {
			console.error(e);
		}
	};

	return {
		userRole, reportType,
		officerReportMode, setOfficerReportMode,
		formLocation, setFormLocation,
		draftPoints, setDraftPoints,
		formType, setFormType,
		formDesc, setFormDesc,
		victimCount, setVictimCount,
		hasBedridden, setHasBedridden,
		phone, setPhone,
		address, setAddress,
		handleSubmit,
		resetForm,
	};
}
