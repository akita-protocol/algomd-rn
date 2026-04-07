import React, { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AlgomdContext, type AlgomdContextValue } from './context'
import type { AlgomdConfig } from './types'
import { defaultResolveImageUrl } from './imageResolver'

interface AlgomdProviderProps {
  config: AlgomdConfig
  /** Share cache with consuming app's react-query. If omitted, creates an internal one. */
  queryClient?: QueryClient
  children: React.ReactNode
}

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 2,
    },
  },
})

export function AlgomdProvider({ config, queryClient, children }: AlgomdProviderProps) {
  const contextValue = useMemo<AlgomdContextValue>(() => ({
    config,
    resolveImageUrl: config.resolveImageUrl ?? defaultResolveImageUrl,
  }), [config])

  const content = (
    <AlgomdContext.Provider value={contextValue}>
      {children}
    </AlgomdContext.Provider>
  )

  // If a queryClient is provided (shared), don't wrap with another QueryClientProvider
  if (queryClient) {
    return content
  }

  return (
    <QueryClientProvider client={defaultQueryClient}>
      {content}
    </QueryClientProvider>
  )
}
