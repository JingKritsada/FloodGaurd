import type { LoginModalProps } from "@/constants/components.constants";

import { useState } from "react";
import { AlertCircle, Lock, User } from "lucide-react";

import Input from "@/components/InputComponents/Input";
import BaseButton from "@/components/BaseComponents/BaseButton";
import { Z_INDEX } from "@/constants/pages.constants";

export default function LoginModal({
	isOpen,
	isSubmitting = false,
	error,
	onClose,
	onSubmit,
}: LoginModalProps): React.JSX.Element | null {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	if (!isOpen) return null;

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit(username, password);
	};

	return (
		<div
			className="animate-in fade-in fixed inset-0 flex items-center justify-center p-4 duration-300"
			style={{ zIndex: Z_INDEX.alertModal }}
		>
			<div
				className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
				role="button"
				tabIndex={0}
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Escape") onClose();
				}}
			/>
			<div className="animate-in zoom-in-95 relative w-full max-w-sm scale-100 transform rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl transition-all duration-200 dark:border-slate-700 dark:bg-slate-800">
				<form className="flex flex-col items-center gap-10" onSubmit={handleSubmit}>
					<div className="mt-4 rounded-2xl bg-gold-50 p-4 dark:bg-gold-900/20">
						<Lock className="h-8 w-8 text-gold-500" strokeWidth={2} />
					</div>

					<div className="flex flex-col items-center gap-2">
						<h3 className="text-2xl font-bold text-slate-900 dark:text-white">
							เข้าสู่ระบบเจ้าของสวน
						</h3>

						<p className="text-center text-sm text-slate-500 dark:text-slate-400">
							กรุณาระบุข้อมูลเพื่อจัดการสวนของคุณ
						</p>
					</div>

					{error && (
						<div className="flex w-full items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
							<AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
							<span className="text-sm font-medium">{error}</span>
						</div>
					)}

					<div className="flex w-full flex-col gap-4">
						<Input
							isRequired
							label="ชื่อผู้ใช้ (Username)"
							leftIcon={
								<User className="text-slate-500 dark:text-slate-400" size={18} />
							}
							placeholder="ระบุชื่อผู้ใช้ของคุณ"
							size="xl"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>

						<Input
							isRequired
							label="รหัสผ่าน (Password)"
							leftIcon={
								<Lock className="text-slate-500 dark:text-slate-400" size={18} />
							}
							placeholder="ระบุรหัสผ่าน"
							size="xl"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					<div className="flex w-full flex-row gap-3">
						<BaseButton
							className="w-full font-semibold"
							size="lg"
							variant="secondary"
							onClick={onClose}
						>
							ยกเลิก
						</BaseButton>

						<BaseButton
							className="w-full font-semibold"
							isLoading={isSubmitting}
							size="lg"
							type="submit"
							variant="primary"
						>
							เข้าสู่ระบบ
						</BaseButton>
					</div>
				</form>
			</div>
		</div>
	);
}
