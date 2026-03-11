import { useTheme } from "@/providers/ThemeContext";
import { useStatsDashboard } from "@/pages/StatsDashboardPage/hooks/useStatsDashboard";
import StatsCardsSection from "@/pages/StatsDashboardPage/sections/StatsCardsSection";
import StatsChartsSection from "@/pages/StatsDashboardPage/sections/StatsChartsSection";

export default function StatsDashboardPage() {
	const { theme } = useTheme();
	const { incidents, loading, error } = useStatsDashboard();

	if (loading) {
		return (
			<div className="flex items-center justify-center h-full text-slate-400 font-bold">
				กำลังโหลด...
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-full text-red-500 font-bold">
				{error}
			</div>
		);
	}

	return (
		<div className="p-4 bg-slate-50 dark:bg-slate-950 h-full overflow-y-auto pb-32 space-y-4">
			<StatsCardsSection incidents={incidents} />
			<StatsChartsSection incidents={incidents} theme={theme} />
		</div>
	);
}
