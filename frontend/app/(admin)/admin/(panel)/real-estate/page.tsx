"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import {
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  Copy,
  Flag,
  Edit,
  Home,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { ExpirationDialog } from "./components/expiration-dialog";
import { IRealestateAdminList } from "../../../../../types/Realestate";
import { BulkRejectDialog } from "./components/bulk-reject-dialog";
import { RealestateCard } from "../../../../../components/realestate-card";
import { useQueryStateWithLocalStorage } from "../../../../../hooks/use-query-state-with-local-storage";
import { parseAsString } from "nuqs";
import { BulkActions } from "./components/bulk-actions";

export default function RealEstatePage() {
  const [showBulkRejectDialog, setShowBulkRejectDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showExpirationDialog, setShowExpirationDialog] = useState(false);
  const [selectedListings, setSelectedListings] = useState<
    IRealestateAdminList[]
  >([]);
  const selectedListingsIds = useMemo(() => {
    return selectedListings.map((item) => item.id);
  }, [selectedListings]);

  const currentListings: IRealestateAdminList[] = [];

  const [activeTab, setActiveTab] = useQueryStateWithLocalStorage(
    "/admin/real-estate?tab",
    {
      defaultValue: "all",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    },
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Real Estate Management
          </h1>
          <p className="text-gray-600">
            Review and manage property listings across all military bases
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View Public Listings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>
      </div>

      {selectedListings.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-medium">
                  {selectedListings.length} listing(s) selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedListings([])}
                >
                  Clear Selection
                </Button>
              </div>
              <BulkActions selectedListings={selectedListings} />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            All ({0})
          </TabsTrigger>
          <TabsTrigger value="draft" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Draft ({0})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending ({0})
          </TabsTrigger>
          <TabsTrigger value="reported" className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            Reported ({0})
          </TabsTrigger>
          <TabsTrigger value="expiring" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Expiring ({0})
          </TabsTrigger>
          <TabsTrigger value="duplicates" className="flex items-center gap-2">
            <Copy className="h-4 w-4" />
            Duplicates ({0})
          </TabsTrigger>
        </TabsList>

        {["all", "draft", "pending", "reported", "expiring", "duplicates"].map(
          (status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              {currentListings.length > 0 && (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <Checkbox
                    checked={selectedListings.length === currentListings.length}
                    onCheckedChange={() => {
                      setSelectedListings(currentListings);
                    }}
                  />
                  <Label>Select All ({currentListings.length} listings)</Label>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentListings.map((listing) => (
                  <div key={listing.id} className="relative group">
                    <div className="absolute top-3 left-3 z-20">
                      <Checkbox
                        checked={selectedListingsIds.includes(listing.id)}
                        onCheckedChange={() =>
                          setSelectedListings((state) => [listing, ...state])
                        }
                        className="bg-white/95 border-2 shadow-sm"
                      />
                    </div>

                    <RealestateCard data={listing} showStatusBadges />

                    <div className="absolute bottom-2 right-2 z-30">
                      <button
                        onClick={() => setShowDetailsDialog(true)}
                        className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg border cursor-pointer hover:bg-white transition-colors"
                      >
                        <AlertCircle className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {currentListings.length === 0 && (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="text-center py-8 text-gray-500">
                      <Home className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No listings found for this category</p>
                      <p className="text-sm">
                        Try adjusting your filters or search terms
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          ),
        )}
      </Tabs>

      <ExpirationDialog
        isShow={showExpirationDialog}
        onClose={() => setShowExpirationDialog(false)}
        selectedListings={selectedListings}
      />

      <BulkRejectDialog
        isShow={showBulkRejectDialog}
        onClose={() => setShowBulkRejectDialog(false)}
        selectedListings={selectedListings}
      />
    </div>
  );
}
