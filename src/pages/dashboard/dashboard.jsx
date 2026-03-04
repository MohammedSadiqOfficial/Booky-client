import BookCard from "./book-list";
import NoteCard from "./note-list";
import StatsCard from "./stats-list";
import { Button } from "@/components/ui/button";
import FullScreenLoader from "@/components/ui/full-screen";
import useFetch from "@/hooks/use-fetch";
import api from "@/lib/api";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Plus, RefreshCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import BookForm from "../../components/book-form";
import toast from "react-hot-toast";

const Dashboard = () => {
	const [open, setOpen] = useState(false);
	const [saving, setSaving] = useState(false);
	const { user } = useUser();
	const firstName = user?.firstName || "Reader";
	const [refresh, setRefresh] = useState(false);
	const { getToken } = useAuth();

	const fetchStats = async () => {
		try {
			const token = await getToken();
			const response = await api.get("/api/dashboard", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data;
		} catch (error) {
			console.error("Error fetching stats:", error);
		}
	};

	const { data, error, loading, execute } = useFetch(fetchStats);

	useEffect(() => {
		execute();
	}, [refresh]);

	const handleSave = async (formData) => {
		try {
			setSaving(true);
			const token = await getToken();

			await api.post(
				"/api/books",
				{ ...formData },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				},
			);
			toast.success("Book added successfully");
			setOpen(false);
			execute();
		} catch (error) {
			console.log(error?.message);
			toast.error(error?.response?.data?.message || "Failed to add book");
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <FullScreenLoader />;
	if (error) return <div>Error: {error.message}</div>;

	return (
		<div className="space-y-12">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-2xl md:text-3xl font-semibold tracking-wider mb-2">
						Hello {firstName} !
					</h3>
					<p className="text-md text-zinc-400">
						Track your literary journey and upcoming reads.
					</p>
				</div>
				<div className="space-x-3">
					<Button onClick={() => setOpen(true)}>
						<Plus />
						Add Book
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="hidden sm:inline-flex"
						onClick={() => setRefresh(!refresh)}>
						<RefreshCcw />
					</Button>
				</div>
			</div>

			<StatsCard data={data} />
			<hr />
			<BookCard data={data} />
			<hr />
			<NoteCard data={data} />
			<hr />
			<BookForm open={open} setOpen={setOpen} onSubmit={handleSave} loading={saving} />
		</div>
	);
};

export default Dashboard;