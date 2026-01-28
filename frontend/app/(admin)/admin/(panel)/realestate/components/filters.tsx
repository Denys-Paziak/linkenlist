"use client";

import { Home, Edit, Clock, Flag, AlertTriangle, Copy } from "lucide-react";
import { TabsList, TabsTrigger } from "../../../../../../components/ui/tabs";
import useSWR from "swr";

export function Filters() {
  const { data } = useSWR<{
    all: number;
    draft: number;
    pending: number;
    expiring: number;
    reported: number;
  }>("/admin/listings/filter-counters", {
    revalidateOnMount: true,
  });

  return (
    <TabsList className="grid w-full grid-cols-6">
      <TabsTrigger value="all" className="flex items-center gap-2">
        <Home className="h-4 w-4" />
        All ({data?.all || 0})
      </TabsTrigger>
      <TabsTrigger value="draft" className="flex items-center gap-2">
        <Edit className="h-4 w-4" />
        Draft ({data?.draft || 0})
      </TabsTrigger>
      <TabsTrigger value="pending" className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Pending ({data?.pending || 0})
      </TabsTrigger>
      <TabsTrigger value="reported" className="flex items-center gap-2">
        <Flag className="h-4 w-4" />
        Reported ({data?.reported || 0})
      </TabsTrigger>
      <TabsTrigger value="expiring" className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        Expiring ({data?.expiring || 0})
      </TabsTrigger>
      <TabsTrigger value="duplicates" className="flex items-center gap-2">
        <Copy className="h-4 w-4" />
        Duplicates ({0})
      </TabsTrigger>
    </TabsList>
  );
}
