'use client'

import { Brain, BarChart3, History, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: '/', label: 'Query GPT', icon: Brain },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/history', label: 'History', icon: History },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-pink-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo.png" 
              alt="NikahForever Logo" 
              className="h-8 md:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="border-l border-pink-200 pl-3">
              <h1 className="text-sm md:text-base font-extrabold text-gray-800 tracking-tight leading-none">QueryGPT</h1>
              <p className="text-[9px] md:text-[10px] font-bold text-pink-500 uppercase tracking-widest mt-0.5">Analytics</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 md:space-x-2">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 transition-all duration-200 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold ${
                    active
                      ? 'text-pink-600 bg-pink-50 border border-pink-100/50 shadow-sm'
                      : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50/40'
                  }`}
                >
                  <item.icon className={`h-4 w-4 ${active ? 'text-pink-600' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </header>
  )
}