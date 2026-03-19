import type { CreateIncidentData } from "@/interfaces/services.interfaces";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";

import Input from "@/components/InputComponents/Input";
import BaseButton from "@/components/BaseComponents/BaseButton";
import {
	incidentCategoryOptionsSOS,
	mapCategoryColor,
	mapCategoryIcon,
} from "@/constants/pages.constants";
import ToggleSwitch from "@/components/InputComponents/ToggleSwitch";

export default function RequestFormPage(): React.JSX.Element {
	const imageInputRef = useRef<HTMLInputElement>(null);

	const [formData, setFormData] = useState<CreateIncidentData>({
		type: "SUPPLIES",
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

		console.log("Form Data:", formData);
	};

	return (
		<form className="h-full overflow-y-auto pb-30" onSubmit={handleSubmit}>
			{/* Header */}
			<div className="sticky top-0 z-10 flex flex-row items-center justify-between border-b border-slate-200 bg-white/80 p-4 backdrop-blur-lg sm:px-6 dark:border-slate-800 dark:bg-slate-950/80">
				{/* Title */}
				<div className="flex h-full flex-col items-start gap-1">
					<h2 className="line-clamp-1 text-2xl font-black text-slate-900 dark:text-white">
						ขอความช่วยเหลือ
					</h2>
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
						onClick={() => {}}
					>
						ย้อนกลับ
					</BaseButton>

					{/* Save Button */}
					<BaseButton
						className="group"
						rightIcon={
							<ArrowRight
								className="hidden transition-transform duration-300 group-hover:translate-x-1 sm:block"
								size={24}
								strokeWidth={3}
							/>
						}
						size="lg"
						type="submit"
						variant="success"
					>
						ถัดไป
					</BaseButton>
				</div>
			</div>

			{/* Detail Section */}
			<div className="flex flex-col gap-6 p-4 sm:px-6">
				{/* Priority */}
				<div className="flex flex-col gap-1">
					<label
						className="mb-1 text-lg font-semibold text-slate-700 dark:text-slate-300"
						htmlFor="incident-category-form"
					>
						ประเภทเหตุการณ์
						<span className="ml-1 text-red-500">*</span>
					</label>
					<div className="flex flex-row gap-2 sm:gap-3">
						{incidentCategoryOptionsSOS.map((priorityOption) => (
							<div
								key={priorityOption.id}
								aria-checked={formData.type === priorityOption.id}
								className={`relative flex w-full flex-col items-center gap-2 rounded-2xl border-2 p-2 transition-all duration-300 ${
									formData.type === priorityOption.id
										? `border-transparent shadow-lg ${mapCategoryColor[formData.type]} text-white`
										: "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700"
								}`}
								role="radio"
								tabIndex={0}
								onClick={() =>
									setFormData({
										...formData,
										type: priorityOption.id,
									})
								}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										setFormData({
											...formData,
											type: priorityOption.id,
										});
									}
								}}
							>
								<div className="flex flex-col items-center gap-3 pt-3">
									<div
										className={`rounded-xl p-2 transition-all ${formData.type === priorityOption.id ? "bg-white/20" : "bg-white shadow-sm dark:bg-slate-800"}`}
									>
										{mapCategoryIcon[priorityOption.id]}
									</div>
									<span
										className={`text-sm font-semibold tracking-tight text-nowrap ${formData.type === priorityOption.id ? "text-forest-700 dark:text-forest-400" : "text-slate-600 dark:text-slate-400"}`}
									>
										{priorityOption.label}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Name */}
				<Input
					label="ชื่อ-นามสกุล"
					labelClassName="text-lg! font-semibold mb-1"
					placeholder="เช่น สมชาย ใจดี"
					size="xl"
					type="text"
					value={formData.reporterName}
					onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
				/>

				{/* Tel */}
				<Input
					label="เบอร์โทรศัพท์"
					labelClassName="text-lg! font-semibold mb-1"
					placeholder="เช่น 0812345678"
					size="xl"
					type="tel"
					value={formData.phone}
					onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
				/>

				{/* Address */}
				<Input
					label="ที่อยู่หรือจุดสังเกต"
					labelClassName="text-lg! font-semibold mb-1"
					placeholder="เช่น หมู่ 6 ต.ท่าช้าง อ.เมือง จ.สุโขทัย"
					size="xl"
					type="text"
					value={formData.address}
					onChange={(e) => setFormData({ ...formData, address: e.target.value })}
				/>

				{/* Description */}
				<Input
					label="รายละเอียดสถานการณ์"
					labelClassName="text-lg! font-semibold mb-1"
					placeholder="เช่น ขาดแคลนอาหาร มีอาหารเหลือเพียงพอสำหรับ 3 วัน "
					rows={5}
					size="xl"
					type="textarea"
					value={formData.description}
					onChange={(e) => setFormData({ ...formData, description: e.target.value })}
				/>

				{/* Number of Victims */}
				<Input
					label="จำนวนผู้ประสบภัย"
					labelClassName="text-lg! font-semibold mb-1"
					min={0}
					size="xl"
					type="number"
					value={formData.victimCount}
					onChange={(e) =>
						setFormData({ ...formData, victimCount: parseInt(e.target.value) })
					}
				/>

				{/* Bedridden */}
				<ToggleSwitch
					checked={formData.hasBedridden!}
					description="เช่น ผู้สูงอายุที่ต้องการความช่วยเหลือในการอพยพ"
					label="มีผู้ป่วยติดเตียงหรือเคลื่อนไหวลำบาก"
					onChange={(checked) => setFormData({ ...formData, hasBedridden: checked })}
				/>

				<div className="flex flex-col gap-1">
					<label
						className="mb-1 text-lg font-semibold text-slate-700 dark:text-slate-300"
						htmlFor="incident-category-form"
					>
						รูปภาพเหตุการณ์
					</label>

					{formData.image ? (
						<div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
							<img
								alt="Preview Incident"
								className="h-full w-full object-cover"
								src={formData.image}
							/>
						</div>
					) : (
						<BaseButton
							className="w-full rounded-2xl! border-2 border-dashed border-slate-200 bg-slate-50! py-10 dark:border-slate-700 dark:bg-slate-900!"
							size="xl"
							type="button"
							variant="secondary"
							onClick={() => imageInputRef.current?.click()}
						>
							<div className="flex flex-col items-center justify-center gap-6">
								<div className="w-fit rounded-full bg-white p-6 shadow-sm dark:bg-slate-800">
									<Upload size={32} />
								</div>
								<div className="flex flex-col gap-1">
									<span className="text-md font-bold text-slate-500 dark:text-slate-400">
										คลิกเพื่อเลือกไฟล์
									</span>
									<span className="text-sm font-normal text-slate-400">
										รองรับ JPG, PNG ขนาดไม่เกิน 5MB
									</span>
								</div>
							</div>
						</BaseButton>
					)}
				</div>
				<input
					ref={imageInputRef}
					multiple
					accept="image/*"
					className="hidden"
					type="file"
					onChange={handleUploadImage}
				/>
			</div>

			{/* Map Picker Section */}
		</form>
	);
}
