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
import CustomBook from "@/components/custom-book";
import { useSearch } from "@/search-context";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import BookForm from "@/components/book-form";
import toast from "react-hot-toast";

const Books = () => {
	const [page, setPage] = useState(1);
	const [openModel, setOpenModel] = useState(false);
	const [deletingId, setDeletingId] = useState(null);
	const [selectedBook, setSelectedBook] = useState(null);
	const [saving, setSaving] = useState(false);

	const limit = 10;
	const { query } = useSearch();
	const search = query?.trim().toLowerCase();
	const { getToken } = useAuth();

	const fetchBooks = useCallback(async () => {
		const token = await getToken();

		const response = await api.get(
			`/api/books?limit=${limit}&page=${page}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);

		return response.data;
	}, [getToken, page]);

	const { data, loading, error, execute } = useFetch(fetchBooks);

	useEffect(() => {
		execute();
	}, [page]);
	const books = !search
		? data?.books || []
		: (data?.books || []).filter(
			(book) =>
				book.title?.toLowerCase().includes(search) ||
				book.author?.toLowerCase().includes(search),
		);

	const fnDelete = async (id) => {
		try {
			setDeletingId(id);
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
			execute();
		} catch (error) {
			console.log(error?.message);
			toast.error(error?.response?.data?.message || "Failed to delete book");
		} finally {
			setDeletingId(null);
		}
	};

	const handleEdit = (book) => {
		setSelectedBook(book);
		setOpenModel(true);
	};

	const handleSave = async (formData) => {
		try {
			setSaving(true);
			const token = await getToken();

			if (formData.id) {
				const { id, ...updateData } = formData;
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
			} else {
				await api.post(
					`/api/books`,
					{ ...formData },
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					},
				);
				toast.success("Book created successfully");
			}

			setOpenModel(false);
			execute();
		} catch (error) {
			console.log(error?.message);
			toast.error(error?.response?.data?.message || "Failed to save book");
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <FullScreenLoader />;
	if (error) return <p>Error loading books</p>;

	const total = data?.count || 0;
	const totalPages = Math.ceil(total / limit);

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2">
				<h3 className="text-2xl md:text-3xl font-medium">
					Book Collection
				</h3>
				<Badge variant="secondary" className="text-sm font-medium px-2">
					{total}
				</Badge>
			</div>

			<div className="grid grid-cols-3 gap-4">
				{books.map((book) => {
					const progress = Math.round(
						(parseInt(book.readPages) / parseInt(book.totalPages)) *
						100,
					);

					const lastRead = formatDistanceToNow(
						new Date(book.updatedAt),
						{ addSuffix: true },
					);
					return (
						<CustomBook
							key={book.id}
							book={book}
							progress={progress}
							lastRead={lastRead}
							action
							fnDelete={fnDelete}
							deleting={deletingId === book.id}
							fnEdit={handleEdit}
							initialData={selectedBook}
						/>
					);
				})}
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

			<BookForm
				open={openModel}
				setOpen={setOpenModel}
				initialData={selectedBook}
				onSubmit={handleSave}
				loading={saving}
			/>
		</div>
	);
};

export default Books;
