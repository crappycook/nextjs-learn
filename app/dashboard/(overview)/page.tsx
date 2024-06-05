// page.tsx is a special Next.js file that exports a React component, 
// and it's required for the route to be accessible.
import { lusitana } from "@/app/ui/fonts";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { Suspense } from "react";
import { LatestInvoicesSkeleton, RevenueChartSkeleton, CardSkeleton } from "@/app/ui/skeletons";
import CardWrapper from "@/app/ui/dashboard/cards";

// `/app/dashboard/page.tsx` is associated with the `/dashboard` path
// This is how you can create different pages in Next.js: 
// create a new route segment using a folder, and add a page file inside it.
export default async function Page() {
  return (
    <main>
      <h1 className={`mb-4 text-xl md:text-2xl ${lusitana.className}`}>
        Dashboard Page
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* Suspense is used as a boundary between the static and dynamic parts of your route. */}
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}