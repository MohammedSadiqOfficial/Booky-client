import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EllipsisVertical } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CustomNote = ({
	note,
	action = false,
	deleting = false,
	fnDelete,
	fnEdit,
	setOpen,
}) => {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<span className="text-xs font-medium tracking-wide uppercase text-zinc-500">
						{note.bookName || note?.book?.title}
					</span>

					<div className="flex items-center gap-2">
						<Badge
							variant="outline"
							className="uppercase font-semibold">
							page {note.page}
						</Badge>

						{action && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										disabled={deleting}
										aria-label="Note actions">
										<EllipsisVertical className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent align="end">
									<DropdownMenuGroup>
										<DropdownMenuItem
											onClick={() => fnEdit(note)}>
											Edit
										</DropdownMenuItem>

										<DropdownMenuItem
											onClick={() => fnDelete?.(note.id)}
											disabled={deleting}
											className="text-red-500">
											{deleting
												? "Deleting..."
												: "Delete"}
										</DropdownMenuItem>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				</div>

				<hr />
				<CardTitle className="text-xl">{note.title}</CardTitle>
			</CardHeader>

			<CardContent className="tracking-wide text-[14px] text-zinc-400 line-clamp-4">
				{note.content}
			</CardContent>
		</Card>
	);
};

export default React.memo(CustomNote);
