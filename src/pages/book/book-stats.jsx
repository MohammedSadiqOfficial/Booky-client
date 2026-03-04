import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChartColumnBig } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import React from "react";

const BookStats = ({ readPages, totalPages, progress }) => {
  return (
    <Card className="shadow-sm h-full w-full max-w-md">
      <CardHeader className="flex flex-col items-center justify-between space-y-2 pb-2">
        <div className="p-3 rounded-full bg-muted">
          <ChartColumnBig className="w-8 h-8" />
        </div>
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          book stats
        </p>
      </CardHeader>
      <CardContent className="flex flex-col h-full justify-between">
        <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
          current pages
        </span>

        <h5 className="text-3xl font-bold ">{readPages}</h5>
        <hr />
        <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
          total pages
        </span>

        <h5 className="text-3xl font-bold">{totalPages}</h5>
        <hr />
        <div className="flex justify-between mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} />
      </CardContent>
    </Card>
  );
};

export default BookStats;
