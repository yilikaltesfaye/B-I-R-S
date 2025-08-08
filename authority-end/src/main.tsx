import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./router/index.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/api";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<RouterProvider router={router} />
				<Toaster position="bottom-right" reverseOrder={true} />
			</AuthProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</StrictMode>
);
