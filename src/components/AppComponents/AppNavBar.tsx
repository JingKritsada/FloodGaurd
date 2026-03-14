import { AlertTriangle, Bell, ChartPie, List, Map, Megaphone } from "lucide-react";

import { Z_INDEX } from "@/constants/pages.constants";
import NavButton from "@/components/NavButton";
import { useAuth } from "@/providers/AuthContext";

export default function AppNavBar() {
	const { userRole } = useAuth();

	return (
		<nav
			className="pointer-events-none fixed right-0 bottom-0 left-0 flex justify-center p-4"
			style={{ zIndex: Z_INDEX.appNavBar }}
		>
			<div className="glass shadow-3xl pointer-events-auto flex w-fit items-center justify-around space-x-1.5 overflow-visible rounded-3xl border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-900">
				{userRole === "CITIZEN" && (
					<>
						<NavButton
							destination="/"
							label="แผนที่"
							leftIcon={<Map strokeWidth={2.5} />}
						/>
						<NavButton
							destination="/create-request"
							label="SOS"
							leftIcon={<Bell strokeWidth={2.5} />}
						/>
						<NavButton
							destination="/create-incident"
							label="แจ้งเหตุ"
							leftIcon={<AlertTriangle strokeWidth={2.5} />}
						/>
						<NavButton
							destination="/announcements"
							label="ประกาศ"
							leftIcon={<Megaphone strokeWidth={2.5} />}
						/>
					</>
				)}

				{userRole === "OFFICER" && (
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

				{userRole === "ADMIN" && (
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
							destination="/create-announcement"
							label="ประกาศ"
							leftIcon={<Megaphone strokeWidth={2.5} />}
						/>
					</>
				)}
			</div>
		</nav>
	);
}
