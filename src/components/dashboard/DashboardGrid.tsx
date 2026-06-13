'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Heart, IndianRupee, TrendingUp, MessageCircle, Star } from 'lucide-react'

export function DashboardGrid() {
  const kpiCards = [
    {
      title: 'Total Users',
      value: '12,547',
      change: '+8.2%',
      icon: Users,
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Active Matches',
      value: '3,421',
      change: '+12.5%',
      icon: Heart,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Monthly Revenue',
      value: '₹8,45,600',
      change: '+15.3%',
      icon: IndianRupee,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Conversion Rate',
      value: '23.8%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Messages Sent',
      value: '45,320',
      change: '+18.7%',
      icon: MessageCircle,
      color: 'from-orange-500 to-yellow-500'
    },
    {
      title: 'Avg Rating',
      value: '4.6/5',
      change: '+0.2',
      icon: Star,
      color: 'from-pink-500 to-red-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="bg-white/70 backdrop-blur-sm border-pink-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <p className="text-sm text-green-600 font-medium">{kpi.change} vs last month</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${kpi.color}`}>
                  <kpi.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-pink-200">
          <CardHeader>
            <CardTitle>User Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>User growth chart would be rendered here</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-pink-200">
          <CardHeader>
            <CardTitle>Revenue by Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>Revenue breakdown chart would be rendered here</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white/70 backdrop-blur-sm border-pink-200">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-pink-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New user registered from Mumbai</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-pink-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Gold subscription purchased</p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-pink-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New match created</p>
                <p className="text-xs text-gray-500">8 minutes ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}