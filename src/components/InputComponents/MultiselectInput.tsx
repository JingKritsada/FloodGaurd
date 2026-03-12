import { useState, useRef, useEffect, type ReactNode, type KeyboardEvent } from "react";
import { ChevronDown, X, Check } from "lucide-react";

import {
	inputIconSizeStyles,
	inputSizeStyles,
	inputVariantStyles,
} from "@/constants/components.constants";
import { type MultiselectProps, type SelectOption } from "@/interfaces/components.interfaces";
import { filterOptions } from "@/utils/input.utils";

export default function MultiselectInput({
	options = [],
	value = [],
	onValueChange,
	size = "md",
	variant = "default",
	icon: Icon,
	iconPosition = "left",
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

	const iconNode = Icon as ReactNode;
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
					{isRequired && <span className="text-red-500 ml-1">*</span>}
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
						disabled ? "opacity-60 cursor-not-allowed" : "",
					]
						.filter(Boolean)
						.join(" ")}
					role="combobox"
					tabIndex={disabled ? -1 : 0}
					onClick={handleToggle}
					onKeyDown={handleKeyDown}
				>
					{iconNode && iconPosition === "left" && (
						<span
							className="flex-shrink-0 text-slate-400 dark:text-slate-500 mr-1"
							style={{ fontSize: iconSize }}
						>
							{iconNode}
						</span>
					)}

					<div className="flex flex-1 flex-wrap gap-1 min-w-0">
						{selectedOptions.length === 0 ? (
							<span className="text-slate-400 dark:text-slate-500">
								{placeholder}
							</span>
						) : (
							selectedOptions.map((option: SelectOption) => (
								<span
									key={option.value}
									className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded bg-gold-100 dark:bg-gold-900/30 text-gold-800 dark:text-gold-300 font-medium"
								>
									{option.label}
									<button
										aria-label={`Remove ${option.label}`}
										className="hover:text-gold-900 dark:hover:text-gold-100 cursor-pointer"
										type="button"
										onClick={(e) => handleRemoveTag(option.value, e)}
									>
										<X size={10} />
									</button>
								</span>
							))
						)}
					</div>

					<span className="flex items-center gap-1 flex-shrink-0 text-slate-400 dark:text-slate-500 ml-1">
						{selectedOptions.length > 0 && (
							<button
								aria-label="Clear all selections"
								className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
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

					{iconNode && iconPosition === "right" && (
						<span
							className="flex-shrink-0 text-slate-400 dark:text-slate-500 ml-1"
							style={{ fontSize: iconSize }}
						>
							{iconNode}
						</span>
					)}
				</div>

				{/* Dropdown panel */}
				{isOpen && (
					<div
						aria-multiselectable="true"
						className="absolute z-50 mt-1 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg overflow-hidden"
						id={`${id}-listbox`}
						role="listbox"
					>
						{searchable && (
							<div className="p-2 border-b border-slate-100 dark:border-slate-700">
								<input
									ref={searchRef}
									className="w-full text-sm outline-none bg-transparent text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
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
												"flex items-center justify-between px-3 py-2 text-sm cursor-pointer",
												option.disabled
													? "opacity-50 cursor-not-allowed text-slate-400 dark:text-slate-500"
													: "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700",
												isSelected
													? "bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-300"
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
													className="text-gold-500 flex-shrink-0"
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
