import {
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationPageSize,
  Pagination as PaginationContainer,
} from "../../../../../../../../components/ui/pagination";

export function Pagination({
  handlePageChange,
  handleLimitPageChange,
  pagination,
  totalPages,
}: {
  handlePageChange: (page: number) => void;
  handleLimitPageChange: (limit: number) => void;
  pagination: {
    page: number;
    limit: number;
  };
  totalPages: number;
}) {
  return (
    <div className="grid grid-cols-3 pb-8 px-6 justify-center">
      <div></div>
      <PaginationContainer>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (pagination.page > 1) handlePageChange(pagination.page - 1);
              }}
              className={
                pagination.page <= 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {pagination.page > 3 && (
            <>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(1);
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {pagination.page > 4 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              return (
                page >= Math.max(1, pagination.page - 2) &&
                page <= Math.min(totalPages, pagination.page + 2)
              );
            })
            .map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page);
                  }}
                  isActive={pagination.page === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

          {pagination.page < totalPages - 2 && (
            <>
              {pagination.page < totalPages - 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(totalPages);
                  }}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (pagination.page < totalPages)
                  handlePageChange(pagination.page + 1);
              }}
              className={
                pagination.page >= totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationContainer>
      <PaginationPageSize
        value={pagination.limit}
        onChange={(limit) => handleLimitPageChange(limit)}
        label="Items per page"
        className="justify-self-end"
        options={[9, 18, 48, 99]}
      />
    </div>
  );
}
