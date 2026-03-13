import { useState } from "react";
import { Search } from "lucide-react";

import BaseInput from "@/components/BaseComponents/BaseInput";
import BaseSelect from "@/components/BaseComponents/BaseSelect";
import BaseTextarea from "@/components/BaseComponents/BaseTextarea";
import MultiselectInput from "@/components/InputComponents/MultiselectInput";
import NumberInput from "@/components/InputComponents/NumberInput";
import PasswordInput from "@/components/InputComponents/PasswordInput";
import { type InputSize, type InputVariant } from "@/types/components.types";

const variants: InputVariant[] = ["default", "filled", "outlined", "ghost"];
const sizes: InputSize[] = ["xs", "sm", "md", "lg", "xl"];

const selectOptions = [
	{ value: "option1", label: "Option 1" },
	{ value: "option2", label: "Option 2" },
	{ value: "option3", label: "Option 3" },
];

export default function InputDemoPage() {
	const [multiselectValues, setMultiselectValues] = useState<Record<string, string[]>>({});

	function getMultiselectValue(key: string): string[] {
		return multiselectValues[key] ?? [];
	}

	function setMultiselectValue(key: string, values: string[]) {
		setMultiselectValues((prev) => ({ ...prev, [key]: values }));
	}

	return (
		<div className="space-y-12 p-10">
			{/* Text Input — all variants × all sizes */}
			<section className="space-y-4">
				<h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
					Text Input — Variants × Sizes
				</h2>
				<div className="overflow-x-auto">
					<table className="border-separate border-spacing-2">
						<thead>
							<tr>
								<th className="w-28 pr-4 text-left text-xs font-normal text-slate-400">
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
										<td key={size} className="px-2 py-1">
											<BaseInput
												placeholder="Text…"
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

			{/* Text Input with icon */}
			<section className="space-y-4">
				<h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
					Text Input — With Icon
				</h2>
				<div className="overflow-x-auto">
					<table className="border-separate border-spacing-2">
						<thead>
							<tr>
								<th className="w-28 pr-4 text-left text-xs font-normal text-slate-400">
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
										<td key={size} className="px-2 py-1">
											<BaseInput
												leftIcon={<Search />}
												placeholder="Search…"
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

			{/* Select — all variants × all sizes */}
			<section className="space-y-4">
				<h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
					Select — Variants × Sizes
				</h2>
				<div className="overflow-x-auto">
					<table className="border-separate border-spacing-2">
						<thead>
							<tr>
								<th className="w-28 pr-4 text-left text-xs font-normal text-slate-400">
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
										<td key={size} className="px-2 py-1">
											<BaseSelect
												options={selectOptions}
												placeholder="Select…"
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

			{/* Textarea — all variants × all sizes */}
			<section className="space-y-4">
				<h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
					Textarea — Variants × Sizes
				</h2>
				<div className="overflow-x-auto">
					<table className="border-separate border-spacing-2">
						<thead>
							<tr>
								<th className="w-28 pr-4 text-left text-xs font-normal text-slate-400">
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
										<td key={size} className="px-2 py-1">
											<BaseTextarea
												placeholder="Type here…"
												rows={5}
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

			{/* Number Input — all variants × all sizes */}
			<section className="space-y-4">
				<h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
					Number Input — Variants × Sizes
				</h2>
				<div className="overflow-x-auto">
					<table className="border-separate border-spacing-2">
						<thead>
							<tr>
								<th className="w-28 pr-4 text-left text-xs font-normal text-slate-400">
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
										<td key={size} className="px-2 py-1">
											<NumberInput
												defaultValue={0}
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

			{/* Password Input — all variants × all sizes */}
			<section className="space-y-4">
				<h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
					Password Input — Variants × Sizes
				</h2>
				<div className="overflow-x-auto">
					<table className="border-separate border-spacing-2">
						<thead>
							<tr>
								<th className="w-28 pr-4 text-left text-xs font-normal text-slate-400">
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
										<td key={size} className="px-2 py-1">
											<PasswordInput
												placeholder="Password…"
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

			{/* Multiselect — all variants × all sizes */}
			<section className="space-y-4">
				<h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
					Multiselect — Variants × Sizes
				</h2>
				<div className="overflow-x-auto">
					<table className="border-separate border-spacing-2">
						<thead>
							<tr>
								<th className="w-28 pr-4 text-left text-xs font-normal text-slate-400">
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
										<td key={size} className="px-2 py-1">
											<MultiselectInput
												options={selectOptions}
												placeholder="Select…"
												size={size}
												value={getMultiselectValue(`${variant}-${size}`)}
												variant={variant}
												onValueChange={(vals) =>
													setMultiselectValue(`${variant}-${size}`, vals)
												}
											/>
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* Disabled state */}
			<section className="space-y-4">
				<h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
					Disabled State
				</h2>
				<div className="flex flex-wrap gap-4">
					{variants.map((variant) => (
						<BaseInput
							key={variant}
							disabled
							placeholder={variant}
							size="md"
							variant={variant}
						/>
					))}
				</div>
			</section>

			{/* With label + required */}
			<section className="space-y-4">
				<h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
					Label &amp; Required
				</h2>
				<div className="flex flex-wrap gap-4">
					{variants.map((variant) => (
						<BaseInput
							key={variant}
							isRequired
							label={variant}
							placeholder="Required field"
							size="md"
							variant={variant}
						/>
					))}
				</div>
			</section>
		</div>
	);
}
