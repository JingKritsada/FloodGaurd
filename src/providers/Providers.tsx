import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "./ThemeContext";
import { AlertProvider } from "./AlertContext";

import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<BrowserRouter>
			<ThemeProvider>
				<AlertProvider>
					<AuthProvider>
						<ErrorBoundary>{children}</ErrorBoundary>
					</AuthProvider>
				</AlertProvider>
			</ThemeProvider>
		</BrowserRouter>
	);
}
