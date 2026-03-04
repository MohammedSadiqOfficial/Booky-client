import React, { useEffect, useState } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const BookForm = ({ open, setOpen, onSubmit, initialData, loading }) => {
	const [form, setForm] = useState({
		title: "",
		author: "",
		totalPages: 0,
		readPages: 0,
		status: "TO_READ",
		publishedYear: "",
		id: ""
	});

	const handleChange = (field, value) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	useEffect(() => {
		if (open) {
			if (initialData) {
				setForm({
					title: initialData.title,
					author: initialData.author,
					totalPages: initialData.totalPages,
					readPages: initialData.readPages,
					status: initialData.status,
					publishedYear: initialData.publishedYear || "",
					id: initialData.id,
				});
			} else {
				setForm({
					title: "",
					author: "",
					totalPages: 0,
					readPages: 0,
					status: "TO_READ",
					publishedYear: "",
				});
			}
		}
	}, [open, initialData]);

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit?.({
			...form,
			totalPages: parseInt(form.totalPages, 10) || 1,
			readPages: parseInt(form.readPages, 10) || 0,
			publishedYear: parseInt(form.publishedYear, 10) || null,
		});
		setOpen(false);
	};

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-sm">
			<Card className="w-full max-w-md shadow-xl">
				<CardHeader>
					<CardTitle className="text-2xl">
						{initialData ? "Edit Book" : "Add Book"}
					</CardTitle>
				</CardHeader>

				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label>Title</Label>
							<Input
								placeholder="Book title"
								value={form.title}
								onChange={(e) =>
									handleChange("title", e.target.value)
								}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label>Author</Label>
							<Input
								placeholder="Author name"
								value={form.author}
								onChange={(e) =>
									handleChange("author", e.target.value)
								}
								required
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Total Pages</Label>
								<Input
									type="number"
									placeholder="0"
									value={form.totalPages}
									onChange={(e) =>
										handleChange("totalPages", e.target.value)
									}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label>Read Pages</Label>
								<Input
									type="number"
									placeholder="0"
									value={form.readPages}
									onChange={(e) =>
										handleChange("readPages", e.target.value)
									}
									required
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Published Year</Label>
								<Input
									type="number"
									placeholder="e.g. 2023"
									min={1000}
									max={new Date().getFullYear()}
									value={form.publishedYear}
									onChange={(e) =>
										handleChange("publishedYear", e.target.value)
									}
								/>
							</div>

							<div className="space-y-2">
								<Label>Status</Label>
								<Select
									key={form.status}
									value={form.status}
									onValueChange={(val) =>
										handleChange("status", val)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="TO_READ">
											To Read
										</SelectItem>
										<SelectItem value="IN_PROGRESS">
											In Progress
										</SelectItem>
										<SelectItem value="COMPLETED">
											Completed
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</CardContent>

					<CardFooter className="flex justify-end gap-2">
						<Button
							type="button"
							variant="ghost"
							onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? "Saving..." : "Save Book"}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
};

export default BookForm;