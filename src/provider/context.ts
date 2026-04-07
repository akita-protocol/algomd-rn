import { createContext, useContext } from 'react'
import type { AlgomdConfig } from './types'
import { defaultResolveImageUrl } from './imageResolver'

export interface AlgomdContextValue {
  config: AlgomdConfig
  resolveImageUrl: (src: string, width: number, quality?: number) => string
}

export const AlgomdContext = createContext<AlgomdContextValue | null>(null)

export function useAlgomd(): AlgomdContextValue {
  const ctx = useContext(AlgomdContext)
  if (!ctx) {
    throw new Error('useAlgomd must be used within an <AlgomdProvider>')
  }
  return ctx
}
