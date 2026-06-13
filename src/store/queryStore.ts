'use client'

import { create } from 'zustand'
import { Query } from '@/types/query'
import { queryAPI } from '@/services/queryAPI'

interface QueryStore {
  queries: Query[]
  isLoading: boolean
  error: string | null
  
  submitQuery: (question: string) => Promise<void>
  clearQueries: () => void
  removeQuery: (id: string) => void
}

export const useQueryStore = create<QueryStore>((set, get) => ({
  queries: [],
  isLoading: false,
  error: null,

  submitQuery: async (question: string) => {
    set({ isLoading: true, error: null })
    
    const queryId = Date.now().toString()
    const newQuery: Query = {
      id: queryId,
      question,
      created_at: new Date()
    }
    
    // Add the query immediately
    set(state => ({
      queries: [newQuery, ...state.queries]
    }))

    try {
      const result = await queryAPI.processQuery(question)
      
      // Update the query with results
      set(state => ({
        queries: state.queries.map(q => 
          q.id === queryId 
            ? { ...q, ...result }
            : q
        ),
        isLoading: false
      }))
    } catch (error) {
      // Update query with error
      set(state => ({
        queries: state.queries.map(q => 
          q.id === queryId 
            ? { ...q, error: error instanceof Error ? error.message : 'An error occurred' }
            : q
        ),
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }))
    }
  },

  clearQueries: () => set({ queries: [] }),

  removeQuery: (id: string) => set(state => ({
    queries: state.queries.filter(q => q.id !== id)
  }))
}))