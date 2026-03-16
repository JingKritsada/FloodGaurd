import type { AnnoucementCardProps } from "@/interfaces/components.interfaces";

import { Clock, User } from "lucide-react";

import BaseButton from "./BaseComponents/BaseButton";

import { useAuth } from "@/providers/AuthContext";
import { useAlert } from "@/providers/AlertContext";
import { mapPriorityColor, mapPriorityIcon, mapPriorityLabel } from "@/constants/pages.constants";

export default function AnnoucementCard({
	announcement,
	onEdit,
	onDelete,
}: AnnoucementCardProps): React.JSX.Element {
	const { currentRole } = useAuth();
	const { showConfirm } = useAlert();

	const handleDeleteClick = () => {
		showConfirm(
			"ยืนยันการลบประกาศ",
			"คุณต้องการลบประกาศนี้ใช่หรือไม่?",
			async () => {
				if (onDelete) {
					await onDelete(announcement._id);
				}
			},
			"error",
			"ยืนยัน",
			"ยกเลิก"
		);
	};

	const handleEditClick = () => {
		if (onEdit) {
			onEdit(announcement._id);
		}
	};

	return (
		<div className="flex flex-col gap-6 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition-all dark:border-slate-800 dark:bg-[#121623]">
			<div className="item-center flex flex-row justify-start gap-4">
				{/* Status Icon and ID */}
				<div
					className={`flex aspect-square h-full shrink-0 items-center justify-center rounded-lg shadow-sm ${mapPriorityColor[announcement.priority]}`}
				>
					{mapPriorityIcon[announcement.priority]}
				</div>

				{/* Header */}
				<div className="flex min-w-0 flex-col items-start gap-1">
					{/* Title */}
					<h4 className="line-clamp-1 w-full pl-2 text-xl font-bold text-slate-900 dark:text-slate-50">
						{announcement.title}
					</h4>

					<div className="flex items-center gap-2">
						{/* Priority */}
						{announcement.priority && (
							<span
								className={`rounded-lg px-3 py-1 text-sm font-medium ${
									announcement.priority === "HIGH"
										? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
										: announcement.priority === "MEDIUM"
											? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
											: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
								}`}
							>
								{mapPriorityLabel[announcement.priority] || announcement.priority}
							</span>
						)}

						{/* Published Status */}
						{currentRole === "ADMIN" &&
							(announcement.isPublished ? (
								<span className="rounded-lg bg-green-100 px-3 py-1 text-sm font-medium text-green-600 dark:bg-green-900/30 dark:text-green-400">
									เผยแพร่แล้ว
								</span>
							) : (
								<span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 dark:bg-slate-700/30 dark:text-slate-400">
									ฉบับร่าง
								</span>
							))}
					</div>
				</div>
			</div>

			{/* Content */}
			{announcement.content && (
				<p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
					{announcement.content}
				</p>
			)}

			{/* Additional Info */}
			<div className="flex flex-col gap-1">
				{/* Created At */}
				{announcement.createdAt && (
					<div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
						<Clock className="shrink-0 text-purple-500" size={16} />
						<span className="font-medium">
							{new Date(announcement.createdAt).toLocaleString("th-TH", {
								year: "numeric",
								month: "short",
								day: "numeric",
								hour: "2-digit",
								minute: "2-digit",
							})}
						</span>
					</div>
				)}

				{/* Created By */}
				{announcement.createdBy && (
					<div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
						<User className="shrink-0" size={16} />
						<span className="font-medium">{announcement.createdBy}</span>
					</div>
				)}
			</div>

			{/* Action Buttons */}
			{currentRole === "ADMIN" && (
				<div className="mt-auto flex flex-row items-center gap-3">
					<BaseButton
						className="w-full rounded-xl"
						size="md"
						variant="outline"
						onClick={handleDeleteClick}
					>
						ลบประกาศ
					</BaseButton>

					<BaseButton
						className="w-full rounded-xl"
						size="md"
						variant="primary"
						onClick={handleEditClick}
					>
						แก้ไขประกาศ
					</BaseButton>
				</div>
			)}
		</div>
	);
}
