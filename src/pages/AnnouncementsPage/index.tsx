import type { Announcement } from "@/interfaces/incidents.interfaces";

import { useNavigate } from "react-router-dom";

import { useAuth } from "@/providers/AuthContext";
import { useAlert } from "@/providers/AlertContext";
import { useAnnouncements } from "@/pages/AnnouncementsPage/hooks/useAnnouncements";
import AnnouncementListSection from "@/pages/AnnouncementsPage/sections/AnnouncementListSection";

export default function AnnouncementsPage() {
	const { userRole } = useAuth();
	const { showConfirm } = useAlert();
	const navigate = useNavigate();
	const { announcements, loading, error, handleDelete } = useAnnouncements();

	const handleEdit = (a: Announcement) => navigate(`/announcements/${a.id}/edit`);
	const handleCreate = () => navigate("/announcements/new");

	const handleDeleteConfirm = (id: string) => {
		showConfirm(
			"ลบประกาศ",
			"คุณต้องการลบประกาศนี้ใช่หรือไม่?",
			() => handleDelete(id),
			"warning",
			"ลบ",
			"ยกเลิก"
		);
	};

	if (loading)
		return (
			<div className="flex items-center justify-center h-full text-slate-400 font-bold">
				กำลังโหลด...
			</div>
		);
	if (error)
		return (
			<div className="flex items-center justify-center h-full text-red-500 font-bold">
				{error}
			</div>
		);

	return (
		<AnnouncementListSection
			announcements={announcements}
			role={userRole}
			onCreateNew={userRole === "ADMIN" ? handleCreate : undefined}
			onDelete={userRole === "ADMIN" ? handleDeleteConfirm : undefined}
			onEdit={userRole === "ADMIN" ? handleEdit : undefined}
		/>
	);
}
