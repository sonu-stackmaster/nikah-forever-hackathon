'use client'

import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { History, Search } from 'lucide-react'
import { useQueryStore } from '@/store/queryStore'

export default function HistoryPage() {
  const { queries } = useQueryStore()

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Query History</h1>
          <p className="text-gray-600">Review your past natural language queries and database operations</p>
        </div>

        {queries.length === 0 ? (
          <Card className="bg-white/60 backdrop-blur-sm border-pink-100 p-8 text-center">
            <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
              <div className="p-4 bg-pink-100 rounded-full text-pink-600">
                <History className="h-10 w-10" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">No History Yet</h2>
              <p className="text-gray-500 max-w-sm">
                Queries you run in the Query GPT tab will appear here during your session.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {queries.map((q) => (
              <Card key={q.id} className="bg-white border-pink-100 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-gray-800 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-pink-500" />
                      {q.question}
                    </span>
                    <span className="text-xs text-gray-400 font-normal">
                      {new Date(q.created_at).toLocaleTimeString()}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {q.sql && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-pink-50/50">
                      <code className="text-xs text-pink-700 font-mono block overflow-x-auto whitespace-nowrap">
                        {q.sql}
                      </code>
                    </div>
                  )}
                  {q.result?.row_count !== undefined && (
                    <div className="mt-2 text-xs text-gray-500">
                      Returned {q.result.row_count} rows • Executed in {q.execution_time || 0}ms
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
