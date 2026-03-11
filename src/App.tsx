import AppBar from "@/components/AppComponents/AppBar";
import AppMain from "@/components/AppComponents/AppMain";
import Providers from "@/providers/Providers";

export default function App() {
	return (
		<Providers>
			<AppBar />
			<AppMain />
		</Providers>
	);
}
