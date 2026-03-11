import type { Incident } from "@/interfaces/incidents.interfaces";
import type { Role, TicketStatus } from "@/types/index.types";
import { STATUS_LABELS, TYPE_LABELS } from "@/constants/incidents.constants";
import { Calendar, Clock, List, Navigation, User, X } from "lucide-react";

interface IncidentModalProps {
	incident: Incident | null;
	onClose: () => void;
	role: Role;
	onStatusUpdate: (id: string, status: TicketStatus) => void;
}

export default function IncidentModal({ incident, onClose, role, onStatusUpdate }: IncidentModalProps) {
	if (!incident) return null;

	const statusColors: Record<string, string> = {
		OPEN: "bg-red-500 text-white",
		IN_PROGRESS: "bg-amber-500 text-white",
		RESOLVED: "bg-emerald-500 text-white",
	};

	return (
		<div className="fixed inset-0 z-[2000] flex items-end md:items-center justify-center pointer-events-none p-0 md:p-6">
			<div className="absolute inset-0 bg-slate-950/40 pointer-events-auto" onClick={onClose} />
			<div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[40px] md:rounded-[40px] shadow-2xl p-8 pointer-events-auto border-t md:border border-slate-200 dark:border-slate-800">
				<div className="flex justify-between items-start mb-8">
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<span className={`text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${statusColors[incident.status] ?? "bg-slate-500 text-white"}`}>
								{STATUS_LABELS[incident.status] ?? incident.status}
							</span>
							<span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Case #{incident.id.slice(-4)}</span>
						</div>
						<h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{TYPE_LABELS[incident.type] ?? incident.type}</h3>
					</div>
					<button onClick={onClose} className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-white rounded-full text-slate-400 transition-all">
						<X size={24} />
					</button>
				</div>

				<div className="space-y-4 mb-8">
					<div className="grid grid-cols-2 gap-4">
						<div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800">
							<div className="flex items-center gap-2 text-slate-400 mb-1"><Calendar size={14} /><span className="text-[10px] font-bold uppercase tracking-widest">วันที่แจ้ง</span></div>
							<p className="text-sm font-bold text-slate-900 dark:text-white">{new Date(incident.timestamp).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}</p>
						</div>
						<div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800">
							<div className="flex items-center gap-2 text-slate-400 mb-1"><Clock size={14} /><span className="text-[10px] font-bold uppercase tracking-widest">เวลา</span></div>
							<p className="text-sm font-bold text-slate-900 dark:text-white">{new Date(incident.timestamp).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}</p>
						</div>
					</div>
					<div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800">
						<div className="flex items-center gap-2 text-slate-400 mb-1"><User size={14} /><span className="text-[10px] font-bold uppercase tracking-widest">ผู้แจ้ง</span></div>
						<p className="text-sm font-bold text-slate-900 dark:text-white">{incident.reporterName}</p>
					</div>
					<div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-800">
						<div className="flex items-center gap-2 text-slate-400 mb-2"><List size={14} /><span className="text-[10px] font-bold uppercase tracking-widest">รายละเอียด</span></div>
						<p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic">"{incident.description}"</p>
					</div>
					<a href={`https://www.google.com/maps?q=${incident.location.lat},${incident.location.lng}`} target="_blank" rel="noopener noreferrer"
						className="flex items-center justify-center gap-3 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-3xl shadow-lg transition-all active:scale-95">
						<Navigation size={20} />
						<div className="text-left">
							<div className="text-sm font-black">นำทางด้วย Google Maps</div>
							<div className="text-xs font-mono opacity-90">{incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}</div>
						</div>
					</a>
				</div>

				{(role === "OFFICER" || role === "ADMIN") && (
					<div>
						{incident.status !== "RESOLVED" ? (
							<button
								onClick={() => {
									onStatusUpdate(incident.id, incident.status === "OPEN" ? "IN_PROGRESS" : "RESOLVED");
									if (incident.status === "IN_PROGRESS") onClose();
								}}
								className={`w-full py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl transition-all active:scale-95 ${
									incident.status === "OPEN" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "bg-emerald-600 text-white"
								}`}
							>
								{incident.status === "OPEN" ? (role === "ADMIN" ? "ยืนยันสั่งการ" : "รับทราบและเริ่มงาน") : "ปิดงานเรียบร้อย"}
							</button>
						) : (
							<div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-900/20">
								<p className="text-emerald-600 font-bold text-sm">✓ การปฏิบัติการเสร็จสิ้นแล้ว</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
