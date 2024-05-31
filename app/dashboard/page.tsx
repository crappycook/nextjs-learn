// page.tsx is a special Next.js file that exports a React component, 
// and it's required for the route to be accessible.

// `/app/dashboard/page.tsx` is associated with the `/dashboard` path
// This is how you can create different pages in Next.js: 
// create a new route segment using a folder, and add a page file inside it.
export default function Page() {
    return <p>Dashboard Page</p>;
}