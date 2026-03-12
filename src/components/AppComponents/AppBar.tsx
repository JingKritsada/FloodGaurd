import type { Role } from "@/types/index.types";

import React, { useState } from "react";
import { Contrast, Menu, Type, Waves, X } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "@/providers/AuthContext";
import { useAlert } from "@/providers/AlertContext";
import { useTheme } from "@/providers/ThemeContext";
import { Z_INDEX } from "@/constants/pages.constants";
import { roles, ThemeIcon } from "@/constants/components.constants";
import FontSizeControls from "@/components/FontSizeControl";
import BaseButton from "@/components/BaseComponents/BaseButton";

export default function AppBar(): React.JSX.Element {
	const { theme, toggleTheme, fontSize, setFontSize } = useTheme();
	const { userRole, isAuthenticated } = useAuth();
	const { showAlert } = useAlert();

	const [_isMenuOpen, setIsMenuOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const canAccessRole = (roleId: Role): boolean => {
		if (roleId === "CITIZEN") return true;
		if (!isAuthenticated) return false;
		if (roleId === "OFFICER") return userRole === "OFFICER" || userRole === "ADMIN";
		if (roleId === "ADMIN") return userRole === "ADMIN";

		return false;
	};

	const handleRoleChange = (roleId: Role) => {
		if (!canAccessRole(roleId)) {
			const label = roles.find((r) => r.id === roleId)?.label ?? roleId;

			showAlert("ไม่มีสิทธิ์เข้าถึง", `คุณไม่มีสิทธิ์เข้าใช้งานในบทบาท${label}`, "error");

			return;
		}

		setIsMenuOpen(false);
	};

	return (
		<header className="sticky top-0" style={{ zIndex: Z_INDEX.appHeaderBar }}>
			{/* Header Content */}
			<div className="w-full h-16 px-4 sm:px-6 py-2.5 flex items-center justify-between bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-md">
				<Link
					className="h-full flex flex-cols items-center gap-3 hover:scale-105 transition-transform duration-200 cursor-pointer"
					to="/"
				>
					<BaseButton
						isIconOnly
						className="p-0! w-auto h-full aspect-square"
						icon={<Waves size={24} />}
						size="xl"
					/>
					<div className="flex flex-col">
						<span className="font-heading font-bold text-lg text-slate-900 dark:text-white">
							รู้ทัน
							<span className="font-heading text-gold-500">น้ำท่วม</span>
						</span>
						<span className="text-xs text-slate-500 dark:text-slate-400">
							จังหวัดสุโขทัย
						</span>
					</div>
				</Link>

				{/* Desktop Controls */}
				<div className="hidden lg:flex items-center gap-2 h-full">
					{/* Font Size Controls */}
					<FontSizeControls fontSize={fontSize} setFontSize={setFontSize} />

					{/* Theme Toggle */}
					<BaseButton
						isIconOnly
						className="p-0! h-full w-auto aspect-square text-slate-700 dark:text-slate-200"
						icon={<ThemeIcon theme={theme} />}
						size="xl"
						variant="outline"
						onClick={toggleTheme}
					/>

					{/* Divider */}
					<div className="h-full w-px bg-slate-200 dark:bg-slate-700 mx-2" />

					{/* Roles Tabs */}
					<div className="flex items-center h-full p-1 bg-slate-100 dark:bg-slate-900 gap-0.5 rounded-2xl">
						{roles.map((role) => {
							const active = userRole === role.id;

							return (
								<BaseButton
									key={role.id}
									className={`py-0! h-full font-semibold rounded-xl ${active ? "bg-white! dark:bg-slate-800! text-gold-600! dark:text-gold-400! shadow-sm" : ""}`}
									icon={role.icon}
									iconPosition="left"
									size="md"
									title={role.label}
									variant={active ? "secondary" : "ghost"}
									onClick={() => handleRoleChange(role.id)}
								>
									{role.label}
								</BaseButton>
							);
						})}
					</div>

					{/* Auth Button */}
					<BaseButton
						className={`py-0! h-full font-semibold rounded-xl ${isAuthenticated ? "text-gold-600! dark:text-gold-400! shadow-sm" : ""}`}
						size="md"
						variant={isAuthenticated ? "secondary" : "primary"}
						onClick={() =>
							showAlert(
								isAuthenticated ? "ออกจากระบบแล้ว" : "เข้าสู่ระบบแล้ว",
								isAuthenticated
									? "คุณออกจากระบบเรียบร้อยแล้ว"
									: "คุณเข้าสู่ระบบเรียบร้อยแล้ว",
								"success"
							)
						}
					>
						{isAuthenticated ? "ออกจากระบบ" : "เข้าสู่ระบบ"}
					</BaseButton>
				</div>

				{/* Mobile Menu Button */}
				<div className="lg:hidden h-full flex items-center gap-2">
					{(() => {
						const role = roles.find((r) => r.id === userRole);

						if (!role) return null;

						return (
							<div
								className="inline-flex items-center justify-center gap-3 px-5 h-full text-md font-semibold rounded-xl bg-transparent text-gold-500 border border-gold-500"
								title={role.label}
							>
								{role.icon}
								{role.label}
							</div>
						);
					})()}

					<BaseButton
						className="h-full aspect-square p-0! rounded-xl"
						icon={isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
						size="lg"
						variant="primary"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					/>
				</div>
			</div>

			{/* Mobile Menu Content */}
			<div
				className={`absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 lg:hidden shadow-md transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
				style={{ zIndex: Z_INDEX.mobileMenu }}
			>
				<div className="flex flex-col gap-2">
					{/* Font Size Controls */}
					<div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-2 pl-4 rounded-2xl h-14">
						<div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
							<Type size={20} />
							<span className="text-md font-medium">ขนาดตัวอักษร</span>
						</div>

						<FontSizeControls
							className="w-36! justify-between"
							fontSize={fontSize}
							setFontSize={setFontSize}
						/>
					</div>

					{/* Theme Toggle */}
					<div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-2 pl-4 rounded-2xl h-14">
						<div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
							<Contrast size={20} />
							<span className="text-md font-medium">โหมดการแสดงผล</span>
						</div>

						<BaseButton
							className="p-0! h-full w-36 text-slate-700 dark:text-slate-200 rounded-xl"
							icon={<ThemeIcon theme={theme} />}
							size="lg"
							variant="outline"
							onClick={toggleTheme}
						>
							<span className="text-nowrap">
								{theme === "light"
									? "โหมดสว่าง"
									: theme === "dark"
										? "โหมดมืด"
										: "ตามระบบ"}
							</span>
						</BaseButton>
					</div>

					<div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

					{/* Roles Tabs */}
					<div className="flex items-center h-14 w-full p-1 bg-slate-100 dark:bg-slate-800 gap-0.5 rounded-2xl">
						{roles.map((role) => {
							const active = userRole === role.id;

							return (
								<BaseButton
									key={role.id}
									className={`py-0! px-2! w-full h-full font-semibold rounded-xl ${active ? "bg-white! dark:bg-slate-900! text-gold-600! dark:text-gold-400! shadow-sm" : ""}`}
									icon={role.icon}
									iconPosition="left"
									size="md"
									title={role.label}
									variant={active ? "secondary" : "ghost"}
									onClick={() => handleRoleChange(role.id)}
								>
									{role.label}
								</BaseButton>
							);
						})}
					</div>

					{/* Auth Button */}
					<BaseButton
						className={`font-semibold rounded-xl ${isAuthenticated ? "text-gold-600! dark:text-gold-400! shadow-sm" : ""}`}
						size="lg"
						variant={isAuthenticated ? "secondary" : "primary"}
						onClick={() =>
							showAlert(
								isAuthenticated ? "ออกจากระบบแล้ว" : "เข้าสู่ระบบแล้ว",
								isAuthenticated
									? "คุณออกจากระบบเรียบร้อยแล้ว"
									: "คุณเข้าสู่ระบบเรียบร้อยแล้ว",
								"success"
							)
						}
					>
						{isAuthenticated ? "ออกจากระบบ" : "เข้าสู่ระบบ"}
					</BaseButton>
				</div>
			</div>
		</header>
	);
}
