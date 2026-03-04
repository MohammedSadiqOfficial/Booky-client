import React from "react";
import {
	Card,
	CardContent,
	CardHeader,
} from "@/components/ui/card";
import { CircleCheckBig, BookOpenText, Bookmark,CircleCheck } from "lucide-react";

const styles = {
  TOTAL:
    "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400",

  IN_PROGRESS:
    "text-yellow-600 dark:text-yellow-400 border-yellow-600 dark:border-yellow-400",

  TO_READ:
    "text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-400",
  COMPLETED:
	"text-green-600 dark:text-green-400 border-green-600 dark:border-green-400",
};
const icons = {
	TOTAL: BookOpenText,
	COMPLETED: CircleCheck ,
	IN_PROGRESS: CircleCheckBig,
	TO_READ: Bookmark,
};

const StatsCard = ({data}) => {
	const stats = data?.stats;
	return (
		<div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
			{Object.keys(stats || {}).map((key) => {
				const Icon = icons[key];
				return (
					<Card key={key} className={`gap-2 border-2 border-dashed ${styles[key]}`}>
						<CardHeader className={`font-medium uppercase tracking-wider text-sm text-zinc-400 flex items-center gap-2 ${styles[key]}`}>
								<Icon className="w-6 h-6" />
								{key.replace("_", " ")}
						</CardHeader>
						<CardContent>
							<p className={`text-3xl font-bold ${styles[key]}`}>{stats[key]}</p>
						</CardContent>
					</Card>
				);
			})}
		</div>
        </div>
	);
};

export default StatsCard;
