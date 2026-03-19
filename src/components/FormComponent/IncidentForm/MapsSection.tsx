import type { MapsSectionProps } from "@/interfaces/components.interfaces";

import { useState } from "react";
import { Locate } from "lucide-react";

import { useAlert } from "@/providers/AlertContext";
import BaseButton from "@/components/BaseComponents/BaseButton";
import LocationPicker from "@/components/InputComponents/LocationPicker";
import { Z_INDEX } from "@/constants/pages.constants";

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
		<div className="absolute inset-0 flex h-full w-full">
			{/* Map */}
			<div className="relative z-0 h-full w-full">
				<LocationPicker
					lat={formData.location.latitude}
					lng={formData.location.longitude}
					onChange={handleLocationChange}
				/>
			</div>

			{/* Overlay */}
			<div
				className="absolute top-20 right-0 left-0 flex flex-col gap-2 p-4 sm:flex-row sm:px-6"
				style={{ zIndex: Z_INDEX.mapToolOverlay }}
			>
				{/* Location Picker */}
				<BaseButton
					className="w-full rounded-xl border-slate-200! bg-white! text-emerald-600! shadow-md transition-all disabled:opacity-70 dark:border-slate-700! dark:bg-slate-800! dark:text-emerald-500!"
					disabled={isLocating}
					isLoading={isLocating}
					size="md"
					type="button"
					variant="none"
					onClick={handleSetCurrentLocation}
				>
					{!isLocating && <Locate size={16} />}
					{isLocating ? "กำลังค้นหา..." : "ใช้ตำแหน่งปัจจุบัน"}
				</BaseButton>

				<div className="flex w-full flex-row gap-2 text-center font-mono text-sm text-nowrap text-slate-500">
					<span className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-md dark:border-slate-700 dark:bg-slate-800">
						Lat:{" "}
						{formData.location.latitude ? formData.location.latitude.toFixed(6) : "-"}
					</span>
					<span className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-md dark:border-slate-700 dark:bg-slate-800">
						Lng:{" "}
						{formData.location.longitude ? formData.location.longitude.toFixed(6) : "-"}
					</span>
				</div>
			</div>
		</div>
	);
}
