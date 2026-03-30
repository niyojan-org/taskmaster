import { Suspense } from "react";
import CreateResourcePage from "./CreateResourcePage";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

export default function CreateResource() {
  return (
    <Suspense fallback={<Skeleton className="h-screen w-full" />}>
      <CreateResourcePage />
    </Suspense>
  );
}
