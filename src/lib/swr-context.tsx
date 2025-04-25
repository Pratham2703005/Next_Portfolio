// lib/swr-context.tsx
'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { SWRConfig } from 'swr'

interface SWRContextProps {
  children: ReactNode
}

// Global fetcher function
const globalFetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.message = await response.text()
    throw error
  }
  return response.json()
}

export const SWRContext = createContext({})

export function SWRProvider({ children }: SWRContextProps) {
  return (
    <SWRConfig
      value={{
        fetcher: globalFetcher,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshInterval: 0,
        errorRetryCount: 3,
        dedupingInterval: 2000, // Deduplicate requests within 2 seconds
        suspense: false,
        onError: (error, key) => {
          console.error(`SWR Error for ${key}:`, error)
        }
      }}
    >
      {children}
    </SWRConfig>
  )
}

// Custom hook for using the SWR context
export function useSWRContext() {
  return useContext(SWRContext)
}