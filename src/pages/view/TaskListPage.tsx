import type { IncidentStatus } from "@/types/services.types";
import type { Incident } from "@/interfaces/services.interfaces";

import { List } from "lucide-react";
import { useState, useEffect } from "react";

import { getErrorMessage } from "@/services/api";
import { useAuth } from "@/providers/AuthContext";
import { useAlert } from "@/providers/AlertContext";
import { taskStatusOptions } from "@/constants/pages.constants";
import TaskCard from "@/components/TaskCard";
import incidentService from "@/services/incidentService";
import BaseButton from "@/components/BaseComponents/BaseButton";

export default function TaskListPage(): React.JSX.Element {
	const { showAlert } = useAlert();
	const { currentRole } = useAuth();

	const [incidents, setIncidents] = useState<Incident[]>([]);
	const [statusFilter, setStatusFilter] = useState<"ALL" | IncidentStatus>("ALL");

	useEffect(() => {
		async function fetchIncidents() {
			try {
				const data = await incidentService.getAll();

				setIncidents(data || []);
			} catch (error) {
				showAlert(`Failed to load incidents: ${error}`, "error");
			}
		}

		fetchIncidents();
	}, []);

	const filteredIncidents =
		statusFilter === "ALL"
			? incidents
			: incidents.filter((incident) => incident.status === statusFilter);

	const handleStatusUpdate = async (id: string, newStatus: IncidentStatus) => {
		try {
			await incidentService.updateStatus(id, newStatus);
			const data = await incidentService.getAll();

			setIncidents(data || []);
		} catch (error) {
			showAlert("ข้อผิดพลาด", `ไม่สามารถอัปเดตสถานะได้: ${getErrorMessage(error)}`, "error");
		}
	};

	return (
		<div className="h-full overflow-y-auto pb-24">
			{/* Header */}
			<div className="sticky top-0 z-10 flex flex-col gap-8 border-b border-slate-200 bg-white/80 px-4 py-5 backdrop-blur-lg sm:px-6 dark:border-slate-800 dark:bg-slate-950/80">
				{/* Title */}
				<div className="flex h-full items-center justify-between">
					<div className="flex flex-col gap-1">
						<h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
							{currentRole === "OFFICER" ? "งานที่ได้รับ" : "ใบงานทั้งหมด"}
						</h2>
						<p className="text-xs font-bold tracking-wide text-slate-500 uppercase">
							ระบบแจ้งเตือนของจังหวัดสุโขทัย
						</p>
					</div>

					<span className="h-full rounded-xl border border-gold-500/20 bg-gold-500/10 px-4 py-2 text-base font-black text-gold-600 dark:text-gold-400">
						{filteredIncidents.length} ใบงาน
					</span>
				</div>

				{/* Status Filter */}
				<div className="flex gap-2 overflow-scroll">
					{taskStatusOptions.map((option) => {
						const active = statusFilter === option.id;

						return (
							<BaseButton
								key={option.id}
								className="rounded-xl"
								size="md"
								variant={active ? "primary" : "secondary"}
								onClick={() => setStatusFilter(option.id)}
							>
								{option.label}
							</BaseButton>
						);
					})}
				</div>
			</div>

			{/* Incident List */}
			<div className="grid grid-cols-1 gap-4 px-4 py-5 sm:gap-6 sm:px-6 md:grid-cols-2 xl:grid-cols-3">
				{/* Incident Card */}
				{filteredIncidents
					.slice()
					.reverse()
					.map((incident) => (
						<TaskCard
							key={incident._id}
							currentRole={currentRole}
							incident={incident}
							onNavigateClick={() => {}}
							onStatusUpdate={handleStatusUpdate}
						/>
					))}

				{/* Not Found */}
				{filteredIncidents.length === 0 && (
					<div className="col-span-full flex flex-col items-center justify-center gap-6 rounded-3xl border-2 border-dashed border-slate-300 py-8 text-slate-500 md:py-12 lg:py-16 dark:border-slate-700 dark:text-slate-400">
						<div className="rounded-full bg-slate-200/30 p-6 dark:bg-slate-800/30">
							<List size={36} />
						</div>
						<span className="text-lg font-medium">
							{statusFilter === "ALL"
								? "ยังไม่มีใบงาน"
								: `ไม่พบใบงานที่มีสถานะ "${
										taskStatusOptions.find((o) => o.id === statusFilter)?.label
									}"`}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
