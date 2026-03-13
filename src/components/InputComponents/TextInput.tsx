import BaseInput from "@/components/BaseComponents/BaseInput";
import { type BaseInputProps } from "@/interfaces/components.interfaces";

export default function TextInput({ ...props }: BaseInputProps) {
	return <BaseInput type="text" {...props} />;
}
