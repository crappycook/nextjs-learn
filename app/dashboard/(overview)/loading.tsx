// When you create a new folder using parentheses (), 
// the name won't be included in the URL path. 
// So /dashboard/(overview)/page.tsx becomes /dashboard

// Using a route group to ensure loading.tsx only applies to your dashboard overview page
import DashboardSkeleton from "@/app/ui/skeletons";

// loading.tsx is a special Next.js file built on top of Suspense,
// it allows you to create fallback UI to show as a replacement while page content loads.
export default function Loading() {
  return <DashboardSkeleton />;
}