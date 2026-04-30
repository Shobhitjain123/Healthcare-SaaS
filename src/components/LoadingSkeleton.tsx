import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton() {
  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm space-y-2">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-1/3" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="hidden md:block">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3">
                <Skeleton className="h-4 w-20" />
              </th>
              <th className="p-3">
                <Skeleton className="h-4 w-16" />
              </th>
              <th className="p-3">
                <Skeleton className="h-4 w-12" />
              </th>
              <th className="p-3">
                <Skeleton className="h-4 w-24" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">
                  <Skeleton className="h-4 w-32" />
                </td>
                <td className="p-3">
                  <Skeleton className="h-4 w-20" />
                </td>
                <td className="p-3">
                  <Skeleton className="h-4 w-16" />
                </td>
                <td className="p-3">
                  <Skeleton className="h-4 w-24" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden divide-y">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function GridSkeleton({ items = 6 }: { items?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: items }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-8 w-24" />
    </div>
  );
}

export function FullPageSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <Skeleton className="h-12 w-64" />
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-8 w-48" />
    </div>
  );
}
