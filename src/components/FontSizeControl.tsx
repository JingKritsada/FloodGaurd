import type { FontSizeControlProps } from "@/interfaces/components.interfaces";

import { Minus, Plus } from "lucide-react";

import BaseButton from "./BaseComponents/BaseButton";

export default function FontSizeControls({
	className,
	fontSize,
	setFontSize,
}: FontSizeControlProps) {
	return (
		<div
			className={`flex items-center h-full p-0.75 bg-transparent border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 gap-0.5 rounded-xl ${className || ""}`}
		>
			{/* Decrease */}
			<BaseButton
				isIconOnly
				className="p-0! h-full w-auto aspect-square text-xs"
				disabled={fontSize <= 80}
				icon={<Minus size={20} />}
				size="lg"
				title="ขนาดตัวอักษรเล็ก"
				variant="ghost"
				onClick={() => setFontSize((fontSize - 10) as Parameters<typeof setFontSize>[0])}
			/>

			{/* Text */}
			<span className="text-sm font-bold font-mono text-slate-700 dark:text-slate-400 px-2 min-w-12 text-center">
				A {fontSize}%
			</span>

			{/* Increase */}
			<BaseButton
				isIconOnly
				className="p-0! h-full w-auto aspect-square text-xs"
				disabled={fontSize >= 140}
				icon={<Plus size={20} />}
				size="lg"
				title="เพิ่มขนาดตัวอักษร"
				variant="ghost"
				onClick={() => setFontSize((fontSize + 10) as Parameters<typeof setFontSize>[0])}
			/>
		</div>
	);
}
