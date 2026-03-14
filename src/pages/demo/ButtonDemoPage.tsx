import { Zap } from "lucide-react";

import BaseButton from "@/components/BaseComponents/BaseButton";
import { type ButtonSize, type ButtonVariant } from "@/types/components.types";

const variants: ButtonVariant[] = [
	"primary",
	"secondary",
	"success",
	"warning",
	"danger",
	"link",
	"outline",
	"ghost",
	"none",
];

const sizes: ButtonSize[] = ["xs", "sm", "md", "lg", "xl"];

export default function ButtonDemoPage() {
	return (
		<div className="space-y-12 p-10">
			{/* All variants × all sizes with icon */}
			<section className="space-y-4">
				<h2 className="text-lg font-semibold text-slate-700">
					Variants × Sizes (with icon)
				</h2>
				<div className="overflow-x-auto">
					<table className="border-separate border-spacing-2">
						<thead>
							<tr>
								<th className="w-24 pr-4 text-left text-xs font-normal text-slate-400">
									variant \ size
								</th>
								{sizes.map((size) => (
									<th
										key={size}
										className="px-2 text-center text-xs font-normal text-slate-400"
									>
										{size}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{variants.map((variant) => (
								<tr key={variant}>
									<td className="py-1 pr-4 text-xs text-slate-500">{variant}</td>
									{sizes.map((size) => (
										<td key={size} className="px-2 py-1 text-center">
											<BaseButton
												leftIcon={<Zap />}
												size={size}
												variant={variant}
											>
												Button
											</BaseButton>
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* Orientation */}
			<section className="space-y-4">
				<h2 className="text-lg font-semibold text-slate-700">Orientation</h2>
				<div className="flex flex-wrap gap-4">
					<BaseButton leftIcon={<Zap />} orientation="horizontal" variant="primary">
						Horizontal
					</BaseButton>
					<BaseButton leftIcon={<Zap />} orientation="vertical" variant="primary">
						Vertical (flex-col)
					</BaseButton>
					<BaseButton orientation="vertical" rightIcon={<Zap />} variant="outline">
						Vertical Post-icon
					</BaseButton>
				</div>
			</section>

			{/* Vertical Sizes */}
			<section className="space-y-4">
				<h2 className="text-lg font-semibold text-slate-700">Vertical Sizes</h2>
				<div className="flex flex-wrap items-end gap-3">
					{sizes.map((size) => (
						<BaseButton
							key={size}
							leftIcon={<Zap />}
							orientation="vertical"
							size={size}
							variant="secondary"
						>
							{size}
						</BaseButton>
					))}
				</div>
			</section>

			{/* Icon only */}
			<section className="space-y-4">
				<h2 className="text-lg font-semibold text-slate-700">Icon Only</h2>
				<div className="overflow-x-auto">
					<table className="border-separate border-spacing-2">
						<thead>
							<tr>
								<th className="w-24 pr-4 text-left text-xs font-normal text-slate-400">
									variant \ size
								</th>
								{sizes.map((size) => (
									<th
										key={size}
										className="px-2 text-center text-xs font-normal text-slate-400"
									>
										{size}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{variants.map((variant) => (
								<tr key={variant}>
									<td className="py-1 pr-4 text-xs text-slate-500">{variant}</td>
									{sizes.map((size) => (
										<td key={size} className="px-2 py-1 text-center">
											<BaseButton
												isIconOnly
												leftIcon={<Zap />}
												size={size}
												variant={variant}
											/>
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* Loading state */}
			<section className="space-y-4">
				<h2 className="text-lg font-semibold text-slate-700">Loading State</h2>
				<div className="flex flex-wrap gap-3">
					{variants.map((variant) => (
						<BaseButton key={variant} isLoading variant={variant}>
							{variant}
						</BaseButton>
					))}
				</div>
			</section>

			{/* Disabled state */}
			<section className="space-y-4">
				<h2 className="text-lg font-semibold text-slate-700">Disabled State</h2>
				<div className="flex flex-wrap gap-3">
					{variants.map((variant) => (
						<BaseButton key={variant} disabled leftIcon={<Zap />} variant={variant}>
							{variant}
						</BaseButton>
					))}
				</div>
			</section>
		</div>
	);
}
