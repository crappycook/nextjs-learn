'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  console.log(searchParams.toString());

  // This function will wrap the contents of `handleSearch`, 
  // and only run the code after a specific time once the user has stopped typing (300ms)
  const handleSearch = useDebouncedCallback((term: string) => {
    // Client component: print log in Developer Tools.
    // console.log(term);

    // `URLSearchParams` is a Web API that provides utility methods for manipulating the URL query parameters. 
    // Instead of creating a complex string literal, you can use it to get the params string like `?page=1&query=a`.
    const params = new URLSearchParams(searchParams.toString());

    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    // console.log(params.toString());

    // Use `replace` method to update the URL without reloading the page.
    const pathNameAfterSearch = pathname + '?' + params.toString();
    replace(pathNameAfterSearch);
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(event) => handleSearch(event.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
