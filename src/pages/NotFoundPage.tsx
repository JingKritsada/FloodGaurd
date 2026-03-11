import { Link } from "react-router-dom";

import BaseButton from "@/components/BaseComponents/BaseButton";

export default function NotFoundPage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6 text-center">
			<div className="text-8xl font-black text-slate-200 dark:text-slate-800">404</div>
			<div>
				<h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
					ไม่พบหน้าที่ต้องการ
				</h2>
				<p className="text-slate-500 dark:text-slate-400 text-sm">
					หน้าที่คุณกำลังมองหาไม่มีอยู่ในระบบ
				</p>
			</div>
			<Link to="/">
				<BaseButton size="lg" variant="primary">
					กลับหน้าแรก
				</BaseButton>
			</Link>
		</div>
	);
}
