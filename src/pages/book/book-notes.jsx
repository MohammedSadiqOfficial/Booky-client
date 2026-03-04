import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import api from "@/lib/api";
import useFetch from "@/hooks/use-fetch";
import FullScreenLoader from "@/components/ui/full-screen";
import CustomNote from "@/components/custom-note";
import NoteForm from "@/components/note-form";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/search-context";
import { NotebookPen, ArrowLeft } from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

const LIMIT = 9;

const BookNotes = () => {
    const { id } = useParams();
    const { getToken } = useAuth();
    const { query } = useSearch();
    const search = query?.trim().toLowerCase();

    const [page, setPage] = useState(1);
    const [openModel, setOpenModel] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const fetchNotes = useCallback(async () => {
        const token = await getToken();
        const skip = (page - 1) * LIMIT;
        const response = await api.get(
            `/api/notes/book/${id}?limit=${LIMIT}&skip=${skip}`,
            { headers: { Authorization: `Bearer ${token}` } },
        );
        return response.data;
    }, [getToken, id, page]);

    const fetchBook = useCallback(async () => {
        const token = await getToken();
        const response = await api.get(`/api/books/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    }, [getToken, id]);

    const { data: notesData, loading, error, execute } = useFetch(fetchNotes);
    const { data: bookData, execute: executeBook } = useFetch(fetchBook);

    useEffect(() => {
        executeBook();
    }, []);

    useEffect(() => {
        execute();
    }, [page]);

    const notes = !search
        ? notesData?.notes || []
        : (notesData?.notes || []).filter(
            (note) =>
                note.title?.toLowerCase().includes(search) ||
                note.content?.toLowerCase().includes(search),
        );

    const total = notesData?.count || 0;
    const totalPages = Math.ceil(total / LIMIT);

    const fnDelete = async (noteId) => {
        try {
            setDeletingId(noteId);
            const token = await getToken();
            await api.delete(`/api/notes/${noteId}`, {
                headers: { Authorization: `Bearer ${token}` },
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

    const handleEdit = (note) => {
        setSelectedNote(note);
        setOpenModel(true);
    };

    const handleSave = async (formData) => {
        try {
            setSaving(true);
            const token = await getToken();
            if (formData.id) {
                const { id: noteId, ...updateData } = formData;
                await api.patch(`/api/notes/${noteId}`, updateData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success("Note updated successfully");
            } else {
                await api.post("/api/notes", { ...formData, bookId: id }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success("Note added successfully");
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

    if (loading) return <FullScreenLoader />;
    if (error) return <div>Error loading notes.</div>;

    return (
        <div className="space-y-6">
            {/* Back link */}
            <div className="flex items-center gap-3 flex-wrap">
                <Link
                    to={`/book/${id}`}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to book
                </Link>
            </div>

            {/* Book title */}
            <div className="flex items-center gap-3">
                <div>
                    <h3 className="text-2xl md:text-3xl font-bold">
                        {bookData?.title}
                    </h3>
                    <p className="text-sm text-muted-foreground capitalize">
                        by {bookData?.author}
                    </p>
                </div>
            </div>

            {/* Notes header */}
            <div className="flex items-center gap-2">
                <h4 className="text-xl font-medium">Notes</h4>
                <Badge variant="secondary" className="text-sm px-2">{total}</Badge>
                <button
                    onClick={() => {
                        setSelectedNote(null);
                        setOpenModel(true);
                    }}
                    className="ml-auto text-sm px-4 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    + Add Note
                </button>
            </div>

            {/* Notes grid */}
            {notes.length > 0 ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {notes.map((note) => (
                        <CustomNote
                            key={note.id}
                            note={note}
                            action={true}
                            deleting={deletingId === note.id}
                            fnDelete={fnDelete}
                            fnEdit={handleEdit}
                        />
                    ))}
                </div>
            ) : (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="p-4 rounded-full bg-muted">
                        <NotebookPen size={32} />
                    </div>
                    <h4 className="text-lg font-medium">No notes yet</h4>
                    <p className="text-sm text-muted-foreground max-w-xs">
                        Start adding notes for this book to keep track of your thoughts.
                    </p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                className={page === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <PaginationItem key={p}>
                                <PaginationLink
                                    isActive={page === p}
                                    onClick={() => setPage(p)}
                                >
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}

            <NoteForm
                open={openModel}
                setOpen={setOpenModel}
                initialData={selectedNote || { bookId: id }}
                fnSave={handleSave}
                loading={saving}
            />
        </div>
    );
};

export default BookNotes;


