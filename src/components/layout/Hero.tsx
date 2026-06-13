'use client'

import { Sparkles, Database, MessageSquare } from 'lucide-react'

interface HeroProps {
  onSelectExample?: (example: string) => void
}

export function Hero({ onSelectExample }: HeroProps) {
  const examples = [
    "How many active female users joined last month?",
    "Gold plan kitne users ne purchase kiya?",
    "Show monthly revenue trends",
    "How many users name start with letter A"
  ]

  return (
    <div className="text-center py-6 md:py-12">
      <div className="flex justify-center mb-8">
        <div className="p-5 bg-white/90 rounded-3xl shadow-md border border-pink-100/70 hover:shadow-lg transition-all duration-300">
          <img 
            src="/logo.png" 
            alt="NikahForever Logo" 
            className="h-16 w-auto object-contain"
          />
        </div>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 tracking-tight">
        Ask Your Matrimonial Database
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 block md:inline md:ml-2">
          Anything
        </span>
      </h1>
      
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto font-medium">
        Transform natural language into powerful SQL queries. Get instant charts, tables, 
        and insights from your NikahForever database in English, Hindi, or Hinglish.
      </p>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10 text-left">
        <div className="p-5 bg-white/70 rounded-2xl border border-pink-100 shadow-sm">
          <MessageSquare className="h-7 w-7 text-pink-500 mb-3" />
          <h3 className="font-semibold text-gray-800 mb-1">Natural Language</h3>
          <p className="text-gray-500 text-sm">
            Ask questions naturally in English, Hindi, or Hinglish (e.g. "Delhi ke users")
          </p>
        </div>
        
        <div className="p-5 bg-white/70 rounded-2xl border border-pink-100 shadow-sm">
          <Sparkles className="h-7 w-7 text-pink-500 mb-3" />
          <h3 className="font-semibold text-gray-800 mb-1">AI-Powered</h3>
          <p className="text-gray-500 text-sm">
            Advanced neural models translate intent directly to optimized SQLite queries
          </p>
        </div>
        
        <div className="p-5 bg-white/70 rounded-2xl border border-pink-100 shadow-sm">
          <Database className="h-7 w-7 text-pink-500 mb-3" />
          <h3 className="font-semibold text-gray-800 mb-1">Instant Results</h3>
          <p className="text-gray-500 text-sm">
            Interactive charts, metrics, lists, and business recommendations in real-time
          </p>
        </div>
      </div>

      <div className="bg-white/70 rounded-2xl p-6 max-w-2xl mx-auto border border-pink-100 shadow-sm text-left">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-pink-500" />
          Try these examples:
        </h3>
        <div className="grid gap-3">
          {examples.map((example, i) => (
            <button
              key={i}
              onClick={() => onSelectExample?.(example)}
              className="w-full text-left p-3.5 bg-pink-50/50 hover:bg-pink-50 border border-pink-100/40 hover:border-pink-200 transition-all rounded-xl text-gray-700 text-sm font-semibold flex justify-between items-center group"
            >
              <span>"{example}"</span>
              <span className="text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">Ask →</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}