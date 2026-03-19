import type { CreateAnnouncementData } from "@/interfaces/services.interfaces";

import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Input from "@/components/InputComponents/Input";
import BaseButton from "@/components/BaseComponents/BaseButton";
import announcementService from "@/services/announcementService";
import { getErrorMessage } from "@/services/api";
import { useAuth } from "@/providers/AuthContext";
import { useAlert } from "@/providers/AlertContext";
import {
	annoucementPriorityOptionsForm,
	mapPriorityColor,
	mapPriorityIcon,
} from "@/constants/pages.constants";
import ToggleSwitch from "@/components/InputComponents/ToggleSwitch";

export default function AnnouncementFormPage(): React.JSX.Element {
	const { id } = useParams();
	const { showAlert } = useAlert();
	const { currentRole } = useAuth();

	const navigate = useNavigate();
	const isEditMode = !!id;

	const [formData, setFormData] = useState<CreateAnnouncementData>({
		title: "",
		content: "",
		priority: "MEDIUM",
		isPublished: false,
		createdBy: currentRole || "ADMIN",
		image: "",
	});

	useEffect(() => {
		if (isEditMode && id) {
			const fetchAnnouncement = async () => {
				try {
					const announcement = await announcementService.getById(id);

					setFormData({
						title: announcement.title,
						content: announcement.content,
						priority: announcement.priority,
						isPublished: announcement.isPublished || false,
						createdBy: announcement.createdBy,
						image: announcement.image || "",
					});
				} catch (error) {
					showAlert(
						"ข้อผิดพลาด",
						`ไม่สามารถโหลดข้อมูลประกาศได้: ${getErrorMessage(error)}`,
						"error"
					);
					navigate(-1);
				}
			};

			fetchAnnouncement();
		}
	}, [isEditMode, id]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			if (isEditMode && id) {
				await announcementService.update(id, formData);
			} else {
				await announcementService.create(formData);
			}

			showAlert(
				"สำเร็จ",
				`ประกาศถูก${isEditMode ? "อัปเดต" : "สร้าง"}เรียบร้อยแล้ว`,
				"success"
			);

			navigate("/announcements");
		} catch (error) {
			showAlert(
				"ข้อผิดพลาด",
				`ไม่สามารถ${isEditMode ? "อัปเดต" : "สร้าง"}ประกาศได้: ${getErrorMessage(error)}`,
				"error"
			);
		}
	};

	return (
		<form className="h-full overflow-y-auto pb-28" onSubmit={handleSubmit}>
			{/* Header */}
			<div className="sticky top-0 z-10 flex flex-row items-center justify-between border-b border-slate-200 bg-white/80 p-4 backdrop-blur-lg sm:px-6 dark:border-slate-800 dark:bg-slate-950/80">
				{/* Title */}
				<div className="flex h-full flex-col items-start gap-1">
					<h2 className="text-2xl font-black text-slate-900 dark:text-white">
						{isEditMode ? "แก้ไขประกาศ" : "สร้างประกาศใหม่"}
					</h2>

					{isEditMode && id && (
						<span className="font-mono text-xs text-slate-500 uppercase"># {id}</span>
					)}
				</div>

				<div className="flex h-full flex-row items-center justify-start gap-2">
					{/* Back Button */}
					<BaseButton
						leftIcon={<ArrowLeft className="hidden sm:block" size={24} />}
						size="lg"
						variant="secondary"
						onClick={() => navigate("/announcements")}
					>
						ยกเลิก
					</BaseButton>

					{/* Save Button */}
					<BaseButton
						leftIcon={<Save className="hidden sm:block" size={24} />}
						size="lg"
						type="submit"
						variant="success"
					>
						บันทึก
					</BaseButton>
				</div>
			</div>

			{/* Form */}
			<div className="flex flex-col gap-6 p-4 sm:px-6">
				{/* Title */}
				<Input
					isRequired
					label="หัวข้อประกาศ"
					labelClassName="text-lg! font-semibold mb-1"
					placeholder="เช่น แจ้งเตือนน้ำท่วมฉับพลันในพื้นที่ XYZ"
					size="xl"
					type="text"
					value={formData.title}
					onChange={(e) => setFormData({ ...formData, title: e.target.value })}
				/>

				{/* Priority */}
				<div className="flex flex-col gap-1">
					<label
						className="text-lg font-semibold text-slate-700 dark:text-slate-300"
						htmlFor={id}
					>
						ระดับความสำคัญ
						<span className="ml-1 text-red-500">*</span>
					</label>
					<div className="grid grid-cols-3 gap-3">
						{annoucementPriorityOptionsForm.map((priorityOption) => (
							<div
								key={priorityOption.id}
								aria-checked={formData.priority === priorityOption.id}
								className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 p-2 transition-all duration-300 ${
									formData.priority === priorityOption.id
										? `border-transparent shadow-lg ${mapPriorityColor[formData.priority]} text-white`
										: "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700"
								}`}
								role="radio"
								tabIndex={0}
								onClick={() =>
									setFormData({
										...formData,
										priority: priorityOption.id,
									})
								}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										setFormData({
											...formData,
											priority: priorityOption.id,
										});
									}
								}}
							>
								<div className="flex flex-col items-center gap-3 pt-3">
									<div
										className={`rounded-xl p-2 transition-all ${formData.priority === priorityOption.id ? "bg-white/20" : "bg-white shadow-sm dark:bg-slate-800"}`}
									>
										{mapPriorityIcon[priorityOption.id]}
									</div>
									<span
										className={`text-sm font-semibold ${formData.priority === priorityOption.id ? "text-forest-700 dark:text-forest-400" : "text-slate-600 dark:text-slate-400"}`}
									>
										{priorityOption.label}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Content */}
				<Input
					isRequired
					label="เนื้อหาประกาศ"
					labelClassName="text-lg! font-semibold mb-1"
					placeholder="เช่น น้ำท่วมฉับพลันในพื้นที่ XYZ วันที่ 16 ตุลาคม 2567 รวมถึงคำแนะนำในการปฏิบัติตัวและข้อมูลติดต่อฉุกเฉิน"
					rows={5}
					size="xl"
					type="textarea"
					value={formData.content}
					onChange={(e) => setFormData({ ...formData, content: e.target.value })}
				/>

				{/* Image URL */}
				<div>
					<Input
						inputClassName="font-mono text-base"
						label="รูปภาพ (URL)"
						labelClassName="text-lg! font-semibold mb-1"
						placeholder="https://example.com/image.jpg"
						size="xl"
						type="url"
						value={formData.image}
						onChange={(e) => setFormData({ ...formData, image: e.target.value })}
					/>

					{formData.image && (
						<div className="mt-3 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
							<img
								alt="Preview"
								className="h-48 w-full object-cover"
								src={formData.image}
							/>
						</div>
					)}
				</div>

				<ToggleSwitch
					checked={formData.isPublished || false}
					description="หากไม่เลือก ประกาศจะถูกบันทึกเป็นร่าง"
					label="เผยแพร่ประกาศทันที"
					onChange={(checked) => setFormData({ ...formData, isPublished: checked })}
				/>
			</div>
		</form>
	);
}
