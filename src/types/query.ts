export interface Query {
  id: string
  question: string
  sql?: string
  result?: QueryResult
  error?: string
  execution_time?: number
  created_at: Date
}

export interface QueryResult {
  data: any[] | null
  visualization_type: 'table' | 'chart' | 'kpi' | 'chat'
  chart_config?: ChartConfig
  insights?: string[]
  message?: string
  row_count: number
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'area'
  title?: string
  xAxis?: string
  yAxis?: string
}

export interface Intent {
  type: 'analytics' | 'lookup' | 'comparison' | 'trend'
  metric?: string
  entity?: string
  timeframe?: string
  filters?: Record<string, any>
}

export interface SchemaInfo {
  tables: string[]
  columns: Record<string, string[]>
  relationships: string[]
  business_terms: Record<string, string>
}