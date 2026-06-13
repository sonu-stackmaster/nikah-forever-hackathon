'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DataTableProps {
  data: any[]
  title?: string
}

export function DataTable({ data, title }: DataTableProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">No data found</p>
        </CardContent>
      </Card>
    )
  }

  const columns = Object.keys(data[0])

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-3">
        <div className="overflow-auto max-h-[400px] border border-pink-100/40 rounded-xl scrollbar-thin scrollbar-thumb-pink-200/60 scrollbar-track-transparent">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-pink-100/50 sticky top-0 z-10">
                {columns.map((column) => (
                  <th key={column} className="text-left py-3 px-4 font-semibold text-xs text-pink-700 bg-pink-50/95 backdrop-blur-sm uppercase tracking-wider">
                    {column.replace(/_/g, ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-pink-50/60 transition-colors">
                  {columns.map((column) => (
                    <td key={column} className="py-2.5 px-4 text-xs md:text-sm text-gray-600 whitespace-nowrap">
                      {formatValue(row[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-3 px-2 text-xs font-semibold text-pink-500 flex items-center justify-between">
          <span>Showing {data.length} record{data.length !== 1 ? 's' : ''}</span>
          <span className="text-gray-400 font-normal">Scroll horizontally/vertically to view all data</span>
        </div>
      </CardContent>
    </Card>
  )
}

function formatValue(value: any): string {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'number') {
    // Format large numbers with commas
    if (value > 1000) {
      return value.toLocaleString()
    }
    return value.toString()
  }
  if (typeof value === 'string') {
    // Format dates
    if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
      return new Date(value).toLocaleDateString()
    }
  }
  return String(value)
}