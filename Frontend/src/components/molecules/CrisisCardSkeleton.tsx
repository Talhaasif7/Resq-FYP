import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const CrisisCardSkeleton: React.FC = () => (
  <div className="glass-card flex items-start gap-3 p-4">
    <Skeleton className="h-11 w-11 rounded-full" />
    <div className="flex-1 space-y-2">
      <div className="flex gap-2">
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-4 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

export default CrisisCardSkeleton;
