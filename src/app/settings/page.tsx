'use client'

import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Settings, Shield, Sliders, Database } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">System Settings</h1>
          <p className="text-gray-600">Configure QueryGPT agent parameters and database connections</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white border-pink-100 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sliders className="h-5 w-5 text-pink-600" />
                AI Model Configurations
              </CardTitle>
              <CardDescription>Select LLMs and adjust model parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-pink-50">
                <span className="font-semibold text-gray-700">Primary SQL Agent Model</span>
                <span className="bg-pink-100 text-pink-700 px-2.5 py-1 rounded-md text-xs font-bold">gpt-4o-mini</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-pink-50">
                <span className="font-semibold text-gray-700">Insight Generator Model</span>
                <span className="bg-pink-100 text-pink-700 px-2.5 py-1 rounded-md text-xs font-bold">gpt-4o-mini</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold text-gray-700">Agent Temperature</span>
                <span className="text-gray-500 font-mono">0.1 (Strict)</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-pink-100 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="h-5 w-5 text-pink-600" />
                Matrimonial Database Connection
              </CardTitle>
              <CardDescription>Active SQLite details and connection status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-pink-50">
                <span className="font-semibold text-gray-700">Database Engine</span>
                <span className="text-gray-600">SQLite 3</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-pink-50">
                <span className="font-semibold text-gray-700">Target Schema File</span>
                <span className="text-gray-600 font-mono">nf_buildathon.db</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold text-gray-700">Connection Mode</span>
                <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  Read-Only (Secure)
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-pink-100 shadow-sm md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-pink-600" />
                Security & Verification Guardrails
              </CardTitle>
              <CardDescription>System guardrails and verification layers</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-pink-50/50 rounded-xl border border-pink-100/30">
                <h4 className="font-bold text-gray-800 mb-1">SQL Sanitizer Active</h4>
                <p className="text-gray-500 text-xs">
                  Validates queries to block destructive syntax (e.g. DROP, INSERT, UPDATE, DELETE).
                </p>
              </div>
              <div className="p-3 bg-pink-50/50 rounded-xl border border-pink-100/30">
                <h4 className="font-bold text-gray-800 mb-1">Schema Whitelisting</h4>
                <p className="text-gray-500 text-xs">
                  Restricts queries to only access defined platform schema tables.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
