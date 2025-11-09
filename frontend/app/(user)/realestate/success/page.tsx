"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ListingSuccessPage() {
  const router = useRouter();

  const handleGoToMyRealEstate = () => {
    router.push("/profile/realestate");
  };

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Thanks for adding your property to LinkEnlist!
              </h1>
            </div>

            <div className="text-gray-600 mb-8 space-y-4">
              <p>
                Our team will review your listing before it goes live. You can
                track its status under Profile → My Real Estate.
              </p>
              <p>
                <strong>Please note:</strong> your property's address can only
                be updated in the first 24 hours, but you can edit photos,
                descriptions, and other details anytime.
              </p>
            </div>

            <Button
              onClick={handleGoToMyRealEstate}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 mx-auto"
            >
              Go to My Real Estate
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
