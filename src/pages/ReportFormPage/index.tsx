import { useReportForm } from "@/pages/ReportFormPage/hooks/useReportForm";
import CitizenReportSection from "@/pages/ReportFormPage/sections/CitizenReportSection";
import OfficerReportSection from "@/pages/ReportFormPage/sections/OfficerReportSection";
import { useNavigate } from "react-router-dom";

export default function ReportFormPage() {
	const navigate = useNavigate();
	const form = useReportForm();

	if (form.userRole === "CITIZEN") {
		return (
			<CitizenReportSection
				reportType={form.reportType}
				formLocation={form.formLocation}
				formType={form.formType}
				formDesc={form.formDesc}
				victimCount={form.victimCount}
				hasBedridden={form.hasBedridden}
				phone={form.phone}
				address={form.address}
				setFormLocation={form.setFormLocation}
				setFormType={form.setFormType}
				setFormDesc={form.setFormDesc}
				setVictimCount={form.setVictimCount}
				setHasBedridden={form.setHasBedridden}
				setPhone={form.setPhone}
				setAddress={form.setAddress}
				onSubmit={form.handleSubmit}
				onCancel={() => navigate("/")}
			/>
		);
	}

	return (
		<OfficerReportSection
			officerReportMode={form.officerReportMode}
			formLocation={form.formLocation}
			draftPoints={form.draftPoints}
			formDesc={form.formDesc}
			formType={form.formType}
			setOfficerReportMode={form.setOfficerReportMode}
			setFormLocation={form.setFormLocation}
			setDraftPoints={form.setDraftPoints}
			setFormDesc={form.setFormDesc}
			setFormType={form.setFormType}
			onSubmit={form.handleSubmit}
			onCancel={() => navigate("/")}
		/>
	);
}
