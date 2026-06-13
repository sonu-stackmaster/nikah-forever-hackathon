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

  const getChartOption = () => {
    const columns = Object.keys(data[0])
    const xAxisKey = columns[0]
    const yAxisKey = columns[1]

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