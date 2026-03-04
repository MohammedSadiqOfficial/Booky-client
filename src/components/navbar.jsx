import React, { useContext } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	TooltipProvider,
} from "@/components/ui/tooltip";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { UserButton } from "@clerk/clerk-react";
import { Input } from "./ui/input";
import { useSearch } from "@/search-context";
import ModeToggle from "./ui/mode-toggle";

const Navbar = () => {
	const { toggleSidebar, open } = useSidebar();
	const { query, setQuery } = useSearch();
	return (
		<header className="sticky top-0 z-50 w-full border-b flex items-center justify-end  dark:bg-neutral-900 bg-background  px-6 py-4 mb-10">
			<nav className="w-full flex items-center justify-between">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="lg"
								className="w-10 h-10"
								onClick={toggleSidebar}>
								<Menu />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="right">
							{open ? "Close" : "Open"}
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<div className="flex items-center justify-end gap-4 flex-1">
					<Input
						placeholder="Search..."
						className="max-w-sm"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>

					<ModeToggle className="cursor-pointer" />
					<UserButton />
				</div>
			</nav>
		</header>
	);
};

export default Navbar;
