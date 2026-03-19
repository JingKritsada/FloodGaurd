import type { MapsSectionProps } from "@/interfaces/components.interfaces";

import Input from "@/components/InputComponents/Input";

export default function MapsSection({
	formData,
	setFormData,
}: MapsSectionProps): React.JSX.Element {
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

			<span>Map Picker</span>
		</div>
	);
}
