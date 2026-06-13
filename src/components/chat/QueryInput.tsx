'use client'

import { useState } from 'react'
import { Send, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQueryStore } from '@/store/queryStore'

interface QueryInputProps {
  value: string
  onChange: (value: string) => void
}

export function QueryInput({ value, onChange }: QueryInputProps) {
  const { submitQuery, isLoading } = useQueryStore()
  const [isListening, setIsListening] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim() && !isLoading) {
      await submitQuery(value.trim())
      onChange('')
    }
  }

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.lang = 'en-IN'
      recognition.interimResults = false
      
      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        onChange(transcript)
      }
      
      recognition.start()
    } else {
      alert('Speech recognition not supported in your browser')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ask anything about your data... (English, Hindi, Hinglish supported)"
            className="w-full p-4 pr-12 border-2 border-pink-200 rounded-lg focus:border-pink-400 focus:outline-none resize-none min-h-[60px] bg-white/80 backdrop-blur-sm"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleVoiceInput}
            className={`absolute right-2 top-2 ${isListening ? 'text-red-500' : 'text-gray-400'}`}
            disabled={isLoading}
          >
            <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
          </Button>
        </div>
        
        <Button 
          type="submit" 
          disabled={!value.trim() || isLoading}
          className="px-6"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        Tip: Try "Show me users from Delhi" or "Gold plan ka revenue kitna hai?"
      </div>
    </form>
  )
}