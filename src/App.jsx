import { ThemeProvider } from "./components/ui/theme-provider";
import { Routes, Route } from "react-router-dom";
import { Toaster, useToasterStore, toast } from "react-hot-toast";
import { lazy, Suspense, useEffect } from "react";
import FullScreenLoader from "./components/ui/full-screen";

const Layout = lazy(() => import("./pages/layout"));
const Book = lazy(() => import("./pages/book/book"));
const BookNotes = lazy(() => import("./pages/book/book-notes"));
const Dashboard = lazy(() => import("./pages/dashboard/dashboard"));
const Notes = lazy(() => import("./pages/note/note"));
const Books = lazy(() => import("./pages/book/books"));

function App() {
	const { toasts } = useToasterStore();

	useEffect(() => {
		if (toasts.length > 1) {
			toast.dismiss(toasts[0].id);
		}
	}, [toasts]);

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<Suspense fallback={<FullScreenLoader />}>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<Dashboard />} />
						<Route path="library" element={<Books />} />
						<Route path="notes" element={<Notes />} />
						<Route path="book/:id" element={<Book />} />
						<Route path="book/:id/notes" element={<BookNotes />} />
					</Route>
				</Routes>
			</Suspense>
			<Toaster position="bottom-right" />
		</ThemeProvider>
	);
}

export default App;
