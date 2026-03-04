import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Library, NotebookIcon, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logoLight from "@/assets/logo-light.svg";
import logoDark from "@/assets/logo-dark.svg";
import { useTheme } from "@/components/ui/theme-provider";
import { useClerk } from "@clerk/clerk-react";

const routes = [
	{ name: "Dashboard", icon: LayoutDashboard, url: "/" },
	{ name: "Library", icon: Library, url: "/library" },
	{ name: "Notes", icon: NotebookIcon, url: "/notes" },
];

export function AppSidebar() {
	const { pathname } = useLocation();
	const { theme } = useTheme();
	const { open } = useSidebar();
	const { openUserProfile } = useClerk();
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="border-b px-4 py-3.5">
				<div className="flex items-center gap-3">
					<a href="/">
						<img
							src={theme === "dark" ? logoDark : logoLight}
							alt="Booky Logo"
							className="h-9 w-8 rounded-lg object-contain"
						/>
					</a>

					<div
						className={`flex flex-col leading-tight ${!open && "hidden"}`}>
						<h4 className="text-lg font-semibold tracking-tight">
							Booky
						</h4>
						<p className="text-xs text-muted-foreground">
							Track your reading
						</p>
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarMenu>
						{routes.map((route) => (
							<SidebarMenuItem key={route.url}>
								<SidebarMenuButton
									asChild
									isActive={pathname === route.url}>
									<Link to={route.url}>
										<route.icon />
										<span className="tracking-wide">
											{route.name}
										</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton onClick={openUserProfile}>
							<Settings />
							<span>Settings</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
