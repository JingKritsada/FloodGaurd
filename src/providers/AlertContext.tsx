import type { AlertType } from "@/types/components.types";
import type { AlertContextType, AlertState } from "@/interfaces/providers.interfaces";

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";

import AlertModal from "@/components/AlertModal";

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [alertState, setAlertState] = useState<AlertState>({
		isOpen: false,
		type: "info",
		title: "",
		message: "",
		isConfirm: false,
	});

	const showAlert = useCallback(
		(title: string, message: string, type: AlertType = "info", confirmText?: string) => {
			setAlertState({
				isOpen: true,
				type,
				title,
				message,
				isConfirm: false,
				confirmText,
			});
		},
		[]
	);

	const showConfirm = useCallback(
		(
			title: string,
			message: string,
			onConfirm: () => void,
			type: AlertType = "warning",
			confirmText?: string,
			cancelText?: string
		) => {
			setAlertState({
				isOpen: true,
				type,
				title,
				message,
				isConfirm: true,
				onConfirm,
				confirmText,
				cancelText,
			});
		},
		[]
	);

	const closeAlert = () => {
		setAlertState((prev) => ({ ...prev, isOpen: false }));
	};

	return (
		<AlertContext.Provider value={{ showAlert, showConfirm }}>
			{children}
			<AlertModal {...alertState} onClose={closeAlert} />
		</AlertContext.Provider>
	);
};

export const useAlert = () => {
	const context = useContext(AlertContext);

	if (!context) throw new Error("useAlert must be used within an AlertProvider");

	return context;
};
