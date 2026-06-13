'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb, TrendingUp, AlertCircle, Info } from 'lucide-react'

interface InsightCardProps {
  insights: string[]
}

export function InsightCard({ insights }: InsightCardProps) {
  if (!insights || insights.length === 0) return null

  const getInsightIcon = (insight: string) => {
    if (insight.toLowerCase().includes('increase') || insight.toLowerCase().includes('growth')) {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    }
    if (insight.toLowerCase().includes('decrease') || insight.toLowerCase().includes('decline')) {
      return <AlertCircle className="h-4 w-4 text-red-500" />
    }
    if (insight.toLowerCase().includes('trend') || insight.toLowerCase().includes('pattern')) {
      return <Info className="h-4 w-4 text-blue-500" />
    }
    return <Lightbulb className="h-4 w-4 text-yellow-500" />
  }

  return (
    <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Lightbulb className="h-5 w-5 mr-2 text-pink-600" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg">
              {getInsightIcon(insight)}
              <p className="text-gray-700 text-sm leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}