import { type InputProps } from "@/interfaces/components.interfaces";
import TextInput from "@/components/InputComponents/TextInput";
import NumberInput from "@/components/InputComponents/NumberInput";
import PasswordInput from "@/components/InputComponents/PasswordInput";
import SelectInput from "@/components/InputComponents/SelectInput";
import MultiselectInput from "@/components/InputComponents/MultiselectInput";
import TextareaInput from "@/components/InputComponents/TextareaInput";

export default function Input(props: InputProps) {
	switch (props.type) {
		case "text":
		case "email":
		case "search":
		case "tel":
		case "url":
			return <TextInput {...props} />;
		case "number":
			return <NumberInput {...props} />;
		case "password":
			return <PasswordInput {...props} />;

		case "select": {
			const { type: _type, ...rest } = props;

			return <SelectInput {...rest} />;
		}
		case "multiselect": {
			const { type: _type, ...rest } = props;

			return <MultiselectInput {...rest} />;
		}
		case "textarea": {
			const { type: _type, ...rest } = props;

			return <TextareaInput {...rest} />;
		}
	}
}
