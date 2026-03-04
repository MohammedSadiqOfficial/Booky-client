import { useState } from "react";

const useFetch =  (fn) => {
	const [data, setData] = useState();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const execute = async (...args) => {
		setLoading(true);
        setError(null);
		try {
			const response = await fn(...args);
			setData(response);
			return data;
		} catch (err) {
            setError(err)
			throw err;
		} finally {
			setLoading(false);
		}
	};
	return { data, loading, error, execute };
};
export default useFetch;
