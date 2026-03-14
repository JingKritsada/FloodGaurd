import Providers from "@/providers/Providers";
import AppBar from "@/components/AppComponents/AppBar";
import AppMain from "@/components/AppComponents/AppMain";
import AppNavBar from "@/components/AppComponents/AppNavBar";

export default function App() {
	return (
		<Providers>
			<AppBar />
			<AppMain />
			<AppNavBar />
		</Providers>
	);
}
