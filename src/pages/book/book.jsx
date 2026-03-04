import React, { useEffect, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import BookForm from "@/components/book-form";
import toast from "react-hot-toast";
import api from "@/lib/api";
import useFetch from "@/hooks/use-fetch";
import FullScreenLoader from "@/components/ui/full-screen";
import Counter from "./counter";
import BookStats from "./book-stats";
import NoteCard from "../dashboard/note-list";
import NoteForm from "@/components/note-form";

const Book = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [count, setCount] = useState(0);
	const [openEdit, setOpenEdit] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [updating, setUpdating] = useState(false);
	const [savingPages, setSavingPages] = useState(false);
	const [savingNote, setSavingNote] = useState(false);
	const { getToken } = useAuth();

	const fetchBook = async () => {
		const token = await getToken();
		const response = await api.get(`/api/books/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	};

	const { data, loading, error, execute } = useFetch(fetchBook);

	const fetchNotes = async () => {
		const token = await getToken();
		const response = await api.get(`/api/notes/book/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	};

	const { data: notesData, execute: executeNotes } = useFetch(fetchNotes);

	useEffect(() => {
		execute();
		executeNotes();
	}, []);

	useEffect(() => {
		if (data?.readPages !== undefined) {
			setCount(data.readPages);
		}
	}, [data?.readPages]);

	const progress = data
		? Math.round(
			(parseInt(data.readPages) / parseInt(data.totalPages)) * 100,
		)
		: 0;

	const increment = () => setCount((prev) => prev + 1);
	const decrement = () => setCount((prev) => Math.max(0, prev - 1));

	const handleSavePages = async () => {
		try {
			setSavingPages(true);
			const token = await getToken();
			await api.patch(
				`/api/books/${id}`,
				{ readPages: count },
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				},
			);
			toast.success("Progress saved successfully");
			execute();
		} catch (error) {
			console.log(error?.message);
			toast.error(error?.response?.data?.message || "Failed to save pages");
		} finally {
			setSavingPages(false);
		}
	};

	const handleSaveNote = async (formData) => {
		try {
			setSavingNote(true);
			const token = await getToken();
			await api.post(
				"/api/notes",
				{ ...formData, bookId: id },
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				},
			);
			toast.success("Note saved successfully");
			setOpenNote(false);
			executeNotes();
		} catch (error) {
			console.log(error?.message);
			toast.error(error?.response?.data?.message || "Failed to save note");
		} finally {
			setSavingNote(false);
		}
	};

	const handleDelete = async () => {
		try {
			setDeleting(true);
			const token = await getToken();
			await api.delete(
				`/api/books`,
				{
					data: {
						ids: [id],
					},
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			toast.success("Book deleted successfully");
			navigate("/library");
		} catch (error) {
			console.log(error?.message);
			toast.error(error?.response?.data?.message || "Failed to delete book");
		} finally {
			setDeleting(false);
		}
	};

	const handleUpdateBook = async (formData) => {
		try {
			setUpdating(true);
			const token = await getToken();
			const { id: formId, ...updateData } = formData;
			await api.patch(
				`/api/books/${id}`,
				updateData,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				},
			);
			toast.success("Book updated successfully");
			setOpenEdit(false);
			execute();
		} catch (error) {
			console.log(error?.message);
			toast.error(error?.response?.data?.message || "Failed to update book");
		} finally {
			setUpdating(false);
		}
	};

	const markAsCompleted = async () => {
		try {
			const token = await getToken();
			await api.patch(
				`/api/books/${id}`,
				{ status: "COMPLETED", readPages: parseInt(data?.totalPages) || parseInt(count) },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				},
			);
			toast.success("Marked as completed!");
			execute();
		} catch (error) {
			console.log(error?.message);
			toast.error("Failed to update status");
		}
	};

	if (loading) return <FullScreenLoader />;
	if (error) return <div>Error: {error.message}</div>;

	return (
		<div>
			<div className="w-full flex items-start justify-between mb-4">
				<div className="space-y-1">
					<span className="block text-xs uppercase tracking-widest text-muted-foreground">
						Currently Reading
					</span>
					<h3 className="text-3xl md:text-4xl font-bold capitalize">
						{data?.title}
					</h3>
					<p className="text-sm text-muted-foreground capitalize tracking-wide">
						by {data?.author}
					</p>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<EllipsisVertical className="w-5 h-5" />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align="end" className="w-40">
						<DropdownMenuItem onClick={() => setOpenEdit(true)}>
							Edit Book
						</DropdownMenuItem>
						<DropdownMenuItem onClick={markAsCompleted}>
							Mark as Completed
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-red-500" onClick={handleDelete} disabled={deleting}>
							{deleting ? "Deleting..." : "Delete"}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 place-items-center">
				<NoteForm
					inline
					initialData={{ bookId: id }}
					fnSave={handleSaveNote}
					loading={savingNote}
				/>


				<Counter
					count={count}
					increment={increment}
					decrement={decrement}
					onSave={handleSavePages}
					loading={savingPages}
				/>

				<BookStats
					readPages={data?.readPages}
					totalPages={data?.totalPages}
					progress={progress}
				/>
			</div>

			<NoteCard data={notesData} refreshNotes={executeNotes} bookId={id} notesRoute={`/book/${id}/notes`} />
			<BookForm
				open={openEdit}
				setOpen={setOpenEdit}
				initialData={data}
				onSubmit={handleUpdateBook}
				loading={updating}
			/>
		</div>
	);
};

export default Book;
