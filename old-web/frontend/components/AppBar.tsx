import React, { useState } from "react";
import { Role, AppView } from "../types/index";
import {
	Activity,
	User,
	Shield,
	Siren,
	Menu,
	X,
	Sun,
	Moon,
	Laptop,
	Plus,
	Minus,
} from "lucide-react";

interface AppBarProps {
	role: Role;
	setRole: (role: Role) => void;
	setCurrentView: (view: AppView) => void;
	resetForm: () => void;
	theme: "light" | "dark" | "system";
	setTheme: (theme: "light" | "dark" | "system") => void;
	fontSize: number;
	setFontSize: (size: number) => void;
	onAuthClick?: () => void;
	onLogout?: () => void;
	currentUserRole?: string | null;
}

const AppBar: React.FC<AppBarProps> = ({
	role,
	setRole,
	setCurrentView,
	resetForm,
	theme,
	setTheme,
	fontSize,
	setFontSize,
	onAuthClick,
	onLogout,
	currentUserRole,
}) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const roles = [
		{
			id: "CITIZEN",
			label: "ประชาชน",
			icon: <User size={16} />,
			color: "bg-gold-500",
			textColor: "text-gold-500",
			view: "MAP",
		},
		{
			id: "OFFICER",
			label: "เจ้าหน้าที่",
			icon: <Shield size={16} />,
			color: "bg-emerald-600",
			textColor: "text-emerald-600",
			view: "LIST",
		},
		{
			id: "ADMIN",
			label: "ศูนย์บัญชาการ",
			icon: <Siren size={16} />,
			color: "bg-amber-600",
			textColor: "text-amber-600",
			view: "STATS",
		},
	];

	const handleRoleChange = (roleId: Role, view: AppView) => {
		// Require authentication for OFFICER and ADMIN roles
		if ((roleId === "OFFICER" || roleId === "ADMIN") && !currentUserRole) {
			alert("กรุณาเข้าสู่ระบบก่อนเปลี่ยนบทบาท");
			if (onAuthClick) onAuthClick();
			return;
		}

		// Check if user has permission for the selected role
		if (
			roleId === "OFFICER" &&
			currentUserRole !== "OFFICER" &&
			currentUserRole !== "เจ้าหน้าที่" &&
			currentUserRole !== "ADMIN"
		) {
			alert("คุณไม่มีสิทธิ์เข้าใช้งานในบทบาทเจ้าหน้าที่");
			return;
		}

		if (
			roleId === "ADMIN" &&
			currentUserRole !== "ADMIN" &&
			currentUserRole !== "ศูนย์บัญชาการ"
		) {
			alert("คุณไม่มีสิทธิ์เข้าใช้งานในบทบาทศูนย์บัญชาการ");
			return;
		}

		setRole(roleId);
		setCurrentView(view);
		resetForm();
		setIsMenuOpen(false);
	};

	const toggleTheme = () => {
		const modes: ("light" | "dark" | "system")[] = [
			"light",
			"dark",
			"system",
		];
		const next = modes[(modes.indexOf(theme) + 1) % modes.length];
		setTheme(next);
	};

	const ThemeIcon = () => {
		if (theme === "light") return <Sun size={18} />;
		if (theme === "dark") return <Moon size={18} />;
		return <Laptop size={18} />;
	};

	return (
		<header className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 z-[1100] flex-none">
			<div className="w-full px-5 h-16 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="bg-gold-500 p-2 rounded-2xl shadow-lg shadow-gold-500/20">
						<Activity size={20} className="text-white" />
					</div>
					<div>
						<h1 className="font-bold text-xl tracking-tight leading-none text-slate-900 dark:text-white">
							FloodGuard
						</h1>
						<p className="text-xs text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase mt-0.5">
							สุโขทัย
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					{/* Font Size Controls */}
					<div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900 rounded-2xl p-1">
						<button
							onClick={() =>
								setFontSize(Math.max(80, fontSize - 10))
							}
							disabled={fontSize <= 80}
							title="ลดขนาดตัวอักษร"
							className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
						>
							<Minus size={16} />
						</button>
						<span className="text-xs font-bold text-slate-600 dark:text-slate-400 px-2 min-w-[3rem] text-center">
							A {fontSize}%
						</span>
						<button
							onClick={() =>
								setFontSize(Math.min(140, fontSize + 10))
							}
							disabled={fontSize >= 140}
							title="เพิ่มขนาดตัวอักษร"
							className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
						>
							<Plus size={16} />
						</button>
					</div>

					{/* Theme Toggle Button */}
					<button
						onClick={toggleTheme}
						title="เปลี่ยนธีม"
						className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-gold-50 dark:hover:bg-gold-900/20 hover:text-gold-600 transition-all border border-transparent hover:border-gold-200"
					>
						<ThemeIcon />
					</button>

					{/* Auth Button */}
					{currentUserRole ? (
						<button
							onClick={onLogout}
							title="ออกจากระบบ"
							className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-red-50 hover:text-red-600 transition-all"
						>
							ออกจากระบบ
						</button>
					) : (
						<button
							onClick={onAuthClick}
							title="เข้าสู่ระบบ"
							className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-gold-50 hover:text-gold-600 transition-all"
						>
							เข้าสู่ระบบ
						</button>
					)}

					{/* Desktop Role Tabs */}
					<div className="hidden md:flex bg-slate-100 dark:bg-slate-900 rounded-2xl p-1 gap-1">
						{roles.map((r) => (
							<button
								key={r.id}
								onClick={() =>
									handleRoleChange(
										r.id as Role,
										r.view as AppView,
									)
								}
								className={`px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${role === r.id ? `bg-white dark:bg-slate-800 text-gold-600 dark:text-gold-400 shadow-sm` : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}`}
							>
								{r.icon} <span>{r.label}</span>
							</button>
						))}
					</div>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="md:hidden p-2.5 bg-slate-100 dark:bg-slate-900 rounded-2xl text-slate-600 dark:text-slate-300 transition-all"
					>
						{isMenuOpen ? <X size={20} /> : <Menu size={20} />}
					</button>
				</div>
			</div>

			{/* Mobile Menu Content */}
			{isMenuOpen && (
				<div className="absolute top-full left-0 right-0 bg-slate-200 dark:bg-slate-800 bg-opacity-90 bg-blur-4xl border-b border-slate-200 dark:border-slate-800 p-4 md:hidden shadow-2xl animate-in fade-in slide-in-from-top-2 z-[1100]">
					<p className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest px-2">
						บทบาทผู้ใช้งาน
					</p>
					<div className="grid grid-cols-1 gap-2">
						{roles.map((r) => (
							<button
								key={r.id}
								onClick={() =>
									handleRoleChange(
										r.id as Role,
										r.view as AppView,
									)
								}
								className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${role === r.id ? `bg-gold-500 text-white shadow-xl shadow-gold-500/20` : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400"}`}
							>
								<div className="flex items-center gap-4">
									<div
										className={`p-2 rounded-xl ${role === r.id ? "bg-white/20" : "bg-white dark:bg-slate-800 shadow-sm"}`}
									>
										{/* Fixed: cast icon to React.ReactElement<any> to allow dynamic props like size and className */}
										{React.cloneElement(
											r.icon as React.ReactElement<any>,
											{
												size: 18,
												className:
													role === r.id
														? "text-white"
														: r.textColor,
											},
										)}
									</div>
									<span>{r.label}</span>
								</div>
								{role === r.id && (
									<div className="w-1.5 h-1.5 bg-white rounded-full"></div>
								)}
							</button>
						))}
					</div>
				</div>
			)}
		</header>
	);
};

export default AppBar;
