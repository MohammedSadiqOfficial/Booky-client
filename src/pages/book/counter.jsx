import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookOpenText, Minus, Plus } from "lucide-react";
import React from "react";

const Counter = ({ count, decrement, increment, onSave, loading }) => {
  return (
    <Card className="shadow-sm h-full w-full max-w-md">
      <CardHeader className="flex flex-col items-center space-y-2 pb-2">
        <div className="p-3 rounded-full bg-muted">
          <BookOpenText className="w-8 h-8" />
        </div>
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          Current Progress
        </p>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-between h-full space-y-4">
        <div>
          <h5 className="flex-1 text-4xl md:text-5xl font-bold text-center">{count}</h5>
          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            Page Tracker
          </span>
        </div>

        <div className="w-full space-y-3 pt-2">
          <Button size="lg" className="w-full flex items-center gap-2" onClick={increment}>
            <Plus className="w-5 h-5" />
            Increment
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full flex items-center gap-2"
            onClick={decrement}
          >
            <Minus className="w-5 h-5" />
            Decrement
          </Button>

          <Button
            className="w-full mt-2"
            variant="secondary"
            onClick={onSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Progress"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Counter;
