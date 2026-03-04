import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const NoteForm = ({ open, setOpen, initialData, fnSave, loading, inline = false }) => {

	const [formData, setFormData] = useState({
		id: "",
		title: "",
		page: 1,
		content: "",
	});

	useEffect(() => {
		if (open) {
			if (initialData?.id) {
				setFormData({
					id: initialData.id,
					title: initialData.title,
					page: initialData.page,
					content: initialData.content,
					bookId: initialData.bookId,
				});
			} else {
				// reset for add mode, but keep bookId if passed
				setFormData({
					id: "",
					title: "",
					page: 1,
					content: "",
					bookId: initialData?.bookId || ""
				});
			}
		}
	}, [open, initialData]);

	const handleChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		fnSave({
			...formData,
			page: parseInt(formData.page, 10) || 1,
		});
	};

	if (!open && !inline) return null;

	const cardContent = (
		<Card className="w-full border-border bg-card">
			<CardHeader>
				<CardTitle className="text-lg text-foreground">
					{formData.id ? "Edit Note" : "Add Note"}
				</CardTitle>
			</CardHeader>

			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">Title</Label>
						<Input
							id="title"
							name="title"
							placeholder="Enter note title"
							required
							value={formData.title}
							onChange={(e) =>
								handleChange("title", e.target.value)
							}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="page">Page</Label>
						<Input
							id="page"
							name="page"
							type="number"
							min={1}
							placeholder="Enter page number"
							required
							value={formData.page}
							onChange={(e) =>
								handleChange("page", e.target.value)
							}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="content">Content</Label>
						<Textarea
							id="content"
							name="content"
							placeholder="Write your note content..."
							rows={4}
							required
							value={formData.content}
							onChange={(e) =>
								handleChange("content", e.target.value)
							}
						/>
					</div>

					<div className="flex justify-end gap-2 pt-2">
						{!inline && (
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}>
								Cancel
							</Button>
						)}
						<Button type="submit" disabled={loading}>
							{loading ? "Saving..." : "Save Note"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);

	if (inline) return cardContent;

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
			<Card className="w-full max-w-md border-border bg-card">
				<CardHeader>
					<CardTitle className="text-lg text-foreground">
						Add Note
					</CardTitle>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								name="title"
								placeholder="Enter note title"
								required
								value={formData.title}
								onChange={(e) =>
									handleChange("title", e.target.value)
								}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="page">Page</Label>
							<Input
								id="page"
								name="page"
								type="number"
								min={1}
								placeholder="Enter page number"
								required
								value={formData.page}
								onChange={(e) =>
									handleChange("page", e.target.value)
								}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="content">Content</Label>
							<Textarea
								id="content"
								name="content"
								placeholder="Write your note content..."
								rows={4}
								required
								value={formData.content}
								onChange={(e) =>
									handleChange("content", e.target.value)
								}
							/>
						</div>

						<div className="flex justify-end gap-2 pt-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={loading}>
								{loading ? "Saving..." : "Save Note"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default NoteForm;