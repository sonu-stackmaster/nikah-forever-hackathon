'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KPICardProps {
  data: any[]
  title?: string
}

export function KPICard({ data, title }: KPICardProps) {
  if (!data || data.length === 0) return null

  // Handle single value KPI
  if (data.length === 1 && Object.keys(data[0]).length === 1) {
    const value = Object.values(data[0])[0] as number
    const label = title || Object.keys(data[0])[0]

    return (
      <Card className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {formatKPIValue(value)}
            </div>
            <div className="text-sm opacity-90">
              {formatKPILabel(label)}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Handle multiple KPIs
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item, index) => {
        const entries = Object.entries(item)
        if (entries.length !== 2) return null
        
        const [labelKey, valueKey] = entries
        const label = labelKey[1] as string
        const value = valueKey[1] as number

        return (
          <Card key={index} className="bg-white border-pink-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {formatKPIValue(value)}
              </div>
              <div className="text-sm text-gray-600">
                {formatKPILabel(label)}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function formatKPIValue(value: any): string {
  if (value === null || value === undefined) {
    return '0'
  }
  if (typeof value !== 'number') {
    const num = parseFloat(value)
    if (isNaN(num)) return String(value)
    value = num
  }
  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(1)}Cr`
  }
  if (value >= 100000) {
    return `${(value / 100000).toFixed(1)}L`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toLocaleString()
}

function formatKPILabel(label: string): string {
  return label
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}