import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearch } from "@/search-context";
import { Badge, NotebookPen } from "lucide-react";
import Title from "@/components/ui/title";
import CustomNote from "@/components/custom-note";
import NoteForm from "@/components/note-form";
import api from "@/lib/api";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const NoteCard = ({ data, refreshNotes, bookId }) => {
  const { query } = useSearch();
  const search = query?.trim().toLowerCase();
  const { getToken } = useAuth();

  const [openModel, setOpenModel] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const notesUrl = bookId ? `/notes?bookId=${bookId}` : "/notes";

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
      refreshNotes?.();
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
      const { id, ...updateData } = formData;
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
      setOpenModel(false);
      refreshNotes?.();
    } catch (error) {
      console.log(error?.message);
      toast.error(error?.response?.data?.message || "Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  const notes = !search
    ? data?.notes || []
    : (data?.notes || []).filter(
      (note) =>
        note.title?.toLowerCase().includes(search) ||
        note.author?.toLowerCase().includes(search) ||
        note.status?.toLowerCase().includes(search),
    );
  return (
    <div>
      <Title title="My Notes" url={notesUrl} subtitle="View all notes" />

      {notes?.length > 0 ? (
        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {notes?.map((note) => (
            <CustomNote
              key={note.id}
              note={note}
              deleting={deletingId === note.id}
              fnDelete={fnDelete}
              fnEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <div className="my-6 sm:my-8 py-6 sm:py-8 w-full flex flex-col items-center justify-center gap-2">
          <div className="p-4 rounded-md bg-neutral-200/80 dark:bg-neutral-700">
            <NotebookPen size={32} />
          </div>
          <h3 className="text-xl font-medium tracking-tight">No notes found</h3>
          <p className="text-center text-base text-zinc-400">
            Try adjusting your search or add new notes to your book collection.
          </p>
        </div>
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

export default NoteCard;
