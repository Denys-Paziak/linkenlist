import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      <div className="flex items-center justify-center flex-1">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Realestate Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The realestate you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/realestate"
            className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Back to All Realestate
          </Link>
        </div>
      </div>
    </div>
  );
}
