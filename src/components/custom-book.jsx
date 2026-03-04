import React from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

const CustomBook = ({
	book,
	progress,
	lastRead,
	action = false,
	deleting = false,
	fnDelete,
	fnEdit,
}) => {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<Badge variant="secondary" className="uppercase">
						{book?.status?.replace("_", " ")}
					</Badge>

					{action && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									disabled={deleting}>
									<EllipsisVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuContent align="end">
								<DropdownMenuGroup>
									<DropdownMenuItem
										onClick={() => fnEdit?.(book)}>
										Edit
									</DropdownMenuItem>

									<DropdownMenuItem
										onClick={() => fnDelete?.(book.id)}
										disabled={deleting}
										className="text-red-500">
										{deleting ? "Deleting..." : "Delete"}
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
				<hr />
			</CardHeader>

			<Link to={`/book/${book.id}`} className="space-y-4">
				<CardContent className="space-y-4">
					<div>
						<CardTitle className="text-xl line-clamp-2">
							{book.title}
						</CardTitle>

						<CardDescription>{book.author}</CardDescription>
					</div>

					<div>
						<div className="flex justify-between mb-2 text-sm">
							<span>Progress</span>
							<span>{progress}%</span>
						</div>
						<Progress value={progress} />
					</div>
				</CardContent>

				<CardFooter className="text-xs text-muted-foreground text-right">
					Last read {lastRead}
				</CardFooter>
			</Link>
		</Card>
	);
};

export default React.memo(CustomBook);
