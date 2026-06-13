'use client'

import { useState, useEffect, useRef } from 'react'
import { QueryInput } from './QueryInput'
import { QueryResponse } from './QueryResponse'
import { Hero } from '@/components/layout/Hero'
import { useQueryStore } from '@/store/queryStore'
import { Trash2, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ChatInterface() {
  const { queries, isLoading, submitQuery, clearQueries } = useQueryStore()
  const [currentQuery, setCurrentQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Chronological order: oldest messages at the top, newest at the bottom
  const chronologicalQueries = [...queries].reverse()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [queries, isLoading])

  const handleSelectExample = async (example: string) => {
    if (!isLoading) {
      await submitQuery(example)
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-130px)] max-w-4xl mx-auto">
      {/* Header controls for active conversation */}
      {queries.length > 0 && (
        <div className="flex justify-between items-center pb-4 border-b border-pink-100/60 mb-6">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-gray-600">Active QueryGPT Session</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearQueries}
            className="text-gray-500 hover:text-red-500 hover:bg-red-50 h-8 flex items-center gap-1.5 rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
            Clear Chat
          </Button>
        </div>
      )}

      {/* Main viewport */}
      <div className="flex-1 space-y-6 pb-28">
        {queries.length === 0 ? (
          <Hero onSelectExample={handleSelectExample} />
        ) : (
          <div className="space-y-8">
            {chronologicalQueries.map((query) => (
              <QueryResponse key={query.id} query={query} />
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex items-start space-x-3 w-full">
            <div className="flex-shrink-0 p-2 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-xl animate-pulse">
              <Brain className="h-5 w-5 text-white animate-bounce" />
            </div>
            <div className="flex-1 bg-white/80 border border-pink-100 rounded-2xl rounded-tl-sm p-5 shadow-sm space-y-3">
              <div className="h-4 bg-pink-100/80 rounded w-1/4 animate-pulse"></div>
              <div className="h-3 bg-pink-50 rounded w-1/2 animate-pulse"></div>
              <div className="h-3 bg-pink-50/50 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed/Sticky Input Box at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-pink-50 via-pink-50/95 to-transparent pt-8 pb-6 px-4 z-40">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-pink-100 shadow-xl p-3">
            <QueryInput 
              value={currentQuery}
              onChange={setCurrentQuery}
            />
          </div>
        </div>
      </div>
    </div>
  )
}