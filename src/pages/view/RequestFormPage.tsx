import type { CreateIncidentData } from "@/interfaces/services.interfaces";

import { useNavigate } from "react-router-dom";

import { useAlert } from "@/providers/AlertContext";
import { getErrorMessage } from "@/services/api";
import { incidentCategoryOptionsSOS } from "@/constants/pages.constants";
import incidentService from "@/services/incidentService";
import IncidentForm from "@/components/FormComponent/IncidentForm/IncidentForm";

export default function RequestFormPage(): React.JSX.Element {
	const navigate = useNavigate();
	const { showAlert } = useAlert();

	const handleSubmit = async (formData: CreateIncidentData) => {
		try {
			await incidentService.create(formData);

			showAlert(
				"สำเร็จ",
				"คุณได้ขอความช่วยเหลือเรียบร้อยแล้ว เจ้าหน้าที่จะดำเนินการตรวจสอบและให้ความช่วยเหลือต่อไป",
				"success"
			);

			navigate("/");
		} catch (error) {
			showAlert(
				"ข้อผิดพลาด",
				`ไม่สามารถขอความช่วยเหลือได้: ${getErrorMessage(error)}`,
				"error"
			);
		}
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
