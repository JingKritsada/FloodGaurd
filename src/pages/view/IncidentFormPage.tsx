import type { CreateIncidentData } from "@/interfaces/services.interfaces";

import { incidentCategoryOptionsReport } from "@/constants/pages.constants";
import IncidentForm from "@/components/FormComponent/IncidentForm/IncidentForm";

export default function IncidentFormPage(): React.JSX.Element {
	const handleSubmit = async (formData: CreateIncidentData) => {
		console.log("Form Data:", formData);
	};

	return (
		<IncidentForm
			categoryOptions={incidentCategoryOptionsReport}
			defaultType="LEVEE_BREACH"
			title="แจ้งสถานการณ์"
			onSubmitForm={handleSubmit}
		/>
	);
}
