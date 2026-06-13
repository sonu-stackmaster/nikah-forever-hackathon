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
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                {columns.map((column) => (
                  <th key={column} className="text-left py-3 px-4 font-medium text-gray-700">
                    {column.replace(/_/g, ' ').toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-pink-50">
                  {columns.map((column) => (
                    <td key={column} className="py-3 px-4 text-gray-600">
                      {formatValue(row[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          Showing {data.length} row{data.length !== 1 ? 's' : ''}
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