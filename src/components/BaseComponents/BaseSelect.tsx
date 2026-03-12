import { useState, useRef, useEffect, type ReactNode, type KeyboardEvent } from "react";
import { ChevronDown, Check, X } from "lucide-react";

import {
	inputIconSizeStyles,
	inputSizeStyles,
	inputVariantStyles,
} from "@/constants/components.constants";
import { type BaseSelectProps } from "@/interfaces/components.interfaces";
import { filterOptions } from "@/utils/input.utils";

export default function BaseSelect({
	className = "",
	selectClassName = "",
	icon: Icon,
	iconPosition = "left",
	size = "md",
	variant = "default",
	isRequired = false,
	label,
	id,
	options = [],
	placeholder = "Select an option",
	searchable = false,
	value,
	onValueChange,
	disabled,
	name,
	...rest
}: BaseSelectProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [query, setQuery] = useState("");
	const containerRef = useRef<HTMLDivElement>(null);
	const searchRef = useRef<HTMLInputElement>(null);

	const selected = options.find((o) => o.value === value) ?? null;
	const filtered = filterOptions(options, query);
	const iconNode = Icon as ReactNode;
	const iconSize = inputIconSizeStyles[size];

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
		onValueChange?.(optionValue);
		setIsOpen(false);
		setQuery("");
	}

	function handleClear(e: React.MouseEvent) {
		e.stopPropagation();
		onValueChange?.("");
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

	const baseStyle =
		"flex items-center w-full transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60";

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
				{/* Hidden native select for form compatibility */}
				<select
					aria-hidden="true"
					className="sr-only"
					disabled={disabled}
					id={id}
					name={name}
					tabIndex={-1}
					value={value ?? ""}
					// Empty handler required to satisfy React's controlled-input contract;
					// the custom UI above manages value changes via onValueChange.
					onChange={() => {}}
					{...rest}
				>
					<option value="" />
					{options.map((o) => (
						<option key={o.value} disabled={o.disabled} value={o.value}>
							{o.label}
						</option>
					))}
				</select>

				{/* Custom trigger */}
				<div
					aria-controls={`${id}-listbox`}
					aria-expanded={isOpen}
					aria-haspopup="listbox"
					className={[
						baseStyle,
						inputVariantStyles[variant],
						inputSizeStyles[size],
						selectClassName,
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
							className="flex-shrink-0 text-slate-400 dark:text-slate-500"
							style={{ fontSize: iconSize }}
						>
							{iconNode}
						</span>
					)}

					<span className="flex-1 truncate text-left">
						{selected ? (
							<span>{selected.label}</span>
						) : (
							<span className="text-slate-400 dark:text-slate-500">
								{placeholder}
							</span>
						)}
					</span>

					<span className="flex items-center gap-1 flex-shrink-0 text-slate-400 dark:text-slate-500 ml-1">
						{selected && (
							<button
								aria-label="Clear selection"
								className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
								type="button"
								onClick={handleClear}
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
							className="flex-shrink-0 text-slate-400 dark:text-slate-500"
							style={{ fontSize: iconSize }}
						>
							{iconNode}
						</span>
					)}
				</div>

				{/* Dropdown panel */}
				{isOpen && (
					<div
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
								filtered.map((option) => (
									<li
										key={option.value}
										aria-selected={value === option.value}
										className={[
											"flex items-center justify-between px-3 py-2 text-sm cursor-pointer",
											option.disabled
												? "opacity-50 cursor-not-allowed text-slate-400 dark:text-slate-500"
												: "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700",
											value === option.value
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
										{value === option.value && (
											<Check
												className="text-gold-500 flex-shrink-0"
												size={14}
											/>
										)}
									</li>
								))
							)}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}
