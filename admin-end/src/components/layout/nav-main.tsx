import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

export function NavMain({
	items,
}: {
	items: {
		name: string;
		href: string;
		icon?: React.FC<React.SVGProps<SVGSVGElement>>;
	}[];
}) {
	const location = useLocation();

	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					{items.map((item) => {
						const Icon = item.icon;
						return (
							<SidebarMenuItem key={item.name}>
								<SidebarMenuButton tooltip={item.name}>
									<Link
										to={item.href}
										className={cn(
											"flex items-center gap-4 rounded px-3 py-1 w-full",
											location.pathname === item.href
												? "bg-gray-100 text-gray-900 font-bold"
												: ""
										)}
									>
										{Icon && <Icon />}
										<span>{item.name}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
