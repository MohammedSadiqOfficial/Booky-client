import React, { useCallback, useEffect, useState } from "react";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { useAuth } from "@clerk/clerk-react";
import api from "@/lib/api";
import useFetch from "@/hooks/use-fetch";
import FullScreenLoader from "@/components/ui/full-screen";
import CustomNote from "@/components/custom-note";
import { useSearch } from "@/search-context";
import NoteForm from "../../components/note-form";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { useSearchParams, Link } from "react-router-dom";

const Notes = () => {
	const [page, setPage] = useState(1);
	const [openModel, setOpenModel] = useState(false);
	const [deletingId, setDeletingId] = useState(null);
	const [selectedNote, setSelectedNote] = useState(null);
	const [saving, setSaving] = useState(false);
	const { getToken } = useAuth();
	const limit = 10;
	const { query } = useSearch();
	const search = query?.trim().toLowerCase();
	const [searchParams] = useSearchParams();
	const bookId = searchParams.get("bookId");

	const fetchNotes = useCallback(async () => {
		const token = await getToken();
		const params = new URLSearchParams({ limit, page });
		if (bookId) params.set("bookId", bookId);

		let endpoint;
		if (bookId) {
			endpoint = `/api/notes/book/${bookId}?${params.toString()}`;
		} else {
			endpoint = `/api/notes?${params.toString()}`;
		}
		const response = await api.get(
			endpoint,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);

		return response.data;
	}, [getToken, page, bookId]);

	const { data, loading, error, execute } = useFetch(fetchNotes);
	const notes = !search
		? data?.notes || []
		: (data?.notes || []).filter(
			(note) =>
				note.title?.toLowerCase().includes(search) ||
				note.bookName?.toLowerCase().includes(search),
		);

	const fnDelete = async (id) => {
		try {
			setDeletingId(id);
			const token = await getToken();
			await api.delete(`/api/notes/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			toast.success("Note deleted successfully");
			execute();
		} catch (error) {
			console.log(error?.message);
			toast.error(error?.response?.data?.message || "Failed to delete note");
		} finally {
			setDeletingId(null);
		}
	};

	useEffect(() => {
		execute();
	}, [page]); // page triggers refetch

	if (loading) return <FullScreenLoader />;
	if (error) return <p>Error loading notes</p>;

	const total = data?.count || 0;
	const totalPages = Math.ceil(total / limit);

	const handleEdit = (note) => {
		setSelectedNote(note);
		setOpenModel(true);
	};

	const handleSave = async (data) => {
		try {
			setSaving(true);
			const token = await getToken();

			if (data.id) {
				const { id, ...updateData } = data;
				await api.patch(
					`/api/notes/${id}`,
					updateData,
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					},
				);
				toast.success("Note updated successfully");
			} else {
				await api.post(
					`/api/notes`,
					{
						...data,
					},
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					},
				);
				toast.success("Note created successfully");
			}
			setOpenModel(false);
			execute();
		} catch (error) {
			console.log(error?.message);
			toast.error(error?.response?.data?.message || "Failed to save note");
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2 flex-wrap">
				<h3 className="text-2xl md:text-3xl font-medium">
					Notes Collection
				</h3>
				<Badge variant="secondary" className="text-sm font-medium px-2">
					{total}
				</Badge>
				{bookId && (
					<div className="flex items-center gap-2 ml-auto">
						<span className="text-sm text-muted-foreground">Filtered by book</span>
						<a
							href="/notes"
							className="text-sm underline text-primary hover:opacity-80"
						>
							Clear filter
						</a>
					</div>
				)}
			</div>

			<div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 ">
				{data &&
					notes.map((note) => (
						<CustomNote
							key={note.id}
							note={note}
							action={true}
							fnDelete={fnDelete}
							deleting={deletingId === note.id}
							setOpen={setOpenModel}
							fnEdit={handleEdit}
							initialData={selectedNote}
						/>
					))}
			</div>

			{totalPages > 1 && (
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() =>
									setPage((prev) => Math.max(prev - 1, 1))
								}
								className={
									page === 1
										? "pointer-events-none opacity-50"
										: ""
								}
							/>
						</PaginationItem>

						{Array.from(
							{ length: totalPages },
							(_, i) => i + 1,
						).map((p) => (
							<PaginationItem key={p}>
								<PaginationLink
									isActive={page === p}
									onClick={() => setPage(p)}>
									{p}
								</PaginationLink>
							</PaginationItem>
						))}

						<PaginationItem>
							<PaginationNext
								onClick={() =>
									setPage((prev) =>
										Math.min(prev + 1, totalPages),
									)
								}
								className={
									page === totalPages
										? "pointer-events-none opacity-50"
										: ""
								}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
			<NoteForm
				open={openModel}
				setOpen={setOpenModel}
				initialData={selectedNote}
				fnSave={handleSave}
				loading={saving}
			/>
		</div>
	);
};

export default Notes;
