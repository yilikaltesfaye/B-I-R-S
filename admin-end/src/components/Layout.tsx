import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

export const Layout: React.FC = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};
	React.useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, [user, navigate]);

	// While waiting for the redirect, or if user is null, render nothing
	if (!user) return <h1>No user detected</h1>;

	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" handleLogout={handleLogout} user={user} />
			<SidebarInset>
				<SiteHeader user={user} />
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
};
