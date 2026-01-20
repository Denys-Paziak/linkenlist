"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { BasicsForm } from "./components/basics-form/basics-form";
import { ContentForm } from "./components/content-form/content-form";
import { SurfacingForm } from "./components/surfacing-form/surfacing-form";
import { SeoForm } from "./components/seo-form";
import { PublishingForm } from "./components/publishing-form";
import { useQueryState, parseAsString } from "nuqs";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { IResource } from "../../../../../../../types/Resource";
import { SafeLink } from "../../../../components/safe-link";

export default function ResourceEditorPage() {
  const { id: resourceId } = useParams();

  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsString.withDefault("basics")
  );

  useSWR<IResource>(resourceId ? `/admin/resources/${resourceId}` : null, {
    revalidateOnMount: true,
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resource Editor</h1>
          <p className="text-gray-600 mt-1">
            Create and edit educational resources and guides
          </p>
        </div>
        <div className="flex gap-3">
          <SafeLink href={"/admin/resources"}>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Resources
            </Button>
          </SafeLink>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="surfacing">Surfacing</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-6">
          <BasicsForm />
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <ContentForm />
        </TabsContent>

        <TabsContent value="surfacing" className="space-y-6">
          <SurfacingForm />
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <SeoForm />
        </TabsContent>

        <TabsContent value="publishing" className="space-y-6">
          <PublishingForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
