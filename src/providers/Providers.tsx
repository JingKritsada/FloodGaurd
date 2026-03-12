import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "./ThemeContext";
import { AlertProvider } from "./AlertContext";
import { LoadingProvider } from "./LoadingContext";

import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<BrowserRouter>
			<ThemeProvider>
				<AlertProvider>
					<LoadingProvider>
						<AuthProvider>
							<ErrorBoundary>{children}</ErrorBoundary>
						</AuthProvider>
					</LoadingProvider>
				</AlertProvider>
			</ThemeProvider>
		</BrowserRouter>
	);
}
