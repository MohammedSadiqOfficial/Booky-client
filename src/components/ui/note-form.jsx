import useFetch from "@/hooks/use-fetch";
import api from "@/lib/api";
import { useAuth } from "@clerk/clerk-react";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "./label";
import { Input } from "./input";
import { Button } from "./button";
import { Textarea } from "./textarea";

const NoteForm = ({ bookId }) => {
	const { getToken } = useAuth();
	const [formData, setFormData] = useState({
		title: "",
		page: 1,
		content: "",
	});

	const handleChange = (e) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const submitNote = async (e) => {
		e.preventDefault();
		const token = await getToken();
		await api.post(
			"/api/notes",
			{
				...formData,
				bookId,
			},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);

		setFormData({
			title: "",
			page: 1,
			content: "",
		});
	};
	const { loading, error, execute: handleSubmit } = useFetch(submitNote);

	return (
		<Card className="shadow-sm h-full w-full max-w-md">
			<CardHeader>
				<p className="text-sm uppercase tracking-widest text-muted-foreground">
					Create Note
				</p>
			</CardHeader>

			<CardContent>
				<form className="flex flex-col gap-5" onSubmit={handleSubmit}>
					<div className="space-y-2">
						<Label
							htmlFor="title"
							className="text-muted-foreground uppercase font-medium tracking-widest text-xs">
							Title
						</Label>
						<Input
							id="title"
							name="title"
							value={formData.title}
							onChange={handleChange}
							placeholder="Enter title"
						/>
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="page"
							className="text-muted-foreground uppercase font-medium tracking-widest text-xs">
							Page No
						</Label>
						<Input
							id="page"
							name="page"
							type="number"
							value={formData.page}
							onChange={handleChange}
							placeholder="Enter page number"
							min={1}
						/>
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="content"
							className="text-muted-foreground uppercase font-medium tracking-widest text-xs">
							Content
						</Label>
						<Textarea
							id="content"
							name="content"
							value={formData.content}
							onChange={handleChange}
							placeholder="Write your note..."
							className="min-h-[120px] resize-none"
						/>
					</div>

					<Button type="submit" className="w-full" disable={loading}>
						{loading ? "Creating..." : "Create Note"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};

export default NoteForm;
