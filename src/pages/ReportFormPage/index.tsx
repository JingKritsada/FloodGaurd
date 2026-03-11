import { useNavigate } from "react-router-dom";

import { useReportForm } from "@/pages/ReportFormPage/hooks/useReportForm";
import CitizenReportSection from "@/pages/ReportFormPage/sections/CitizenReportSection";
import OfficerReportSection from "@/pages/ReportFormPage/sections/OfficerReportSection";

export default function ReportFormPage() {
	const navigate = useNavigate();
	const form = useReportForm();

	if (form.userRole === "CITIZEN") {
		return (
			<CitizenReportSection
				address={form.address}
				formDesc={form.formDesc}
				formLocation={form.formLocation}
				formType={form.formType}
				hasBedridden={form.hasBedridden}
				phone={form.phone}
				reportType={form.reportType}
				setAddress={form.setAddress}
				setFormDesc={form.setFormDesc}
				setFormLocation={form.setFormLocation}
				setFormType={form.setFormType}
				setHasBedridden={form.setHasBedridden}
				setPhone={form.setPhone}
				setVictimCount={form.setVictimCount}
				victimCount={form.victimCount}
				onCancel={() => navigate("/")}
				onSubmit={form.handleSubmit}
			/>
		);
	}

	return (
		<OfficerReportSection
			draftPoints={form.draftPoints}
			formDesc={form.formDesc}
			formLocation={form.formLocation}
			formType={form.formType}
			officerReportMode={form.officerReportMode}
			setDraftPoints={form.setDraftPoints}
			setFormDesc={form.setFormDesc}
			setFormLocation={form.setFormLocation}
			setFormType={form.setFormType}
			setOfficerReportMode={form.setOfficerReportMode}
			onCancel={() => navigate("/")}
			onSubmit={form.handleSubmit}
		/>
	);
}
