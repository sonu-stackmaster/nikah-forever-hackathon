import { Header } from '@/components/layout/Header'
import { DashboardGrid } from '@/components/dashboard/DashboardGrid'

export default function DashboardPage() {
  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Key metrics and insights for NikahForever platform</p>
        </div>
        <DashboardGrid />
      </main>
    </div>
  )
}