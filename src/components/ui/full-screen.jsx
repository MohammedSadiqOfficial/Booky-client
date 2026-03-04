import { Loader2 } from "lucide-react";

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md">
      <Loader2 className="h-10 w-10 animate-spin text-foreground" />
    </div>
  );
};

export default FullScreenLoader;