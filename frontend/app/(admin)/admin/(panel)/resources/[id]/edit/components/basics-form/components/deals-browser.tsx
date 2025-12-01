import { Loader2, Search, X } from "lucide-react";
import { Button } from "../../../../../../../../../../components/ui/button";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { StatusChip } from "../../../../../../../../../../components/ui/status-chip";
import { useDebounce } from "use-debounce";
import { IDealSimple } from "../../../../../../../../../../types/Deal";

export function DealsBrowser({
  closeBrowser,
  selected,
  setSelected,
}: {
  closeBrowser: () => void;
  selected: number | null;
  setSelected: (newValue: IDealSimple) => void;
}) {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch] = useDebounce(search, 700, {
    leading: true,
  });
  const [page, setPage] = useState<number>(1);

  const limit = 40;

  const [items, setItems] = useState<IDealSimple[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

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

  const filteredData = items.filter((deal) => deal.id !== selected);

  const handleScroll = (e: any) => {
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
        <h4 className="font-medium text-gray-900">Select Featured Deal</h4>
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
            placeholder="Search deal..."
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
                    <div>
                      <p className="font-medium text-gray-900 cursor-pointer">
                        {deal.title || "[Not specified]"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {"https://linkenlist.com/deals/" +
                          (deal.slug || "[Not specified]")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusChip text={deal.status} status={deal.status} />

                    <Button size="sm" onClick={() => setSelected(deal)}>
                      Select
                    </Button>
                  </div>
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
    </div>
  );
}
