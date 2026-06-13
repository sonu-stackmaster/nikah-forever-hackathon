'use client'

import { Sparkles, BarChart3, Users, DollarSign, UserCheck } from 'lucide-react'

interface HeroProps {
  onSelectExample?: (example: string) => void
}

export function Hero({ onSelectExample }: HeroProps) {
  const examples = [
    {
      text: "Show monthly revenue trends",
      desc: "Get total platform sales grouped by month",
      icon: BarChart3,
      color: "text-emerald-500 bg-emerald-50"
    },
    {
      text: "How many active gold plan subscriptions?",
      desc: "Find count of users on active premium plans",
      icon: DollarSign,
      color: "text-amber-500 bg-amber-50"
    },
    {
      text: "Delhi ke verified users list karo",
      desc: "Query location and verification status in Hinglish",
      icon: UserCheck,
      color: "text-blue-500 bg-blue-50"
    },
    {
      text: "Find female users with no profile views",
      desc: "Check user engagement and view statistics",
      icon: Users,
      color: "text-pink-500 bg-pink-50"
    }
  ]

  return (
    <div className="flex flex-col items-center justify-center text-center py-4 max-w-2xl mx-auto h-full">
      {/* Centered Brand Logo */}
      <div className="mb-6 animate-in fade-in zoom-in duration-500">
        <div className="p-4 bg-white/90 rounded-2xl shadow-sm border border-pink-100/80 hover:shadow-md transition-shadow">
          <img 
            src="/logo.png" 
            alt="NikahForever Logo" 
            className="h-10 md:h-12 w-auto object-contain"
          />
        </div>
      </div>
      
      {/* Sleek Header */}
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
        Welcome to QueryGPT
      </h2>
      <p className="text-sm md:text-base text-gray-500 font-medium max-w-lg mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        How can I help you analyze the NikahForever platform database today?
      </p>

      {/* Suggestion Pills Grid (2x2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-3 duration-500">
        {examples.map((example, i) => (
          <button
            key={i}
            onClick={() => onSelectExample?.(example.text)}
            className="group flex items-start space-x-3 text-left p-3.5 bg-white/80 hover:bg-pink-50/40 border border-pink-100/60 hover:border-pink-200 hover:shadow-sm transition-all duration-200 rounded-2xl"
          >
            <div className={`p-2 rounded-xl ${example.color} group-hover:scale-105 transition-transform duration-200`}>
              <example.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-pink-600 transition-colors">
                {example.text}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 truncate font-medium">
                {example.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}