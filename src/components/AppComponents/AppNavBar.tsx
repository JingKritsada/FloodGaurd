import { AlertTriangle, Bell, ChartPie, List, Map, Megaphone } from "lucide-react";

import { Z_INDEX } from "@/constants/pages.constants";
import NavButton from "@/components/NavButton";
import { useAuth } from "@/providers/AuthContext";

export default function AppNavBar() {
	const { currentRole } = useAuth();

	return (
		<nav
			className="pointer-events-none fixed right-0 bottom-0 left-0 flex justify-center p-4"
			style={{ zIndex: Z_INDEX.appNavBar }}
		>
			<div className="pointer-events-auto flex w-fit items-center justify-around gap-1.5 overflow-visible rounded-3xl border border-slate-200 bg-white/80 p-1.5 shadow-2xl shadow-black/20 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-slate-700/30">
				{currentRole === "CITIZEN" && (
					<>
						<NavButton
							destination="/"
							label="แผนที่"
							leftIcon={<Map strokeWidth={2.5} />}
						/>

						<div className="flex h-full -translate-y-6 gap-1.5 font-semibold text-white">
							<NavButton
								className="w-18! rounded-2xl! border-4 border-white bg-red-500 pt-3! shadow-lg shadow-red-500/30 transition-all duration-300 hover:scale-105 dark:border-slate-900"
								destination="/create-request"
								label="SOS"
								leftIcon={<Bell strokeWidth={2.5} />}
							/>
							<NavButton
								className="w-18! rounded-2xl! border-4 border-white bg-cyan-500 pt-3! shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-105 dark:border-slate-900"
								destination="/create-incident"
								label="แจ้งเหตุ"
								leftIcon={<AlertTriangle strokeWidth={2.5} />}
							/>
						</div>

						<NavButton
							destination="/announcements"
							label="ประกาศ"
							leftIcon={<Megaphone strokeWidth={2.5} />}
						/>
					</>
				)}

				{currentRole === "OFFICER" && (
					<>
						<NavButton
							destination="/"
							label="แผนที่"
							leftIcon={<Map strokeWidth={2.5} />}
						/>
						<NavButton
							destination="/create-incident"
							label="แจ้งเหตุ"
							leftIcon={<AlertTriangle strokeWidth={2.5} />}
						/>
						<NavButton
							destination="/tasks"
							label="ใบงาน"
							leftIcon={<List strokeWidth={2.5} />}
						/>
					</>
				)}

				{currentRole === "ADMIN" && (
					<>
						<NavButton
							destination="/"
							label="แผนที่"
							leftIcon={<Map strokeWidth={2.5} />}
						/>
						<NavButton
							destination="/dashboard"
							label="แดชบอร์ด"
							leftIcon={<ChartPie strokeWidth={2.5} />}
						/>
						<NavButton
							destination="/tasks"
							label="ใบงาน"
							leftIcon={<List strokeWidth={2.5} />}
						/>
						<NavButton
							destination="/announcements"
							label="ประกาศ"
							leftIcon={<Megaphone strokeWidth={2.5} />}
						/>
					</>
				)}
			</div>
		</nav>
	);
}
