import React from "react";
import { formatDistanceToNow } from "date-fns";
import { useSearch } from "@/search-context";
import { Book } from "lucide-react";
import CustomBook from "@/components/custom-book";
import Title from "@/components/ui/title";

const BookCard = ({ data }) => {
  const { query } = useSearch();
  const search = query?.trim().toLowerCase();

  const books = !search
    ? data?.books || []
    : (data?.books || []).filter(
      (book) =>
        book.title?.toLowerCase().includes(search) ||
        book.author?.toLowerCase().includes(search) ||
        book.status?.toLowerCase().includes(search),
    );

  return (
    <div>
      <Title title="Currently Reading" url="/library" subtitle="View all books" />
      {books?.length > 0 ? (
        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {books.map((book) => {
            const progress = Math.round(
              (parseInt(book.readPages) / parseInt(book.totalPages)) * 100,
            );
            const lastRead = formatDistanceToNow(new Date(book.updatedAt), {
              addSuffix: true,
            });

            return (
              <CustomBook
                key={book.id}
                book={book}
                progress={progress}
                lastRead={lastRead}
              />
            );
          })}
        </div>
      ) : (
        <div className="my-6 sm:my-8 py-6 sm:py-8 w-full flex flex-col items-center justify-center gap-2">
          <div className="p-4 rounded-md bg-neutral-200/80 dark:bg-neutral-700">
            <Book size={32} />
          </div>
          <h3 className="text-xl font-medium tracking-tight">No books found</h3>
          <p className="text-center text-zinc-400 text-base">
            Try adjusting your search or add new books to your collection.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookCard;
