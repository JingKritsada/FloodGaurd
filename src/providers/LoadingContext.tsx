import React, { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { loadingManager } from "@/utils/loading.utils";
import GlobalLoading from "@/components/GlobalLoading";

interface LoadingContextType {
	isLoading: boolean;
	showLoading: () => void;
	hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
	const context = useContext(LoadingContext);

	if (!context) {
		throw new Error("useLoading must be used within a LoadingProvider");
	}

	return context;
};

interface LoadingProviderProps {
	children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
	const [isLoading, setIsLoading] = useState(false);

	// Sync with LoadingManager
	useEffect(() => {
		const unsubscribe = loadingManager.subscribe((loading) => {
			setIsLoading(loading);
		});

		return unsubscribe;
	}, []);

	// Listen for route changes
	const location = useLocation();

	useEffect(() => {
		// Optional: Trigger loading on route change if needed.
		// For now, we rely on data fetching in the new page triggering loading.
		// If instant feedback is needed before data fetch:
		// loadingManager.show();
		// setTimeout(() => loadingManager.hide(), 500); // Artificial delay or wait for page load
	}, [location]);

	const showLoading = () => loadingManager.show();
	const hideLoading = () => loadingManager.hide();

	return (
		<LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
			{isLoading && <GlobalLoading />}
			{children}
		</LoadingContext.Provider>
	);
};
