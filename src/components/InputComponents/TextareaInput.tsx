import BaseTextarea from "@/components/BaseComponents/BaseTextarea";
import { type BaseTextareaProps } from "@/interfaces/components.interfaces";

export default function TextareaInput({ ...props }: BaseTextareaProps) {
	return <BaseTextarea {...props} />;
}
