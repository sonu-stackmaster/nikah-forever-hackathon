'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Heart, IndianRupee, TrendingUp, MessageCircle, Star, Calendar, ArrowUpRight } from 'lucide-react'
import { queryAPI } from '@/services/queryAPI'
import { ChartRenderer } from '@/components/results/ChartRenderer'

export function DashboardGrid() {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true)
      const res = await queryAPI.getDashboardData()
      if (res) {
        setData(res)
      }
      setIsLoading(false)
    }
    loadDashboard()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* KPI Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-white/60 border-pink-100 animate-pulse">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-2.5 w-2/3">
                    <div className="h-4 bg-pink-100 rounded w-1/2"></div>
                    <div className="h-6 bg-pink-50 rounded w-3/4"></div>
                    <div className="h-3.5 bg-pink-50/50 rounded w-2/3"></div>
                  </div>
                  <div className="p-6 bg-pink-100 rounded-lg w-12 h-12"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Skeleton Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/60 border-pink-100 h-96 animate-pulse">
            <CardContent className="p-6 h-full flex flex-col justify-between">
              <div className="h-6 bg-pink-100 rounded w-1/3"></div>
              <div className="flex-1 mt-6 bg-pink-50/40 rounded-xl"></div>
            </CardContent>
          </Card>
          <Card className="bg-white/60 border-pink-100 h-96 animate-pulse">
            <CardContent className="p-6 h-full flex flex-col justify-between">
              <div className="h-6 bg-pink-100 rounded w-1/3"></div>
              <div className="flex-1 mt-6 bg-pink-50/40 rounded-xl"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const kpis = data?.kpis || {
    total_users: '1,200',
    active_matches: '980',
    total_revenue: '₹5,40,000',
    conversion_rate: '23.8%',
    messages_sent: '12,500',
    avg_rating: '4.6/5'
  }

  const kpiCards = [
    {
      title: 'Total Users Registered',
      value: kpis.total_users,
      change: '+8.2%',
      icon: Users,
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Active Platform Matches',
      value: kpis.active_matches,
      change: '+12.5%',
      icon: Heart,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Lifetime Platform Revenue',
      value: kpis.total_revenue,
      change: '+15.3%',
      icon: IndianRupee,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Conversion Rate',
      value: kpis.conversion_rate,
      change: '+2.1%',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Chat Messages Sent',
      value: kpis.messages_sent,
      change: '+18.7%',
      icon: MessageCircle,
      color: 'from-orange-500 to-yellow-500'
    },
    {
      title: 'Average Support Rating',
      value: kpis.avg_rating,
      change: '+0.2',
      icon: Star,
      color: 'from-pink-500 to-red-500'
    }
  ]

  // Helper function to return beautiful colors for activities
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user': return 'bg-green-500'
      case 'payment': return 'bg-emerald-500'
      case 'match': return 'bg-pink-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="bg-white/80 border-pink-100 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 tracking-wide uppercase mb-1">{kpi.title}</p>
                  <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{kpi.value}</p>
                  <p className="text-xs text-green-600 font-bold flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    {kpi.change} vs last month
                  </p>
                </div>
                <div className={`p-3.5 rounded-2xl bg-gradient-to-r ${kpi.color} shadow-md`}>
                  <kpi.icon className="h-5.5 w-5.5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dynamic Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data?.user_growth && data.user_growth.length > 0 ? (
          <div className="bg-white/80 rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
            <ChartRenderer 
              data={data.user_growth}
              chartType="line"
              title="User Registration Growth"
            />
          </div>
        ) : (
          <Card className="bg-white/80 border-pink-100 flex items-center justify-center h-96">
            <p className="text-gray-400">No user growth data available</p>
          </Card>
        )}

        {data?.revenue_by_plan && data.revenue_by_plan.length > 0 ? (
          <div className="bg-white/80 rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
            <ChartRenderer 
              data={data.revenue_by_plan}
              chartType="pie"
              title="Revenue Breakdown by Plan"
            />
          </div>
        ) : (
          <Card className="bg-white/80 border-pink-100 flex items-center justify-center h-96">
            <p className="text-gray-400">No revenue data available</p>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      <Card className="bg-white/80 border-pink-100 shadow-sm">
        <CardHeader className="pb-3 border-b border-pink-50">
          <CardTitle className="text-lg font-bold text-gray-800">Live Platform Activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {data?.recent_activity && data.recent_activity.length > 0 ? (
              data.recent_activity.map((activity: any, index: number) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-pink-50/40 rounded-xl border border-pink-100/30">
                  <div className={`w-2 h-2 rounded-full ${getActivityColor(activity.type)} animate-pulse`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{activity.title}</p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      {new Date(activity.time).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No recent activity found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}