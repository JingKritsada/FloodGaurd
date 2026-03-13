import { type SelectOption } from "@/interfaces/components.interfaces";

/**
 * Filters an array of SelectOption items by matching the label
 * against the provided search query (case-insensitive).
 */
export function filterOptions(options: SelectOption[], query: string): SelectOption[] {
	const normalized = query.trim().toLowerCase();

	if (!normalized) return options;

	return options.filter((option) => option.label.toLowerCase().includes(normalized));
}
