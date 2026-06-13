'use client'

import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Dynamically import ECharts to avoid SSR issues
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false })

interface ChartRendererProps {
  data: any[]
  chartType: 'bar' | 'line' | 'pie' | 'area'
  config?: any
  title?: string
}

export function ChartRenderer({ data, chartType, config, title }: ChartRendererProps) {
  if (!data || data.length === 0) return null

  // Smartly find the best columns for X and Y axes
  const findChartKeys = () => {
    const columns = Object.keys(data[0])
    
    const metricKeywords = [
      'amount', 'income', 'revenue', 'price', 'completeness', 'count', 
      'total', 'sum', 'score', 'height', 'weight', 'age', 'value', 'credits'
    ]

    const categoryKeywords = [
      'name', 'title', 'city', 'state', 'plan', 'month', 'date', 'day', 'year', 
      'gender', 'sect', 'tongue', 'profession', 'status', 'created'
    ]

    let yAxisKey = ''
    let xAxisKey = ''

    // 1. Find the best Y-axis (must be numeric, prioritize matching metricKeywords)
    const numericColumns = columns.filter(col => {
      const colLower = col.toLowerCase()
      if (colLower.includes('id') || colLower.includes('phone') || colLower.includes('mobile')) {
        return false
      }
      return data.slice(0, 3).every(row => {
        const val = row[col]
        return val !== null && val !== undefined && !isNaN(Number(val))
      })
    })

    if (numericColumns.length > 0) {
      const sortedMetrics = [...numericColumns].sort((a, b) => {
        const aMatch = metricKeywords.some(kw => a.toLowerCase().includes(kw))
        const bMatch = metricKeywords.some(kw => b.toLowerCase().includes(kw))
        if (aMatch && !bMatch) return -1
        if (!aMatch && bMatch) return 1
        return 0
      })
      yAxisKey = sortedMetrics[0]
    }

    // 2. Find the best X-axis (must be categorical/date/string, prioritize categoryKeywords)
    const nonNumericColumns = columns.filter(col => col !== yAxisKey)
    if (nonNumericColumns.length > 0) {
      const sortedCategories = [...nonNumericColumns].sort((a, b) => {
        const aMatch = categoryKeywords.some(kw => a.toLowerCase().includes(kw))
        const bMatch = categoryKeywords.some(kw => b.toLowerCase().includes(kw))
        if (aMatch && !bMatch) return -1
        if (!aMatch && bMatch) return 1
        
        // Push long columns (like bio or email) to the end
        const aLong = a.toLowerCase().includes('bio') || a.toLowerCase().includes('email')
        const bLong = b.toLowerCase().includes('bio') || b.toLowerCase().includes('email')
        if (aLong && !bLong) return 1
        if (!aLong && bLong) return -1
        return 0
      })
      xAxisKey = sortedCategories[0]
    }

    // Fallbacks
    if (!xAxisKey) xAxisKey = columns[0]
    if (!yAxisKey) yAxisKey = columns[1] || columns[0]

    return { xAxisKey, yAxisKey }
  }

  const { xAxisKey, yAxisKey } = findChartKeys()

  const getChartOption = () => {

    const baseOption = {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#ec4899',
        borderWidth: 1,
        textStyle: {
          color: '#374151'
        }
      },
      color: ['#ec4899', '#f43f5e', '#be185d', '#9d174d']
    }

    switch (chartType) {
      case 'pie':
        return {
          ...baseOption,
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          series: [{
            name: title || 'Data',
            type: 'pie',
            radius: '70%',
            center: ['50%', '50%'],
            data: data.map(item => ({
              value: item[yAxisKey],
              name: item[xAxisKey]
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        }

      case 'line':
      case 'area':
        return {
          ...baseOption,
          xAxis: {
            type: 'category',
            data: data.map(item => item[xAxisKey]),
            axisLine: {
              lineStyle: { color: '#d1d5db' }
            },
            axisLabel: {
              color: '#6b7280'
            }
          },
          yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: { color: '#d1d5db' }
            },
            axisLabel: {
              color: '#6b7280'
            },
            splitLine: {
              lineStyle: { color: '#f3f4f6' }
            }
          },
          series: [{
            name: yAxisKey,
            type: 'line',
            smooth: true,
            areaStyle: chartType === 'area' ? { opacity: 0.3 } : undefined,
            data: data.map(item => item[yAxisKey])
          }]
        }

      default: // bar chart
        return {
          ...baseOption,
          xAxis: {
            type: 'category',
            data: data.map(item => item[xAxisKey]),
            axisLine: {
              lineStyle: { color: '#d1d5db' }
            },
            axisLabel: {
              color: '#6b7280',
              rotate: data.length > 5 ? 45 : 0
            }
          },
          yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: { color: '#d1d5db' }
            },
            axisLabel: {
              color: '#6b7280'
            },
            splitLine: {
              lineStyle: { color: '#f3f4f6' }
            }
          },
          series: [{
            name: yAxisKey,
            type: 'bar',
            data: data.map(item => item[yAxisKey]),
            barMaxWidth: 60,
            itemStyle: {
              borderRadius: [4, 4, 0, 0]
            }
          }]
        }
    }
  }

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div style={{ height: '400px' }}>
          <ReactECharts
            option={getChartOption()}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        </div>
      </CardContent>
    </Card>
  )
}