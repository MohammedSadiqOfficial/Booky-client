import React from "react";
import { Link } from "react-router-dom";

const Title = ({ title, url, subtitle }) => {
	return (
		<div className="flex items-center justify-between my-4">
			<h3 className="text-2xl font-semibold tracking-tight mb-2">
				{title}
			</h3>
			{url && (
				<Link
					to={url}
					className="text-sm text-blue-600 hover:underline">
					{subtitle}
				</Link>
			)}
		</div>
	);
};

export default Title;
