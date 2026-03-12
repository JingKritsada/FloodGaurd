import { Z_INDEX } from "@/constants/pages.constants";

export default function GlobalLoading() {
	return (
		<div
			className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-lg transition-opacity"
			style={{ zIndex: Z_INDEX.globalLoading }}
		>
			<div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6">
				<div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 dark:border-slate-700 border-t-forest-500 dark:border-t-forest-400" />
				<p className="text-slate-600 dark:text-slate-300 font-medium text-lg">
					กำลังโหลด...
				</p>
			</div>
		</div>
	);
}
