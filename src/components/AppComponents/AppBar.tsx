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
			<div className="flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5 shadow-md sm:px-6 dark:border-slate-800 dark:bg-slate-950">
				<Link
					className="flex-cols flex h-full cursor-pointer items-center gap-3 transition-transform duration-200 hover:scale-105"
					to="/"
				>
					<BaseButton
						isIconOnly
						className="aspect-square h-full w-auto p-0!"
						icon={<Waves size={24} />}
						size="xl"
					/>
					<div className="flex flex-col">
						<span className="font-heading text-lg font-bold text-slate-900 dark:text-white">
							รู้ทัน
							<span className="font-heading text-gold-500">น้ำท่วม</span>
						</span>
						<span className="text-xs text-slate-500 dark:text-slate-400">
							จังหวัดสุโขทัย
						</span>
					</div>
				</Link>

				{/* Desktop Controls */}
				<div className="hidden h-full items-center gap-2 lg:flex">
					{/* Font Size Controls */}
					<FontSizeControls fontSize={fontSize} setFontSize={setFontSize} />

					{/* Theme Toggle */}
					<BaseButton
						isIconOnly
						className="aspect-square h-full w-auto p-0! text-slate-700 dark:text-slate-200"
						icon={<ThemeIcon theme={theme} />}
						size="xl"
						variant="outline"
						onClick={toggleTheme}
					/>

					{/* Divider */}
					<div className="mx-2 h-full w-px bg-slate-200 dark:bg-slate-700" />

					{/* Roles Tabs */}
					<div className="flex h-full items-center gap-0.5 rounded-2xl bg-slate-100 p-1 dark:bg-slate-900">
						{roles.map((role) => {
							const active = userRole === role.id;

							return (
								<BaseButton
									key={role.id}
									className={`h-full rounded-xl py-0! font-semibold ${active ? "bg-white! text-gold-600! shadow-sm dark:bg-slate-800! dark:text-gold-400!" : ""}`}
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
						className={`h-full rounded-xl py-0! font-semibold ${isAuthenticated ? "text-gold-600! shadow-sm dark:text-gold-400!" : ""}`}
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
				<div className="flex h-full items-center gap-2 lg:hidden">
					{(() => {
						const role = roles.find((r) => r.id === userRole);

						if (!role) return null;

						return (
							<div
								className="text-md inline-flex h-full items-center justify-center gap-3 rounded-xl border border-gold-500 bg-transparent px-5 font-semibold text-gold-500"
								title={role.label}
							>
								{role.icon}
								{role.label}
							</div>
						);
					})()}

					<BaseButton
						className="aspect-square h-full rounded-xl p-0!"
						icon={isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
						size="lg"
						variant="primary"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					/>
				</div>
			</div>

			{/* Mobile Menu Content */}
			<div
				className={`absolute top-full right-0 left-0 border-b border-slate-200 bg-white p-4 shadow-md transition-all duration-300 ease-in-out lg:hidden dark:border-slate-800 dark:bg-slate-900 ${isMobileMenuOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
				style={{ zIndex: Z_INDEX.mobileMenu }}
			>
				<div className="flex flex-col gap-2">
					{/* Font Size Controls */}
					<div className="flex h-14 items-center justify-between rounded-2xl bg-slate-100 p-2 pl-4 dark:bg-slate-800">
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
					<div className="flex h-14 items-center justify-between rounded-2xl bg-slate-100 p-2 pl-4 dark:bg-slate-800">
						<div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
							<Contrast size={20} />
							<span className="text-md font-medium">โหมดการแสดงผล</span>
						</div>

						<BaseButton
							className="h-full w-36 rounded-xl p-0! text-slate-700 dark:text-slate-200"
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

					<div className="my-2 h-px bg-slate-100 dark:bg-slate-800" />

					{/* Roles Tabs */}
					<div className="flex h-14 w-full items-center gap-0.5 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
						{roles.map((role) => {
							const active = userRole === role.id;

							return (
								<BaseButton
									key={role.id}
									className={`h-full w-full rounded-xl px-2! py-0! font-semibold ${active ? "bg-white! text-gold-600! shadow-sm dark:bg-slate-900! dark:text-gold-400!" : ""}`}
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
						className={`rounded-xl font-semibold ${isAuthenticated ? "text-gold-600! shadow-sm dark:text-gold-400!" : ""}`}
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
