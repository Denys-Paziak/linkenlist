"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Comments, CommentsButton } from "./components/comments/comments";
import { Contact, ContactButton } from "./components/contact/contact";

export default function CommsPage() {
  const [activeTab, setActiveTab] = useState("comments");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Comms & Moderation
          </h1>
          <p className="text-gray-600">Manage comments and contact messages</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="comments" className="flex items-center gap-2">
            <CommentsButton />
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <ContactButton />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comments" className="space-y-4">
          <Comments />
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Contact />
        </TabsContent>
      </Tabs>
    </div>
  );
}
