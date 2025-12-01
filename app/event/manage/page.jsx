import { Suspense } from "react";
import EventManagePage from "./EventManagePage";

export const dynamic = "force-dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventManage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <EventManagePage />
    </Suspense> 
  )
}