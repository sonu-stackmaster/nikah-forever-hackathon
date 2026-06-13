'use client'

import { Button } from '@/components/ui/button'
import { Code, Copy, Eye, Brain, Check, Terminal } from 'lucide-react'
import { useState, useEffect } from 'react'
import { DataTable } from '@/components/results/DataTable'
import { ChartRenderer } from '@/components/results/ChartRenderer'
import { KPICard } from '@/components/results/KPICard'
import { InsightCard } from '@/components/results/InsightCard'
import { Query } from '@/types/query'

// Typewriter component to handle streaming-like text animation
interface TypewriterProps {
  text: string
  speed?: number
  onComplete?: () => void
}

function Typewriter({ text, speed = 10, onComplete }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!text) {
      onComplete?.()
      return
    }

    setDisplayedText('')
    setIsComplete(false)

    let index = 0
    let currentText = ''
    const interval = setInterval(() => {
      const char = text.charAt(index)
      currentText += char
      setDisplayedText(currentText)
      index++
      if (index >= text.length) {
        clearInterval(interval)
        setIsComplete(true)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <span 
      onClick={() => {
        setDisplayedText(text)
        setIsComplete(true)
        onComplete?.()
      }}
      className={!isComplete ? 'cursor-pointer hover:text-pink-600 transition-colors duration-200' : ''}
      title={!isComplete ? "Click to skip typing animation" : undefined}
    >
      {displayedText}
      {!isComplete && (
        <span className="inline-block w-1.5 h-4 bg-pink-500 ml-1 animate-pulse align-middle" />
      )}
    </span>
  )
}

interface QueryResponseProps {
  query: Query
  isLatest: boolean
}

export function QueryResponse({ query, isLatest }: QueryResponseProps) {
  const [showSQL, setShowSQL] = useState(false)
  const [copied, setCopied] = useState(false)
  // Auto-complete typing immediately if it's an older message in history
  const [typingComplete, setTypingComplete] = useState(!isLatest)

  const copySQL = () => {
    navigator.clipboard.writeText(query.sql || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderVisualization = () => {
    if (!query.result?.data) return null

    switch (query.result.visualization_type) {
      case 'kpi':
        return (
          <div className="my-4 max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
            <KPICard data={query.result.data} />
          </div>
        )
      case 'table':
        return (
          <div className="my-4 overflow-hidden rounded-xl border border-pink-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
            <DataTable data={query.result.data} />
          </div>
        )
      case 'chart':
        return (
          <div className="my-4 p-4 bg-white rounded-xl border border-pink-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
            <ChartRenderer 
              data={query.result.data} 
              chartType={query.result.chart_config?.type || 'bar'}
              config={query.result.chart_config}
            />
          </div>
        )
      default:
        return null
    }
  }

  const hasData = query.result?.data && query.result.data.length > 0
  const isChatOnly = query.result?.visualization_type === 'chat'

  // Get primary text content
  const mainText = query.result?.message || 
                   (query.result?.insights && query.result.insights[0]) || 
                   (query.error ? "I encountered an error trying to process that." : "Here is what I found in the database:")

  return (
    <div className="flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* User Bubble */}
      <div className="flex justify-end w-full">
        <div className="max-w-[75%] bg-gradient-to-r from-pink-500 to-rose-500 text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-md hover:shadow-lg transition-shadow duration-300">
          <p className="text-sm md:text-base font-semibold leading-relaxed whitespace-pre-wrap">
            {query.question}
          </p>
        </div>
      </div>

      {/* Assistant Bubble */}
      <div className="flex items-start space-x-3 w-full">
        {/* Avatar */}
        <div className="flex-shrink-0 p-2 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-xl shadow-md hover:scale-105 transition-transform duration-300">
          <Brain className="h-5 w-5 text-white" />
        </div>

        {/* Response Body */}
        <div className="flex-1 bg-white/80 backdrop-blur-sm border border-pink-100 rounded-2xl rounded-tl-sm p-5 shadow-sm max-w-full overflow-hidden hover:border-pink-200 hover:shadow-md transition-all duration-300">
          {/* Main Conversational Response */}
          <div className="prose prose-pink max-w-none">
            <p className="text-gray-800 text-sm md:text-base leading-relaxed font-semibold">
              {isLatest ? (
                <Typewriter 
                  text={mainText} 
                  speed={8} 
                  onComplete={() => setTypingComplete(true)} 
                />
              ) : (
                <span>{mainText}</span>
              )}
            </p>
          </div>

          {/* Fade-in block for SQL, charts, and insights */}
          <div 
            className={`transition-all duration-700 ease-out transform ${
              typingComplete 
                ? 'opacity-100 translate-y-0 max-h-[3000px] mt-4 pt-4 border-t border-pink-50' 
                : 'opacity-0 translate-y-4 max-h-0 overflow-hidden pointer-events-none'
            }`}
          >
            {/* Database details and SQL toolbar */}
            {!isChatOnly && query.sql && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSQL(!showSQL)}
                      className="h-8 border-pink-100 hover:bg-pink-50 hover:text-pink-600 text-gray-600 flex items-center gap-1.5 rounded-lg transition-all"
                    >
                      <Terminal className="h-3.5 w-3.5" />
                      {showSQL ? 'Hide SQL' : 'Show SQL'}
                    </Button>
                    {showSQL && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copySQL}
                        className="h-8 hover:bg-pink-50 hover:text-pink-600 text-gray-500 flex items-center gap-1 rounded-lg transition-all"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-green-500 animate-in zoom-in-50" />
                            <span className="text-green-600 font-medium">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy SQL</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {query.execution_time && (
                    <span className="flex items-center text-gray-400 font-medium">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Executed in {query.execution_time}ms
                    </span>
                  )}
                </div>

                {/* SQL Code Block */}
                {showSQL && (
                  <div className="relative rounded-lg overflow-hidden border border-pink-100/60 bg-gray-900 text-gray-100 font-mono text-xs md:text-sm p-4 shadow-inner animate-in slide-in-from-top-2 duration-300">
                    <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      <code>{query.sql}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Visualization (Charts/Tables/KPIs) */}
            {hasData && renderVisualization()}

            {/* AI Insights block */}
            {!isChatOnly && query.result?.insights && query.result.insights.length > 0 && (
              <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <InsightCard insights={query.result.insights} />
              </div>
            )}

            {/* Error Display */}
            {query.error && (
              <div className="mt-4 bg-red-50 border border-red-100 p-4 rounded-xl flex items-start space-x-3 animate-in shake duration-300">
                <div className="flex-shrink-0 text-red-500 font-bold">⚠</div>
                <p className="text-red-700 text-sm font-semibold leading-relaxed">
                  {query.error}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}