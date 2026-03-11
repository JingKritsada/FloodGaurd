import { CheckCircle, Minus, Package, Phone, Plus, Stethoscope, Users } from "lucide-react";

import type { IncidentType, ReportType } from "@/types/index.types";
import type { Location } from "@/interfaces/incidents.interfaces";
import FormMap from "@/pages/ReportFormPage/sections/FormMap";

interface Props {
	reportType: ReportType;
	formLocation: Location | null;
	formType: IncidentType;
	formDesc: string;
	victimCount: number;
	hasBedridden: boolean;
	phone: string;
	address: string;
	setFormLocation: (loc: Location | null) => void;
	setFormType: (t: IncidentType) => void;
	setFormDesc: (d: string) => void;
	setVictimCount: (n: number) => void;
	setHasBedridden: (v: boolean) => void;
	setPhone: (p: string) => void;
	setAddress: (a: string) => void;
	onSubmit: () => void;
	onCancel: () => void;
}

const SOS_TYPES: { id: IncidentType; label: string }[] = [
	{ id: "MEDICAL", label: "ติดในบ้าน / ป่วย" },
	{ id: "SUPPLIES", label: "ขาดแคลนเสบียง" },
	{ id: "EVACUATION", label: "ต้องการอพยพ" },
];

export default function CitizenReportSection({ reportType, formLocation, formType, formDesc, victimCount, hasBedridden, phone, address, setFormLocation, setFormType, setFormDesc, setVictimCount, setHasBedridden, setPhone, setAddress, onSubmit, onCancel }: Props) {
	if (!formLocation) {
		return (
			<div className="flex flex-col h-full bg-white dark:bg-slate-950">
				<div className="flex-none p-4 flex items-center justify-between">
					<button onClick={onCancel} className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-slate-600 dark:text-slate-400">← ยกเลิก</button>
					<h2 className="font-black text-lg dark:text-white">{reportType === "SOS" ? "จุดขอความช่วยเหลือ" : "จุดแจ้งเหตุ"}</h2>
					<div className="w-20" />
				</div>
				<div className="absolute top-20 inset-x-6 z-[400] flex justify-center pointer-events-none">
					<div className="bg-slate-900/80 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow">แตะบนแผนที่เพื่อระบุตำแหน่ง</div>
				</div>
				<div className="flex-1 relative">
					<FormMap interactive height="h-full" onMapClick={setFormLocation} />
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 bg-white dark:bg-slate-950 h-full overflow-y-auto pb-24 space-y-5">
			<div className="flex items-center gap-4">
				<button onClick={() => setFormLocation(null)} className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-slate-600 dark:text-slate-400">←</button>
				<h2 className="text-xl font-black text-slate-900 dark:text-white">{reportType === "SOS" ? "รายละเอียดขอความช่วยเหลือ" : "รายละเอียดการแจ้งเหตุ"}</h2>
			</div>

			<FormMap singlePoint={formLocation} draggable={false} height="h-40" />

			{reportType === "SOS" && (
				<>
					<div>
						<label className="block text-sm font-black text-slate-900 dark:text-white mb-3">เรื่องที่ต้องการความช่วยเหลือ</label>
						<div className="grid grid-cols-3 gap-3">
							{SOS_TYPES.map((t) => (
								<button key={t.id} onClick={() => setFormType(t.id)}
									className={`p-3 rounded-2xl border-2 text-xs font-bold transition-all flex flex-col items-center gap-2 ${formType === t.id ? "bg-amber-500 border-transparent text-white shadow-lg" : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300"}`}>
									{t.id === "MEDICAL" ? <Stethoscope size={18} /> : t.id === "SUPPLIES" ? <Package size={18} /> : <Users size={18} />}
									{t.label}
								</button>
							))}
						</div>
					</div>
					<div>
						<label className="block text-sm font-black text-slate-900 dark:text-white mb-3">จำนวนผู้ประสบภัย</label>
						<div className="flex items-center justify-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
							<button type="button" onClick={() => setVictimCount(Math.max(0, victimCount - 1))} disabled={victimCount <= 0}
								className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 transition-all disabled:opacity-50">
								<Minus size={20} strokeWidth={3} />
							</button>
							<div className="text-4xl font-black text-slate-900 dark:text-white min-w-[4rem] text-center">{victimCount}</div>
							<button type="button" onClick={() => setVictimCount(victimCount + 1)}
								className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 transition-all">
								<Plus size={20} strokeWidth={3} />
							</button>
						</div>
						<label className="flex items-center gap-3 mt-3 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl cursor-pointer">
							<input type="checkbox" checked={hasBedridden} onChange={(e) => setHasBedridden(e.target.checked)} className="w-5 h-5 rounded" />
							<span className="text-sm font-bold text-slate-700 dark:text-slate-300">มีผู้ป่วยติดเตียง / เคลื่อนย้ายลำบาก</span>
						</label>
					</div>
				</>
			)}

			<div>
				<label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3">รายละเอียดสถานการณ์</label>
				<textarea className="w-full p-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl text-slate-900 dark:text-white font-medium text-base focus:ring-4 focus:ring-amber-500/10 outline-none resize-none" rows={3} placeholder="อธิบายเพิ่มเติม..." value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
			</div>

			<div>
				<label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3">เบอร์โทรติดต่อ</label>
				<div className="relative">
					<Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
					<input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl text-slate-900 dark:text-white font-medium text-base focus:ring-4 focus:ring-amber-500/10 outline-none" placeholder="08X-XXX-XXXX" />
				</div>
			</div>

			<div>
				<label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3">ที่อยู่</label>
				<input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl text-slate-900 dark:text-white font-medium text-base focus:ring-4 focus:ring-amber-500/10 outline-none" placeholder="หมู่ 1, ต.เมืองเก่า, อ.เมือง" />
			</div>

			<button onClick={onSubmit} className="w-full py-5 rounded-3xl font-black text-base uppercase tracking-widest text-white bg-amber-600 shadow-2xl shadow-amber-600/30 active:scale-95 transition-all flex items-center justify-center gap-3">
				<CheckCircle size={20} strokeWidth={3} />
				{reportType === "SOS" ? "ส่งขอความช่วยเหลือ" : "ส่งรายงานการแจ้งเหตุ"}
			</button>
		</div>
	);
}
