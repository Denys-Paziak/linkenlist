"use client";

import { Loader2, Search, X } from "lucide-react";
import { Button } from "../../../../../../../../../../components/ui/button";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { IDealSimple } from "../../../../../../../../../../types/Deal";
import { StatusChip } from "../../../../../../../../../../components/ui/status-chip";
import {
  ButtonSubmitStatus,
  ButtonSubmit,
} from "../../../../../../../../../../components/ui/button-submit";
import { fetcherAdmin } from "../../../../../../../../../../lib/fetcher";
import { useParams } from "next/navigation";
import { useDebounce } from "use-debounce";

export function DealsBrowser({
  closeBrowser,
  selected,
}: {
  closeBrowser: () => void;
  selected: number[];
}) {
  const { id: dealId } = useParams();

  const [search, setSearch] = useState<string>("");
  const [debouncedSearch] = useDebounce(search, 700, {
    leading: true,
  });
  const [page, setPage] = useState<number>(1);

  const [items, setItems] = useState<IDealSimple[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const limit = 40;

  const { data, isValidating } = useSWR<IDealSimple[]>(
    "/admin/deals/simplified" +
      `?limit=${limit}` +
      `&page=${page}` +
      (debouncedSearch ? `&search=${debouncedSearch}` : ""),
    {
      revalidateOnMount: true,
    }
  );

  useEffect(() => {
    if (!data) return;

    if (page === 1) {
      setItems(data);
    } else {
      setItems((prev) => {
        return [...prev, ...data];
      });
    }

    setHasMore(data.length === limit);
  }, [data, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const [selectItems, setSelectItems] = useState<number[]>([]);

  const [statusAdding, setStatusAdding] = useState<ButtonSubmitStatus>("idle");

  const addSelected = async () => {
    setStatusAdding("loading");
    try {
      await fetcherAdmin(`/admin/deals/${dealId}/related-deals`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dealIds: selectItems,
        }),
      });

      mutate(`/admin/deals/${dealId}`).then(() => {
        setSelectItems([]);
        setStatusAdding("success");
      });
    } catch (err: any) {
      setStatusAdding("error");
    }
  };

  useEffect(() => {
    if (statusAdding === "success" || statusAdding === "error") {
      const timer = setTimeout(() => setStatusAdding("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [statusAdding]);

  const filteredData = items.filter(
    (item) =>
      !selected.includes(item.id) && item.id !== Number(dealId || "-1")
  );

  const handleScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const target = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target;

    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;

    if (isNearBottom && !isValidating && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center ">
        <h4 className="font-medium text-gray-900">Select Related Deals</h4>
        <Button variant="ghost" size="sm" onClick={() => closeBrowser()}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search deals..."
            className="flex pl-10 w-full rounded-md border-input border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-[42px] focus-visible:ring-ring"
          />
        </div>
      </div>

      {page === 1 && isValidating ? (
        <Loader2 className="animate-spin w-10 h-10 mx-auto" />
      ) : (
        <div
          className="space-y-2 max-h-60 overflow-y-auto"
          onScroll={handleScroll}
        >
          {filteredData && filteredData.length ? (
            <>
              {filteredData.map((deal) => (
                <div
                  key={deal.id}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={`deal-${deal.id}`}
                      checked={selectItems.includes(deal.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectItems((state) => [...state, deal.id]);
                        } else {
                          setSelectItems((state) =>
                            state.filter((id) => id !== deal.id)
                          );
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <div>
                      <label
                        htmlFor={`deal-${deal.id}`}
                        className="font-medium text-gray-900 cursor-pointer"
                      >
                        {deal.title || "[Not specified]"}
                      </label>
                      <p className="text-sm text-gray-500">
                        {"https://linkenlist.com/deals/" +
                          (deal.slug || "[Not specified]")}
                      </p>
                    </div>
                  </div>
                  <StatusChip text={deal.status} status={deal.status} />
                </div>
              ))}

              {isValidating && page > 1 && (
                <div className="flex justify-center py-2">
                  <Loader2 className="animate-spin w-6 h-6" />
                </div>
              )}

              {!hasMore && filteredData.length > 0 && (
                <div className="text-center text-xs text-gray-400 py-2">
                  No more deals
                </div>
              )}
            </>
          ) : (
            <div>No deals found</div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {selectItems.length} deal
          {selectItems.length !== 1 ? "s" : ""} selected
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectItems([]);
              closeBrowser();
            }}
          >
            Cancel
          </Button>
          <ButtonSubmit
            size="sm"
            onClick={addSelected}
            status={statusAdding}
            statusText={{
              loading: "Adding...",
              success: "Added",
              error: "Try again",
              disabled: "Disabled",
            }}
            disabled={!selectItems.length}
          >
            Add Selected
          </ButtonSubmit>
        </div>
      </div>
    </div>
  );
}
