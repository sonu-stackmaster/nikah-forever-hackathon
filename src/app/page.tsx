import { ChatInterface } from '@/components/chat/ChatInterface'
import { Header } from '@/components/layout/Header'

export default function HomePage() {
  return (
    <div className="h-screen flex flex-col gradient-bg overflow-hidden">
      <Header />
      <main className="flex-1 overflow-hidden relative">
        <ChatInterface />
      </main>
    </div>
  )
}