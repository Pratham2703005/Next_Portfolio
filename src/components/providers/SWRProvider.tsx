'use client';

import { ReactNode } from 'react';
import { SWRConfig } from 'swr';

// Global fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    error.message = await res.text();
    throw error;
  }
  return res.json();
};

export default function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        dedupingInterval: 2000,
        errorRetryCount: 3,
        onError: (error, key) => {
          console.error(`SWR Error for ${key}:`, error);
        }
      }}
    >
      {children}
    </SWRConfig>
  );
}