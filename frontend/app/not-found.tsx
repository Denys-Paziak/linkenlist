import { Globe } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F4F4F4] relative flex flex-col">
      <div className="flex items-center justify-center flex-1">
        <div className="text-center">
          <Globe className="h-16 w-16 text-[#222222]/30 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#222222] mb-4">
            Resource Not Found
          </h1>
          <p className="text-[#222222]/70 mb-6">
            The resource you're looking for doesn't exist or has been removed.
          </p>

          <Link
            href="/"
            className="inline-block w-full py-3 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
