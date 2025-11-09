import { ArrowLeft } from "lucide-react";
import { SafeLink } from "../../../../../../../components/admin/safe-link";
import { EditForm } from "./components/update-form";
import { Button } from "../../../../../../../components/ui/button";

interface LinkEditorPageProps {
  params: { id: string };
}

export default function LinkEditorPage({ params }: LinkEditorPageProps) {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Link Editor</h1>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <SafeLink className="flex items-center gap-1" href={"/admin/links"}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Links
            </SafeLink>
          </Button>
        </div>
      </div>
      <EditForm linkId={params.id} />
    </main>
  );
}
