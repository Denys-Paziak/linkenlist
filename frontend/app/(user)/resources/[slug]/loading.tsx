import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="text-center">
        <Loader2 className="animate-spin w-12 h-12 mx-auto mb-4" />
        <p className="text-muted-foreground">Loading resources details...</p>
      </div>
    </div>
  );
}
