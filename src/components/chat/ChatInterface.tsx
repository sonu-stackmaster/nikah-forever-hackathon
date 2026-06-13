'use client'

import { useState, useEffect, useRef } from 'react'
import { QueryInput } from './QueryInput'
import { QueryResponse } from './QueryResponse'
import { Hero } from '@/components/layout/Hero'
import { useQueryStore } from '@/store/queryStore'
import { Trash2, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'

function ThinkingLoader() {
  const [statusIndex, setStatusIndex] = useState(0)
  const statuses = [
    "Analyzing search intent...",
    "Understanding database schema...",
    "Formulating SQL query...",
    "Executing database lookup...",
    "Synthesizing platform insights..."
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev < statuses.length - 1 ? prev + 1 : prev))
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-start space-x-3 w-full animate-in fade-in duration-300 pb-4">
      <div className="flex-shrink-0 p-2 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-xl shadow-md animate-pulse">
        <Brain className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1 bg-white/85 backdrop-blur-sm border border-pink-100/80 rounded-2xl rounded-tl-sm p-4 shadow-md flex items-center space-x-4 max-w-sm">
        <div className="relative flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-pink-500"></span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-pink-600 animate-pulse truncate">
            {statuses[statusIndex]}
          </p>
          <p className="text-[10px] text-gray-400 font-semibold mt-0.5 uppercase tracking-wider">
            QueryGPT Thinking...
          </p>
        </div>
      </div>
    </div>
  )
}

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
    <div className="flex flex-col h-full w-full py-6">
      {/* Header controls for active conversation (centered content) */}
      {queries.length > 0 && (
        <div className="flex-shrink-0 w-full max-w-4xl mx-auto px-6 mb-4 animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="flex justify-between items-center pb-4 border-b border-pink-100/60">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-gray-600">Active QueryGPT Session</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearQueries}
              className="text-gray-500 hover:text-red-500 hover:bg-red-50 h-8 flex items-center gap-1.5 rounded-lg transition-colors duration-200"
            >
              <Trash2 className="h-4 w-4" />
              Clear Chat
            </Button>
          </div>
        </div>
      )}

      {/* Main scrollable viewport (Full width for scrollbar placement) */}
      <div className="flex-1 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-pink-200/80 scrollbar-track-transparent">
        <div className="max-w-4xl mx-auto px-6 h-full flex flex-col justify-between">
          {queries.length === 0 ? (
            <div className="py-2 flex-1 flex flex-col justify-center">
              <Hero onSelectExample={handleSelectExample} />
            </div>
          ) : (
            <div className="space-y-8 pb-4">
              {chronologicalQueries.map((query, index) => (
                <QueryResponse 
                  key={query.id} 
                  query={query} 
                  isLatest={index === chronologicalQueries.length - 1}
                />
              ))}
            </div>
          )}

          {isLoading && <ThinkingLoader />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Anchor Input Box at Bottom (centered content) */}
      <div className="flex-shrink-0 w-full max-w-4xl mx-auto px-6 mt-4">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-pink-100 shadow-xl p-3 hover:shadow-2xl transition-shadow duration-300">
          <QueryInput 
            value={currentQuery}
            onChange={setCurrentQuery}
          />
        </div>
      </div>
    </div>
  )
}