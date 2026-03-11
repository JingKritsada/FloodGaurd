import { AlertOctagon, AlertTriangle, ArrowLeft, CheckCircle, Undo, Waves } from "lucide-react";

import type { IncidentType, OfficerReportMode } from "@/types/index.types";
import type { Location } from "@/interfaces/incidents.interfaces";
import FormMap from "@/pages/ReportFormPage/sections/FormMap";

interface Props {
	officerReportMode: OfficerReportMode;
	formLocation: Location | null;
	draftPoints: Location[];
	formDesc: string;
	formType: IncidentType;
	setOfficerReportMode: (m: OfficerReportMode) => void;
	setFormLocation: (l: Location | null) => void;
	setDraftPoints: (pts: Location[] | ((prev: Location[]) => Location[])) => void;
	setFormDesc: (d: string) => void;
	setFormType: (t: IncidentType) => void;
	onSubmit: () => void;
	onCancel: () => void;
}

export default function OfficerReportSection({ officerReportMode, formLocation, draftPoints, formDesc, setOfficerReportMode, setFormLocation, setDraftPoints, setFormDesc, onSubmit, onCancel }: Props) {
	const isRoad = officerReportMode === "ROAD_CLOSURE";
	const isLevee = officerReportMode === "LEVEE";

	// Mode selector screen
	if (officerReportMode === "NONE") {
		return (
			<div className="p-6 bg-slate-50 dark:bg-slate-950 h-full overflow-y-auto flex flex-col items-center justify-start space-y-8">
				<div className="text-center">
					<h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">รายงานสถานการณ์</h2>
					<p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">Field Officer Portal</p>
				</div>
				<div className="w-full max-w-sm space-y-4">
					{[
						{ mode: "ROAD_CLOSURE" as OfficerReportMode, icon: <AlertOctagon size={28} />, label: "ปิดการจราจร", sub: "Draw on Map", color: "bg-red-500" },
						{ mode: "LEVEE" as OfficerReportMode, icon: <Waves size={28} />, label: "น้ำล้น/ตลิ่งพัง", sub: "Critical Point", color: "bg-blue-500" },
						{ mode: "GENERAL" as OfficerReportMode, icon: <AlertTriangle size={28} />, label: "เหตุอุบัติภัยทั่วไป", sub: "Rescue Support", color: "bg-amber-500" },
					].map((item) => (
						<button key={item.mode} onClick={() => setOfficerReportMode(item.mode)}
							className="w-full p-6 bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-5 hover:border-amber-400 transition-all active:scale-95 text-left">
							<div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>{item.icon}</div>
							<div>
								<span className="font-black text-lg text-slate-900 dark:text-white block leading-tight">{item.label}</span>
								<span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.sub}</span>
							</div>
						</button>
					))}
				</div>
				<button onClick={onCancel} className="text-sm text-slate-400 hover:text-slate-600 font-bold">ยกเลิก</button>
			</div>
		);
	}

	// Map drawing screen
	const needsMap = (isRoad && !formDesc.trim()) || (isLevee && !formLocation) || (officerReportMode === "GENERAL" && !formLocation);
	if (needsMap) {
		return (
			<div className="flex flex-col h-full bg-white dark:bg-slate-950">
				<div className="flex-none p-4 flex items-center justify-between">
					<button onClick={() => { setOfficerReportMode("NONE"); setFormLocation(null); setDraftPoints([]); }}
						className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-slate-600 dark:text-slate-400">
						<ArrowLeft size={20} />
					</button>
					<h2 className="font-black text-lg dark:text-white">{isRoad ? "ปิดการจราจร" : isLevee ? "น้ำล้น/ตลิ่งพัง" : "จุดแจ้งขอความช่วยเหลือ"}</h2>
					<div className="w-11" />
				</div>
				<div className="flex-1 relative">
					<FormMap interactive height="h-full" draftPoints={draftPoints}
						onMapClick={(loc) => { if (isRoad) setDraftPoints((prev) => [...prev, loc]); else setFormLocation(loc); }} />
					{isRoad && (
						<div className="absolute bottom-20 inset-x-0 flex justify-center z-[400] pointer-events-none p-4">
							<div className="bg-white dark:bg-slate-900 shadow-2xl rounded-3xl p-1.5 flex gap-2 pointer-events-auto border border-slate-100 dark:border-slate-800">
								<button onClick={() => setDraftPoints((prev) => prev.slice(0, -1))} disabled={draftPoints.length === 0}
									className="w-12 h-12 flex items-center justify-center text-slate-500 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50">
									<Undo size={20} />
								</button>
								<button onClick={() => setFormDesc(" ")} disabled={draftPoints.length < 2}
									className={`px-6 h-12 rounded-2xl font-black text-xs flex items-center gap-2 transition-all ${draftPoints.length >= 2 ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl" : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"}`}>
									<CheckCircle size={14} strokeWidth={3} />ยืนยันเส้นทาง
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}

	// Form details screen
	return (
		<div className="p-6 bg-white dark:bg-slate-950 h-full overflow-y-auto pb-24 space-y-5">
			<div className="flex items-center gap-4">
				<button onClick={() => { if (isRoad) setFormDesc(""); else setFormLocation(null); }}
					className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-amber-500 hover:text-white transition-all">
					<ArrowLeft size={20} />
				</button>
				<h2 className="text-xl font-black text-slate-900 dark:text-white">{isRoad ? "รายละเอียดการปิดถนน" : isLevee ? "รายละเอียดจุดวิกฤต" : "รายละเอียดการแจ้งเหตุ"}</h2>
			</div>

			<FormMap singlePoint={formLocation ?? undefined} draftPoints={isRoad ? draftPoints : []} draggable={false} height="h-40" />

			<div>
				<label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3">{isRoad ? "สาเหตุ / สถานะ" : "รายละเอียดสถานการณ์"}</label>
				<textarea className="w-full p-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl text-slate-900 dark:text-white font-medium text-base focus:ring-4 focus:ring-amber-500/10 outline-none resize-none" rows={3}
					placeholder={isRoad ? "น้ำท่วมสูง... รถเล็กผ่านไม่ได้..." : "อธิบายสถานการณ์..."}
					value={formDesc.trim()} onChange={(e) => setFormDesc(e.target.value)} />
			</div>

			<button onClick={onSubmit} className="w-full py-5 rounded-3xl font-black text-base uppercase tracking-widest text-white bg-amber-600 shadow-2xl shadow-amber-600/30 active:scale-95 transition-all flex items-center justify-center gap-3">
				<CheckCircle size={20} strokeWidth={3} />
				{isRoad ? "บันทึกการปิดถนน" : isLevee ? "บันทึกจุดวิกฤต" : "ส่งรายงานการแจ้งเหตุ"}
			</button>
		</div>
	);
}
