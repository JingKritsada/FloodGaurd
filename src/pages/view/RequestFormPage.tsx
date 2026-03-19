import { ArrowLeft, ArrowRight } from "lucide-react";

import BaseButton from "@/components/BaseComponents/BaseButton";

export default function RequestFormPage(): React.JSX.Element {
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	return (
		<form className="h-full overflow-y-auto pb-28" onSubmit={handleSubmit}>
			{/* Header */}
			<div className="sticky top-0 z-10 flex flex-row items-center justify-between border-b border-slate-200 bg-white/80 p-4 backdrop-blur-lg sm:px-6 dark:border-slate-800 dark:bg-slate-950/80">
				{/* Title */}
				<div className="flex h-full flex-col items-start gap-1">
					<h2 className="text-2xl font-black text-slate-900 dark:text-white">
						ขอความช่วยเหลือ
					</h2>
				</div>

				<div className="flex h-full flex-row items-center justify-start gap-2">
					{/* Back Button */}
					<BaseButton
						className="group"
						leftIcon={
							<ArrowLeft
								className="hidden transition-transform duration-300 group-hover:-translate-x-1 sm:block"
								size={24}
								strokeWidth={3}
							/>
						}
						size="lg"
						variant="secondary"
						onClick={() => {}}
					>
						ย้อนกลับ
					</BaseButton>

					{/* Save Button */}
					<BaseButton
						className="group"
						rightIcon={
							<ArrowRight
								className="hidden transition-transform duration-300 group-hover:translate-x-1 sm:block"
								size={24}
								strokeWidth={3}
							/>
						}
						size="lg"
						type="submit"
						variant="success"
					>
						ถัดไป
					</BaseButton>
				</div>
			</div>

			{/* Detail Section */}

			{/* Map Picker Section */}
		</form>
	);
}
