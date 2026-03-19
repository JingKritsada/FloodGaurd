import path from "path";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(() => {
	return {
		server: {
			port: 3000,
			host: "0.0.0.0",
			proxy: {
				"/api": {
					// target: "http://localhost:3001",
					target: "http://172.20.10.8:3001",
					// target: "https://uat.sukhothaicare.in.th:3004",
					changeOrigin: true,
				},
			},
		},
		plugins: [react(), tailwindcss(), basicSsl()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
	};
});
