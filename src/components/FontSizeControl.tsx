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
			className={`flex h-full items-center gap-0.5 rounded-xl border border-slate-300 bg-transparent p-0.75 text-slate-700 dark:border-slate-600 dark:text-slate-200 ${className || ""}`}
		>
			{/* Decrease */}
			<BaseButton
				isIconOnly
				className="aspect-square h-full w-auto p-0! text-xs"
				disabled={fontSize <= 80}
				leftIcon={<Minus size={20} />}
				size="lg"
				title="ขนาดตัวอักษรเล็ก"
				variant="ghost"
				onClick={() => setFontSize((fontSize - 10) as Parameters<typeof setFontSize>[0])}
			/>

			{/* Text */}
			<span className="min-w-12 px-2 text-center font-mono text-sm font-bold text-slate-700 dark:text-slate-400">
				A {fontSize}%
			</span>

			{/* Increase */}
			<BaseButton
				isIconOnly
				className="aspect-square h-full w-auto p-0! text-xs"
				disabled={fontSize >= 140}
				leftIcon={<Plus size={20} />}
				size="lg"
				title="เพิ่มขนาดตัวอักษร"
				variant="ghost"
				onClick={() => setFontSize((fontSize + 10) as Parameters<typeof setFontSize>[0])}
			/>
		</div>
	);
}
