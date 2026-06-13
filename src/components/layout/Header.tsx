'use client'

import { Brain, BarChart3, History, Settings } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-pink-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo.png" 
              alt="NikahForever Logo" 
              className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="border-l border-pink-200 pl-3">
              <h1 className="text-base font-extrabold text-gray-800 tracking-tight leading-none">QueryGPT</h1>
              <p className="text-[10px] font-bold text-pink-500 uppercase tracking-widest mt-0.5">Analytics</p>
            </div>
          </Link>

          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <Brain className="h-5 w-5" />
              <span>Query GPT</span>
            </Link>
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/history" 
              className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <History className="h-5 w-5" />
              <span>History</span>
            </Link>
            <Link 
              href="/settings" 
              className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}