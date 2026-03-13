import { Z_INDEX } from "@/constants/pages.constants";

export default function GlobalLoading() {
	return (
		<div
			className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-lg transition-opacity"
			style={{ zIndex: Z_INDEX.globalLoading }}
		>
			<div className="flex flex-col items-center gap-6 rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-800">
				<div className="border-t-forest-500 dark:border-t-forest-400 h-16 w-16 animate-spin rounded-full border-4 border-slate-200 dark:border-slate-700" />
				<p className="text-lg font-medium text-slate-600 dark:text-slate-300">
					กำลังโหลด...
				</p>
			</div>
		</div>
	);
}
