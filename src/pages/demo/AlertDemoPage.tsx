import type { AlertType } from "@/types/components.types";

import BaseButton from "@/components/BaseComponents/BaseButton";
import { useAlert } from "@/providers/AlertContext";

const alertTypes: { type: AlertType; title: string; message: string }[] = [
	{
		type: "success",
		title: "สำเร็จ",
		message: "ดำเนินการเรียบร้อยแล้ว",
	},
	{
		type: "error",
		title: "เกิดข้อผิดพลาด",
		message: "ไม่สามารถดำเนินการได้ กรุณาลองใหม่อีกครั้ง",
	},
	{
		type: "warning",
		title: "คำเตือน",
		message: "การดำเนินการนี้อาจส่งผลกระทบต่อข้อมูลของคุณ",
	},
	{
		type: "info",
		title: "ข้อมูล",
		message: "มีการอัปเดตระบบในวันที่ 15 มีนาคม 2026",
	},
];

const confirmTypes: { type: AlertType; title: string; message: string }[] = [
	{
		type: "success",
		title: "ยืนยันการบันทึก",
		message: "คุณต้องการบันทึกข้อมูลนี้ใช่หรือไม่?",
	},
	{
		type: "error",
		title: "ยืนยันการลบ",
		message: "คุณต้องการลบข้อมูลนี้? การกระทำนี้ไม่สามารถย้อนกลับได้",
	},
	{
		type: "warning",
		title: "ยืนยันการดำเนินการ",
		message: "การดำเนินการนี้จะส่งผลกระทบต่อผู้ใช้ทั้งหมด คุณต้องการดำเนินการต่อหรือไม่?",
	},
	{
		type: "info",
		title: "ยืนยันการส่ง",
		message: "คุณต้องการส่งข้อมูลนี้ไปยังระบบหรือไม่?",
	},
];

const typeColors: Record<AlertType, string> = {
	success: "text-green-600 dark:text-green-400",
	error: "text-red-600 dark:text-red-400",
	warning: "text-amber-600 dark:text-amber-400",
	info: "text-blue-600 dark:text-blue-400",
};

export default function AlertDemoPage() {
	const { showAlert, showConfirm } = useAlert();

	return (
		<div className="space-y-12 p-10">
			{/* Alert types */}
			<section className="space-y-4">
				<div>
					<h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
						Alert Types
					</h2>
					<p className="text-sm text-slate-500 dark:text-slate-400">
						แสดงการแจ้งเตือนแบบ one-button ทั้ง 4 ประเภท
					</p>
				</div>
				<div className="flex flex-wrap gap-3">
					{alertTypes.map(({ type, title, message }) => (
						<BaseButton
							key={type}
							size="md"
							variant="outline"
							onClick={() => showAlert(title, message, type)}
						>
							<span className={typeColors[type]}>{type}</span>
						</BaseButton>
					))}
				</div>
			</section>

			{/* Confirm types */}
			<section className="space-y-4">
				<div>
					<h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
						Confirm Types
					</h2>
					<p className="text-sm text-slate-500 dark:text-slate-400">
						แสดงการยืนยันแบบ two-button ทั้ง 4 ประเภท
					</p>
				</div>
				<div className="flex flex-wrap gap-3">
					{confirmTypes.map(({ type, title, message }) => (
						<BaseButton
							key={type}
							size="md"
							variant="outline"
							onClick={() => showConfirm(title, message, () => {}, type)}
						>
							<span className={typeColors[type]}>{type}</span>
						</BaseButton>
					))}
				</div>
			</section>

			{/* Custom text */}
			<section className="space-y-4">
				<div>
					<h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
						Custom Button Text
					</h2>
					<p className="text-sm text-slate-500 dark:text-slate-400">
						ตัวอย่างการกำหนดข้อความปุ่มเอง
					</p>
				</div>
				<div className="flex flex-wrap gap-3">
					<BaseButton
						size="md"
						variant="outline"
						onClick={() =>
							showAlert(
								"แจ้งเตือน",
								"กรุณาตรวจสอบข้อมูลอีกครั้ง",
								"warning",
								"รับทราบ"
							)
						}
					>
						Custom confirmText
					</BaseButton>
					<BaseButton
						size="md"
						variant="outline"
						onClick={() =>
							showConfirm(
								"ยืนยันการลบ",
								"คุณต้องการลบรายการนี้หรือไม่?",
								() => {},
								"error",
								"ลบเลย",
								"ไม่ลบ"
							)
						}
					>
						Custom confirm + cancel text
					</BaseButton>
				</div>
			</section>
		</div>
	);
}
