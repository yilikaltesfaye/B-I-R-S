import * as React from "react";

import { Users, Building2, Tags, FileText } from "lucide-react";

import { NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { User } from "@/types";

const navigation = [
	{ name: "Dashboard", href: "/", icon: Building2 },
	{ name: "Users", href: "/users", icon: Users },
	{
		name: "Authorities",
		href: "/authorities",
		icon: Building2,
	},
	{ name: "Categories", href: "/categories", icon: Tags },
	{ name: "Reports", href: "/reports", icon: FileText },
];

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
	user: User; // or whatever your `user` shape is
	handleLogout: () => void;
};

export function AppSidebar({
	user,
	handleLogout,
	...sidebarProps
}: AppSidebarProps) {
	return (
		<Sidebar collapsible="offcanvas" {...sidebarProps}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<a href="#">
								<span className="text-base font-semibold">BIRS ADMIN</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navigation} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} handleLogout={handleLogout} />
			</SidebarFooter>
		</Sidebar>
	);
}
