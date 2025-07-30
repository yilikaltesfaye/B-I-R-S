import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./router/index.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { queryClient } from "./lib/apiClient.ts";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<RouterProvider router={router} />
			</AuthProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</StrictMode>
);
