import * as React from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button, ButtonProps, buttonVariants } from '@/components/ui/button'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

const PaginationContainer = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)
PaginationContainer.displayName = 'PaginationContainer'

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
))
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      'cursor-pointer',
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      className,
    )}
    {...props}
  />
)
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn('gap-1 pl-2.5 cursor-pointer', className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn('gap-1 pr-2.5 cursor-pointer', className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

type PaginationPageSizeProps = {
  value: number
  onChange: (next: number) => void
  options?: number[]
  label?: string
  className?: string
}

const PaginationPageSize = ({
  value,
  onChange,
  options = [10, 20, 50, 100],
  label = 'Rows per page',
  className,
}: PaginationPageSizeProps) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-sm text-muted-foreground">{label}:</span>
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            {value}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={5}
            className={cn(
              'z-50 min-w-[6rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
            )}
          >
            {options.map((opt) => (
              <DropdownMenu.Item
                key={opt}
                onSelect={() => onChange(opt)}
                className={cn(
                  'cursor-pointer select-none rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                  'focus:bg-accent focus:text-accent-foreground',
                  value === opt && 'bg-accent text-accent-foreground',
                )}
              >
                {opt}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  )
}
PaginationPageSize.displayName = 'PaginationPageSize'

function Pagination({
  handlePageChange,
  handleLimitPageChange,
  pagination,
  totalPages,
  pageSizeOptions = [9, 18, 48, 99],
  className
}: {
  handlePageChange: (page: number) => void;
  handleLimitPageChange: (limit: number) => void;
  pagination: {
    page: number;
    limit: number;
  };
  totalPages: number;
  pageSizeOptions?: number[]
  className?: string
}) {
  return (
    <div className={cn("grid grid-cols-3 justify-center", className)}>
      <div></div>
      <PaginationContainer>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
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
        options={pageSizeOptions}
      />
    </div>
  );
}

export {
  Pagination,
  PaginationContainer,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationPageSize
}
