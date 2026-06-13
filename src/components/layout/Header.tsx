'use client'

import { Brain, BarChart3, History, Settings } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-pink-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">QueryGPT</h1>
              <p className="text-sm text-gray-600">NikahForever Analytics</p>
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