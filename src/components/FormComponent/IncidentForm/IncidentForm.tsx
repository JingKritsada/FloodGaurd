import type { CreateIncidentData } from "@/interfaces/services.interfaces";
import type { IncidentFormProps } from "@/interfaces/components.interfaces";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

import MapsSection from "./MapsSection";
import DetailSection from "./DetailSection";

import BaseButton from "@/components/BaseComponents/BaseButton";

export default function IncidentForm({
	categoryOptions,
	defaultType,
	title,
	onSubmitForm,
}: IncidentFormProps): React.JSX.Element {
	const navigate = useNavigate();

	const [sectionTab, setSectionTab] = useState<"DETAIL" | "MAP">("DETAIL");
	const [formData, setFormData] = useState<CreateIncidentData>({
		type: defaultType,
		status: "OPEN",
		description: "",
		location: {
			latitude: 0,
			longitude: 0,
		},
		victimCount: 0,
		hasBedridden: false,
	});

	const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setFormData({ ...formData, image: reader.result as string });
			};

			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await onSubmitForm(formData);
	};

	return (
		<form className="h-full overflow-y-auto pb-30" onSubmit={handleSubmit}>
			{/* Header */}
			<div className="sticky top-0 z-10 flex flex-row items-center justify-between border-b border-slate-200 bg-white p-4 backdrop-blur-lg sm:px-6 dark:border-slate-800 dark:bg-slate-950">
				{/* Title */}
				<div className="flex h-full flex-col items-start gap-1">
					<h2 className="text-2xl font-black text-slate-900 dark:text-white">{title}</h2>
				</div>

				{/* Action Buttons */}
				<div className="flex h-full flex-row items-center justify-start gap-2">
					{/* Back Button */}
					<BaseButton
						className="group"
						leftIcon={
							<ArrowLeft
								className="hidden transition-transform duration-300 group-hover:-translate-x-1 sm:block"
								size={24}
								strokeWidth={3}
							/>
						}
						size="lg"
						variant="secondary"
						onClick={() => {
							if (sectionTab === "DETAIL") {
								navigate("/");
							} else {
								setSectionTab("DETAIL");
							}
						}}
					>
						{sectionTab === "DETAIL" ? "ยกเลิก" : "ย้อนกลับ"}
					</BaseButton>

					{/* Save Button */}
					<BaseButton
						className="group"
						rightIcon={
							sectionTab === "DETAIL" ? (
								<ArrowRight
									className="hidden transition-transform duration-300 group-hover:translate-x-1 sm:block"
									size={24}
									strokeWidth={3}
								/>
							) : (
								<Save className="hidden sm:block" size={24} strokeWidth={3} />
							)
						}
						size="lg"
						type={sectionTab === "DETAIL" ? "button" : "submit"}
						variant="success"
						onClick={() => {
							if (sectionTab === "DETAIL") {
								setSectionTab("MAP");
							}
						}}
					>
						{sectionTab === "DETAIL" ? "ถัดไป" : "บันทึก"}
					</BaseButton>
				</div>
			</div>

			{/* Detail Section */}
			{sectionTab === "DETAIL" && (
				<DetailSection
					categoryOptions={categoryOptions}
					formData={formData}
					handleUploadImage={handleUploadImage}
					setFormData={setFormData}
				/>
			)}

			{/* Map Picker Section */}
			{sectionTab === "MAP" && <MapsSection formData={formData} setFormData={setFormData} />}
		</form>
	);
}
