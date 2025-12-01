import { Suspense } from "react";
import OrganizationManagePage from "./OrganizationManagePage";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

export default function OrganizationManage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <OrganizationManagePage />
    </Suspense>
  )
}