import { AppSidebar } from "@/components/ui/app-sidebar";
import Navbar from "@/components/navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { SearchProvider } from "@/search-context";
import { SignIn, useUser } from "@clerk/clerk-react";
import FullScreenLoader from "@/components/ui/full-screen";

export default function Layout({ children }) {
	const { isLoaded, user } = useUser();
	if (!isLoaded) {
		return (
			<div className="h-screen w-full flex items-center justify-center">
				<FullScreenLoader />
			</div>
		);
	}

	if (!user) {
		return (
			<div className="h-screen w-full flex items-center justify-center">
				<SignIn />
			</div>
		);
	}

	return (
		<>
			<SearchProvider>
				<SidebarProvider>
					<AppSidebar />
					<SidebarInset>
						<Navbar />

						<main className="w-full container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8 lg:py-10">
							<Outlet />
						</main>
					</SidebarInset>
				</SidebarProvider>
			</SearchProvider>
		</>
	);
}
