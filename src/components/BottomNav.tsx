import type { ReportType, Role } from "@/types/index.types";

import React from "react";
import { AlertTriangle, Bell, CheckCircle, List, Map as MapIcon, Megaphone } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "@/providers/AuthContext";
import { Z_INDEX } from "@/constants/zindex.constants";

interface NavBtnProps {
	icon: React.ReactElement;
	label: string;
	active: boolean;
	onClick: () => void;
}

function NavBtn({ icon, label, active, onClick }: NavBtnProps) {
	return (
		<button
			className={`flex flex-col items-center gap-1.5 py-2 px-6 rounded-2xl transition-all duration-300 ${
				active
					? "text-gold-600 dark:text-gold-400 bg-gold-500/10"
					: "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
			}`}
			onClick={onClick}
		>
			{React.cloneElement(
				icon as React.ReactElement<{ size?: number; strokeWidth?: number }>,
				{ size: 22, strokeWidth: active ? 2.5 : 2 }
			)}
			<span className="text-[10px] font-bold tracking-tight">{label}</span>
		</button>
	);
}

interface BottomNavProps {
	onReportClick?: (type: ReportType) => void;
}

export default function BottomNav({ onReportClick }: BottomNavProps) {
	const { userRole } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const role = userRole as Role;
	const path = location.pathname;

	return (
		<div
			className="fixed bottom-0 left-0 right-0 p-4 flex justify-center pointer-events-none"
			style={{ zIndex: Z_INDEX.appNavBar }}
		>
			<div className="w-fit max-w-lg space-x-4 glass border border-white/20 dark:border-slate-800 shadow-2xl rounded-3xl p-1.5 flex justify-around items-center pointer-events-auto overflow-visible bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg">
				{role === "CITIZEN" && (
					<>
						<NavBtn
							active={path === "/"}
							icon={<MapIcon />}
							label="แผนที่"
							onClick={() => navigate("/")}
						/>

						<div className="flex gap-3 -translate-y-6">
							<button
								className="flex flex-col items-center justify-center w-16 h-16 bg-red-500 rounded-2xl shadow-xl shadow-red-500/30 border-4 border-white dark:border-slate-900 hover:scale-110 active:scale-95 transition-all"
								onClick={() => {
									if (onReportClick) onReportClick("SOS");
									navigate("/report?type=SOS");
								}}
							>
								<Bell className="text-white mb-0.5" size={20} strokeWidth={2.5} />
								<span className="text-white font-black text-[8px] leading-none tracking-tight">
									SOS
								</span>
							</button>

							<button
								className="flex flex-col items-center justify-center w-16 h-16 bg-cyan-400 rounded-2xl shadow-xl shadow-cyan-400/30 border-4 border-white dark:border-slate-900 hover:scale-110 active:scale-95 transition-all"
								title="แจ้งเหตุน้ำท่วม/ถนน"
								onClick={() => {
									if (onReportClick) onReportClick("TRAFFIC");
									navigate("/report?type=TRAFFIC");
								}}
							>
								<AlertTriangle
									className="text-white mb-0.5"
									size={20}
									strokeWidth={2.5}
								/>
								<span className="text-white font-black text-[7px] leading-none tracking-tight text-center">
									แจ้งเหตุ
								</span>
							</button>
						</div>

						<NavBtn
							active={path.startsWith("/announcements")}
							icon={<Megaphone />}
							label="ประกาศ"
							onClick={() => navigate("/announcements")}
						/>
					</>
				)}

				{(role === "OFFICER" || role === "ADMIN") && (
					<>
						<NavBtn
							active={path === "/"}
							icon={<MapIcon />}
							label={role === "ADMIN" ? "สั่งการ" : "แผนที่"}
							onClick={() => navigate("/")}
						/>
						<NavBtn
							active={path === "/stats" || path === "/list"}
							icon={role === "ADMIN" ? <CheckCircle /> : <List />}
							label={role === "ADMIN" ? "วิเคราะห์" : "งาน"}
							onClick={() => navigate(role === "ADMIN" ? "/stats" : "/list")}
						/>
						{role === "OFFICER" && (
							<NavBtn
								active={path === "/report"}
								icon={<AlertTriangle />}
								label="แจ้งเหตุ"
								onClick={() => navigate("/report")}
							/>
						)}
						{role === "ADMIN" && (
							<>
								<NavBtn
									active={path === "/list"}
									icon={<List />}
									label="ใบงาน"
									onClick={() => navigate("/list")}
								/>
								<NavBtn
									active={path.startsWith("/announcements")}
									icon={<Megaphone />}
									label="ประกาศ"
									onClick={() => navigate("/announcements")}
								/>
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
}
