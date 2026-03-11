import type React from "react";

import { AlertTriangle, ArrowLeft, CheckCircle, Info, Megaphone, Upload } from "lucide-react";

import { useAnnouncementForm } from "@/pages/AnnouncementFormPage/hooks/useAnnouncementForm";

const PRIORITY_OPTIONS = [
	{
		id: "HIGH" as const,
		label: "ด่วนมาก",
		icon: <AlertTriangle size={18} />,
		color: "bg-red-500",
	},
	{ id: "MEDIUM" as const, label: "ปกติ", icon: <Megaphone size={18} />, color: "bg-amber-500" },
	{ id: "LOW" as const, label: "ทั่วไป", icon: <Info size={18} />, color: "bg-blue-500" },
];

export default function AnnouncementFormPage() {
	const {
		isEdit,
		loading,
		title,
		setTitle,
		content,
		setContent,
		priority,
		setPriority,
		image,
		setImage,
		isPublished,
		setIsPublished,
		handleSubmit,
		handleCancel,
	} = useAnnouncementForm();

	if (loading)
		return (
			<div className="flex items-center justify-center h-full text-slate-400 font-bold">
				กำลังโหลด...
			</div>
		);

	return (
		<div className="bg-white dark:bg-slate-950 h-full overflow-y-auto pb-24">
			<div className="sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg z-10 px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4">
				<button
					className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-amber-500 hover:text-white transition-all"
					onClick={handleCancel}
				>
					<ArrowLeft size={20} />
				</button>
				<h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
					{isEdit ? "แก้ไขประกาศ" : "สร้างประกาศใหม่"}
				</h2>
			</div>

			<div className="p-6 space-y-6">
				<div>
					<label
						className="block text-base font-black text-slate-900 dark:text-white mb-3"
						htmlFor="ann-title"
					>
						หัวข้อประกาศ
					</label>
					<input
						className="w-full p-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] text-slate-900 dark:text-white font-medium text-base focus:ring-4 focus:ring-amber-500/10 outline-none transition-all"
						id="ann-title"
						placeholder="ตัวอย่าง: แจ้งเตือนระดับน้ำสูง"
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>

				<div>
					<p className="block text-base font-black text-slate-900 dark:text-white mb-3">
						ระดับความสำคัญ
					</p>
					<div className="grid grid-cols-3 gap-3">
						{PRIORITY_OPTIONS.map((p) => (
							<button
								key={p.id}
								className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${priority === p.id ? `border-transparent shadow-lg ${p.color} text-white` : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400"}`}
								onClick={() => setPriority(p.id)}
							>
								<div
									className={`p-2 rounded-xl ${priority === p.id ? "bg-white/20" : "bg-white dark:bg-slate-800 shadow-sm"}`}
								>
									{(p.icon as React.ReactElement<{ className: string }>).type ? (
										<p.icon.type
											{...(
												p.icon as React.ReactElement<{ className: string }>
											).props}
											className={
												priority === p.id
													? "text-white"
													: "text-slate-600 dark:text-slate-400"
											}
										/>
									) : (
										p.icon
									)}
								</div>
								<span
									className={`text-xs font-bold text-center ${priority === p.id ? "text-white" : "text-slate-900 dark:text-slate-300"}`}
								>
									{p.label}
								</span>
							</button>
						))}
					</div>
				</div>

				<div>
					<label
						className="block text-base font-black text-slate-900 dark:text-white mb-3"
						htmlFor="ann-content"
					>
						เนื้อหาประกาศ
					</label>
					<textarea
						className="w-full p-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl text-slate-900 dark:text-white font-medium text-base focus:ring-4 focus:ring-amber-500/10 outline-none resize-none transition-all"
						id="ann-content"
						placeholder="รายละเอียดประกาศ..."
						rows={6}
						value={content}
						onChange={(e) => setContent(e.target.value)}
					/>
				</div>

				<div>
					<label
						className="block text-base font-black text-slate-900 dark:text-white mb-3"
						htmlFor="ann-image"
					>
						รูปภาพ (URL)
					</label>
					<div className="relative">
						<Upload
							className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
							size={18}
						/>
						<input
							className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl text-slate-900 dark:text-white font-medium text-base focus:ring-4 focus:ring-amber-500/10 outline-none transition-all"
							id="ann-image"
							placeholder="https://example.com/image.jpg"
							type="text"
							value={image}
							onChange={(e) => setImage(e.target.value)}
						/>
					</div>
					{image && (
						<div className="mt-3 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
							<img alt="Preview" className="w-full h-48 object-cover" src={image} />
						</div>
					)}
				</div>

				<div>
					<label
						aria-label="เผยแพร่ทันที"
						className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-amber-400 transition-all"
					>
						<input
							checked={isPublished}
							className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-amber-600 cursor-pointer"
							type="checkbox"
							onChange={(e) => setIsPublished(e.target.checked)}
						/>
						<div>
							<span className="text-sm font-bold text-slate-700 dark:text-slate-300 block">
								เผยแพร่ทันที
							</span>
							<span className="text-xs text-slate-500">
								ถ้าไม่เลือก จะถูกบันทึกเป็นร่าง
							</span>
						</div>
					</label>
				</div>

				<button
					className="w-full py-5 rounded-3xl font-black text-base uppercase tracking-widest text-white bg-amber-600 shadow-2xl shadow-amber-600/30 active:scale-95 transition-all flex items-center justify-center gap-3"
					onClick={handleSubmit}
				>
					<CheckCircle size={20} strokeWidth={3} />
					{isEdit ? "บันทึกการแก้ไข" : "สร้างประกาศ"}
				</button>
			</div>
		</div>
	);
}
