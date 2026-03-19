import type { CreateIncidentData } from "@/interfaces/services.interfaces";

import { incidentCategoryOptionsSOS } from "@/constants/pages.constants";
import IncidentForm from "@/components/FormComponent/IncidentForm/IncidentForm";

export default function RequestFormPage(): React.JSX.Element {
	const handleSubmit = async (formData: CreateIncidentData) => {
		console.log("Form Data:", formData);
	};

	return (
		<IncidentForm
			categoryOptions={incidentCategoryOptionsSOS}
			defaultType="SUPPLIES"
			title="ขอความช่วยเหลือ"
			onSubmitForm={handleSubmit}
		/>
	);
}
