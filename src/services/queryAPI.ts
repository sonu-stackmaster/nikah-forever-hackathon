import axios from 'axios'
import { Query, QueryResult } from '@/types/query'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

export const queryAPI = {
  async processQuery(question: string): Promise<Partial<Query>> {
    try {
      const response = await api.post('/api/query', { question })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Failed to process query')
      }
      throw error
    }
  },

  async getQueryHistory(): Promise<Query[]> {
    try {
      const response = await api.get('/api/history')
      return response.data
    } catch (error) {
      console.error('Failed to fetch query history:', error)
      return []
    }
  },

  async getSchemaInfo() {
    try {
      const response = await api.get('/api/schema')
      return response.data
    } catch (error) {
      console.error('Failed to fetch schema info:', error)
      return null
    }
  },

  async getDashboardData() {
    try {
      const response = await api.get('/api/dashboard')
      return response.data
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      return null
    }
  }
}