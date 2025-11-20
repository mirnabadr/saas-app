"use client";

import React, { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';
import Image from 'next/image';
import {  formUrlQuery, removeKeysFromUrlQuery } from '@jsmastery/utils'; 



const SearchInput = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams().get('topic') || '';
    const [searchQuery, setSearchQuery] = useState(searchParams);
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
        if(searchQuery ) {
            const newUrl = formUrlQuery({ 
                params: searchParams.toString(),
                key: 'topic',
                value: searchQuery,
            });
            router.push(newUrl, { scroll: false });
        }
        else {
            if (pathname === '/companions') {
                const newUrl = removeKeysFromUrlQuery({
                    params: searchParams.toString(),
                    keysToRemove: ['topic'],
                });
                router.push(newUrl, { scroll: false });
            }
        }
    }, 300);
    }, [searchParams, router, searchQuery, pathname]);
  return (
    <div className='relative border border-black rounded-md items-center flex gap-2 px-3 py-2 h-9 w-full'>
      <Image
        src="/icons/search.svg"
        alt="search"
        width={15}
        height={15}
      />
      <Input
        placeholder='Search by topic..'
        className='outline-none border-0 shadow-none focus:border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-0 ring-0 text-sm h-auto p-0'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  )
}

export default SearchInput
