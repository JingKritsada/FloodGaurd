import type { MapsSectionProps } from "@/interfaces/components.interfaces";

import { useState } from "react";
import { Locate } from "lucide-react";

import { useAlert } from "@/providers/AlertContext";
import Input from "@/components/InputComponents/Input";
import BaseButton from "@/components/BaseComponents/BaseButton";
import LocationPicker from "@/components/InputComponents/LocationPicker";

export default function MapsSection({
	formData,
	setFormData,
}: MapsSectionProps): React.JSX.Element {
	const { showAlert } = useAlert();

	const [isLocating, setIsLocating] = useState(false);

	const handleSetCurrentLocation = () => {
		if (!navigator.geolocation) {
			showAlert("ข้อผิดพลาด", "เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง", "error");

			return;
		}

		setIsLocating(true);

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setFormData({
					...formData,
					location: {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					},
				});

				setTimeout(() => {
					setIsLocating(false);
				}, 1000);
			},
			(error) => {
				if (error.code) {
					// GeolocationPositionError code is intentionally silenced; the user sees the alert below
				}
				showAlert(
					"ข้อผิดพลาด",
					"ไม่สามารถระบุตำแหน่งได้ กรุณาตรวจสอบการอนุญาตใช้งาน GPS",
					"error"
				);
				setIsLocating(false);
			}
		);
	};

	const handleLocationChange = (lat: number, lng: number) => {
		setFormData({
			...formData,
			location: {
				latitude: lat,
				longitude: lng,
			},
		});
	};

	return (
		<div className="flex flex-col gap-6 p-4 sm:px-6">
			{/* Address */}
			<Input
				label="ที่อยู่หรือจุดสังเกต"
				labelClassName="text-lg! font-semibold mb-1"
				placeholder="เช่น หมู่ 6 ต.ท่าช้าง อ.เมือง จ.สุโขทัย"
				rows={3}
				size="xl"
				type="textarea"
				value={formData.address || ""}
				onChange={(e) => setFormData({ ...formData, address: e.target.value })}
			/>

			{/* Location Picker */}
			<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
				<div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
					<div className="mb-1 text-lg! font-semibold text-nowrap">
						ตำแหน่งพิกัดบนแผนที่ (GPS) <span className="ml-1 text-red-500">*</span>
					</div>

					<BaseButton
						className="w-full rounded-lg text-emerald-600! shadow-sm transition-all disabled:opacity-50 sm:w-auto sm:rounded-xl sm:py-2 dark:text-emerald-500!"
						disabled={isLocating}
						isLoading={isLocating}
						size="sm"
						type="button"
						variant="outline"
						onClick={handleSetCurrentLocation}
					>
						{!isLocating && <Locate size={16} />}
						{isLocating ? "กำลังค้นหา..." : "ใช้ตำแหน่งปัจจุบัน"}
					</BaseButton>
				</div>

				<div className="h-72 overflow-hidden rounded-xl shadow-md sm:h-96">
					<LocationPicker
						lat={formData.location.latitude}
						lng={formData.location.longitude}
						onChange={handleLocationChange}
					/>
				</div>

				<div className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs text-slate-500">
					<span className="line-clamp-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800">
						Lat:{" "}
						{formData.location.latitude ? formData.location.latitude.toFixed(6) : "-"}
					</span>
					<span className="line-clamp-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800">
						Lng:{" "}
						{formData.location.longitude ? formData.location.longitude.toFixed(6) : "-"}
					</span>
				</div>
			</div>
		</div>
	);
}
