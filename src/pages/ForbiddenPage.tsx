import { Link } from "react-router-dom";

import BaseButton from "@/components/BaseComponents/BaseButton";

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6 text-center">
      <div className="text-8xl font-black text-red-200 dark:text-red-900">403</div>
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">ไม่มีสิทธิ์เข้าถึง</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
      </div>
      <Link to="/">
        <BaseButton size="lg" variant="primary">
          กลับหน้าแรก
        </BaseButton>
      </Link>
    </div>
  );
}
