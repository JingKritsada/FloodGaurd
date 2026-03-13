import { useState, useRef, useEffect, type ReactNode, type KeyboardEvent } from "react";
import { ChevronDown, X, Check } from "lucide-react";

import {
	inputIconSizeStyles,
	inputSizeStyles,
	inputVariantStyles,
} from "@/constants/components.constants";
import { type MultiselectProps, type SelectOption } from "@/interfaces/components.interfaces";
import { filterOptions } from "@/utils/components.utils";

export default function MultiselectInput({
	options = [],
	value = [],
	onValueChange,
	size = "md",
	variant = "default",
	leftIcon,
	rightIcon,
	className = "",
	inputClassName = "",
	isRequired = false,
	label,
	placeholder = "Select options",
	searchable = true,
	disabled = false,
	name,
	id,
}: MultiselectProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [query, setQuery] = useState("");
	const containerRef = useRef<HTMLDivElement>(null);
	const searchRef = useRef<HTMLInputElement>(null);

	const leftIconNode = leftIcon as ReactNode;
	const rightIconNode = rightIcon as ReactNode;
	const iconSize = inputIconSizeStyles[size];
	const selectedOptions = options.filter((o) => value.includes(o.value));
	const filtered = filterOptions(options, query);

	// Close dropdown on outside click
	useEffect(() => {
		function handleOutsideClick(e: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setIsOpen(false);
				setQuery("");
			}
		}
		document.addEventListener("mousedown", handleOutsideClick);

		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, []);

	// Focus search input when dropdown opens
	useEffect(() => {
		if (isOpen && searchable && searchRef.current) {
			searchRef.current.focus();
		}
	}, [isOpen, searchable]);

	function handleToggle() {
		if (disabled) return;
		setIsOpen((prev) => !prev);
		if (isOpen) setQuery("");
	}

	function handleSelect(optionValue: string) {
		if (!onValueChange) return;
		if (value.includes(optionValue)) {
			onValueChange(value.filter((v) => v !== optionValue));
		} else {
			onValueChange([...value, optionValue]);
		}
	}

	function handleRemoveTag(optionValue: string, e: React.MouseEvent) {
		e.stopPropagation();
		if (!onValueChange) return;
		onValueChange(value.filter((v) => v !== optionValue));
	}

	function handleClearAll(e: React.MouseEvent) {
		e.stopPropagation();
		onValueChange?.([]);
	}

	function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
		if (e.key === "Escape") {
			setIsOpen(false);
			setQuery("");
		}
		if (e.key === "Enter" || e.key === " ") {
			if (!isOpen) setIsOpen(true);
		}
	}

	const baseWrapperStyle =
		"flex items-center w-full min-h-fit transition-colors duration-200 cursor-pointer";

	return (
		<div className={["flex flex-col gap-1", className].filter(Boolean).join(" ")}>
			{label && (
				<label
					className="text-sm font-medium text-slate-700 dark:text-slate-300"
					htmlFor={id}
				>
					{label}
					{isRequired && <span className="ml-1 text-red-500">*</span>}
				</label>
			)}

			<div ref={containerRef} className="relative">
				{/* Hidden native selects for form compatibility */}
				{name &&
					selectedOptions.map((o: SelectOption) => (
						<input key={o.value} name={name} type="hidden" value={o.value} />
					))}

				{/* Custom trigger */}
				<div
					aria-controls={`${id}-listbox`}
					aria-expanded={isOpen}
					aria-haspopup="listbox"
					className={[
						baseWrapperStyle,
						inputVariantStyles[variant],
						inputSizeStyles[size],
						inputClassName,
						disabled ? "cursor-not-allowed opacity-60" : "",
					]
						.filter(Boolean)
						.join(" ")}
					role="combobox"
					tabIndex={disabled ? -1 : 0}
					onClick={handleToggle}
					onKeyDown={handleKeyDown}
				>
					{leftIconNode && (
						<span
							className="mr-1 shrink-0 text-slate-400 dark:text-slate-500"
							style={{ fontSize: iconSize }}
						>
							{leftIconNode}
						</span>
					)}

					<div className="flex min-w-0 flex-1 flex-wrap gap-1">
						{selectedOptions.length === 0 ? (
							<span className="text-slate-400 dark:text-slate-500">
								{placeholder}
							</span>
						) : (
							selectedOptions.map((option: SelectOption) => (
								<span
									key={option.value}
									className="inline-flex items-center gap-1 rounded bg-gold-100 px-2 py-0.5 text-xs font-medium text-gold-800 dark:bg-gold-900/30 dark:text-gold-300"
								>
									{option.label}
									<button
										aria-label={`Remove ${option.label}`}
										className="cursor-pointer hover:text-gold-900 dark:hover:text-gold-100"
										type="button"
										onClick={(e) => handleRemoveTag(option.value, e)}
									>
										<X size={10} />
									</button>
								</span>
							))
						)}
					</div>

					<span className="ml-1 flex shrink-0 items-center gap-1 text-slate-400 dark:text-slate-500">
						{selectedOptions.length > 0 && (
							<button
								aria-label="Clear all selections"
								className="cursor-pointer hover:text-slate-600 dark:hover:text-slate-300"
								type="button"
								onClick={handleClearAll}
							>
								<X size={iconSize} />
							</button>
						)}
						<ChevronDown
							className={[
								"transition-transform duration-200",
								isOpen ? "rotate-180" : "",
							]
								.filter(Boolean)
								.join(" ")}
							size={iconSize}
						/>
					</span>

					{rightIconNode && (
						<span
							className="ml-1 shrink-0 text-slate-400 dark:text-slate-500"
							style={{ fontSize: iconSize }}
						>
							{rightIconNode}
						</span>
					)}
				</div>

				{/* Dropdown panel */}
				{isOpen && (
					<div
						aria-multiselectable="true"
						className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
						id={`${id}-listbox`}
						role="listbox"
					>
						{searchable && (
							<div className="border-b border-slate-100 p-2 dark:border-slate-700">
								<input
									ref={searchRef}
									className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
									placeholder="Search…"
									type="text"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
								/>
							</div>
						)}
						<ul className="max-h-56 overflow-y-auto py-1">
							{filtered.length === 0 ? (
								<li className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
									No options found
								</li>
							) : (
								filtered.map((option: SelectOption) => {
									const isSelected = value.includes(option.value);

									return (
										<li
											key={option.value}
											aria-selected={isSelected}
											className={[
												"flex cursor-pointer items-center justify-between px-3 py-2 text-sm",
												option.disabled
													? "cursor-not-allowed text-slate-400 opacity-50 dark:text-slate-500"
													: "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700",
												isSelected
													? "bg-gold-50 text-gold-700 dark:bg-gold-900/20 dark:text-gold-300"
													: "",
											]
												.filter(Boolean)
												.join(" ")}
											role="option"
											tabIndex={option.disabled ? -1 : 0}
											onClick={() =>
												!option.disabled && handleSelect(option.value)
											}
											onKeyDown={(e) => {
												if (
													(e.key === "Enter" || e.key === " ") &&
													!option.disabled
												) {
													handleSelect(option.value);
												}
											}}
										>
											<span>{option.label}</span>
											{isSelected && (
												<Check
													className="shrink-0 text-gold-500"
													size={14}
												/>
											)}
										</li>
									);
								})
							)}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}
