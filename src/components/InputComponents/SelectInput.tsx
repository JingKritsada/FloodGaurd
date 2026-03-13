import BaseSelect from "@/components/BaseComponents/BaseSelect";
import { type BaseSelectProps } from "@/interfaces/components.interfaces";

export default function SelectInput({ searchable = true, ...props }: BaseSelectProps) {
	return <BaseSelect searchable={searchable} {...props} />;
}
