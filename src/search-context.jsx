import { createContext, useContext, useState, useMemo } from "react";
import { useDebounce } from "./hooks/use-debounce";

const searchContext = createContext();
export const SearchProvider = ({ children }) => {
	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 300);
	const value = useMemo(() => ({ query, debouncedQuery, setQuery }), [query]);

	return (
		<searchContext.Provider value={value}>
			{children}
		</searchContext.Provider>
	);
};

export const useSearch = () => {
	const context = useContext(searchContext);
	if (!context) {
		throw new Error("useSearch must be used within a SearchProvider");
	}
	return context;
};
