import type { AnnouncementPriority } from "@/types/services.types";
import type { Announcement } from "@/interfaces/services.interfaces";

import { List, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

import { getErrorMessage } from "@/services/api";
import { useAuth } from "@/providers/AuthContext";
import { useAlert } from "@/providers/AlertContext";
import { announcementPriorityOptions } from "@/constants/pages.constants";
import AnnoucementCard from "@/components/AnnoucementCard";
import BaseButton from "@/components/BaseComponents/BaseButton";
import announcementService from "@/services/announcementService";

export default function AnnouncementListPage(): React.JSX.Element {
	const navigate = useNavigate();

	const { showAlert } = useAlert();
	const { currentRole } = useAuth();

	const [refreshTrigger, setRefreshTrigger] = useState(0);
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);
	const [announcementPriority, setAnnouncementPriority] = useState<"ALL" | AnnouncementPriority>(
		"ALL"
	);

	useEffect(() => {
		async function fetchAnnouncements() {
			try {
				if (currentRole === "ADMIN") {
					const data = await announcementService.getAllAdmin();

					setAnnouncements(data || []);

					return;
				}

				const data = await announcementService.getAll();

				setAnnouncements(data || []);
			} catch (error) {
				showAlert(
					"ข้อผิดพลาด",
					`ไม่สามารถโหลดข้อมูลประกาศได้: ${getErrorMessage(error)}`,
					"error"
				);
			}
		}

		fetchAnnouncements();
	}, [showAlert, currentRole, refreshTrigger]);

	const handleDelete = async (id: string) => {
		try {
			await announcementService.remove(id);
			setRefreshTrigger((prev) => prev + 1);
		} catch (error) {
			showAlert("ข้อผิดพลาด", `ไม่สามารถลบประกาศได้: ${getErrorMessage(error)}`, "error");
		}
	};

	const filteredAnnouncements =
		announcementPriority === "ALL"
			? announcements
			: announcements.filter(
					(announcement) => announcement.priority === announcementPriority
				);

	return (
		<div className="h-full overflow-y-auto pb-28">
			{/* Header */}
			<div className="sticky top-0 z-10 flex flex-col gap-8 border-b border-slate-200 bg-white/80 px-4 py-5 backdrop-blur-lg sm:px-6 dark:border-slate-800 dark:bg-slate-950/80">
				{/* Title */}
				<div className="flex h-full items-center justify-between">
					<div className="flex flex-col gap-1">
						<h2 className="text-2xl font-black text-slate-900 dark:text-white">
							ประกาศและแจ้งเตือน
						</h2>
						<p className="text-xs font-bold text-slate-500 uppercase">
							ระบบแจ้งเตือนของจังหวัดสุโขทัย
						</p>
					</div>

					{currentRole === "ADMIN" ? (
						<BaseButton
							className="h-full rounded-xl border border-gold-500/20 bg-gold-500/10 px-4 py-2 text-base text-gold-600 hover:bg-gold-500/20 dark:text-gold-400"
							leftIcon={<Plus size={20} />}
							size="md"
							variant="none"
							onClick={() => navigate("/announcement-form/add")}
						>
							สร้างประกาศ
						</BaseButton>
					) : (
						<span className="h-full rounded-xl border border-gold-500/20 bg-gold-500/10 px-4 py-2 text-base text-gold-600 dark:text-gold-400">
							{filteredAnnouncements.length} ประกาศ
						</span>
					)}
				</div>

				{/* Priority Filter */}
				<div className="flex gap-2 overflow-scroll">
					{announcementPriorityOptions.map((option) => {
						const active = announcementPriority === option.id;

						return (
							<BaseButton
								key={option.id}
								className="rounded-xl"
								size="md"
								variant={active ? "primary" : "secondary"}
								onClick={() => setAnnouncementPriority(option.id)}
							>
								{option.label}
							</BaseButton>
						);
					})}
				</div>
			</div>

			{/* Annoucement List */}
			<div className="grid grid-cols-1 gap-4 px-4 py-5 sm:gap-6 sm:px-6 md:grid-cols-2 xl:grid-cols-3">
				{/* Incident Card */}
				{filteredAnnouncements
					.slice()
					.reverse()
					.map((announcement) => (
						<AnnoucementCard
							key={announcement._id}
							announcement={announcement}
							onDelete={handleDelete}
							onEdit={(id) => navigate(`/announcement-form/edit/${id}`)}
						/>
					))}

				{/* Not Found */}
				{filteredAnnouncements.length === 0 && (
					<div className="col-span-full flex flex-col items-center justify-center gap-6 rounded-3xl border-2 border-dashed border-slate-300 px-8 py-8 text-center text-slate-500 md:py-12 lg:py-16 dark:border-slate-700 dark:text-slate-400">
						<div className="rounded-full bg-slate-200/30 p-6 dark:bg-slate-800/30">
							<List size={36} />
						</div>
						<span className="text-lg font-medium whitespace-pre-line">
							{announcementPriority === "ALL"
								? "ยังไม่มีประกาศ"
								: `ไม่พบประกาศที่มีลำดับความสำคัญ\n "${
										announcementPriorityOptions.find(
											(o) => o.id === announcementPriority
										)?.label
									}"`}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
