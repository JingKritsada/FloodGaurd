import type { IncidentPopupProps } from "@/interfaces/components.interfaces";

export default function IncidentPopup({
	incident,
	onClose,
}: IncidentPopupProps): React.JSX.Element {
	return (
		<div className="flex flex-col gap-2 p-4">
			<h3 className="text-lg font-semibold">{incident.type}</h3>
			<p className="text-sm text-gray-600">{incident.description}</p>

			<button
				className="self-end rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
				onClick={onClose}
			>
				Close
			</button>
		</div>
	);
}
