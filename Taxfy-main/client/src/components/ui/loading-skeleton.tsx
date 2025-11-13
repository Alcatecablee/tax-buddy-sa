import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-100", className)}
      {...props}
    />
  )
}

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'form' | 'results'
  count?: number
}

function LoadingSkeleton({ variant = 'card', count = 1 }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        )
      
      case 'list':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </div>
        )
      
      case 'form':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        )
      
      case 'results':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <Skeleton className="h-16 w-48 mx-auto" />
              <Skeleton className="h-8 w-32 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border rounded-lg space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        )
      
      default:
        return <Skeleton className="h-4 w-full" />
    }
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  )
}

export { Skeleton, LoadingSkeleton } 