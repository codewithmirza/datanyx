import { useState, useEffect } from 'react'
import { HolographicCard } from '@/components/dashboard/HolographicUI'
import { AlertTriangle, PiggyBank, DollarSign, Send, Bot } from 'lucide-react'
import { getAIRecommendations } from '@/lib/ai-service'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from '@/components/ui/scroll-area'
// Removed the import for ScrollArea due to the error

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIResponse {
  data: {
    recommendations: {
      advice: string;
      relevantData: any[];
    };
  };
}

interface AIAdvisorProps {
  userData: {
    loanAmount: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    country: string;
    university: string;
  }
}

export function AIAdvisor({ userData }: AIAdvisorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Welcome! I'm your AI Financial Advisor. I can help you with:

1. 💰 Loan Management & Financial Aid
   - Government grants and scholarships
   - Student-specific financial schemes
   - Efficient loan repayment strategies

2. 📊 Budget Optimization
   - Cost-of-living adjustments for ${userData.country}
   - Smart spending recommendations
   - Expense tracking and reduction

3. 💹 Investment Opportunities
   - Student-friendly stock investments
   - Cryptocurrency opportunities and airdrops
   - Risk-managed portfolio suggestions

4. 💸 Extra Income Sources
   - Part-time work opportunities
   - Freelancing suggestions
   - Side hustle ideas

What would you like to learn more about?`,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const getAIResponseForTopic = async (userMessage: string) => {
    const topics = {
      loans: ['loan', 'repayment', 'grant', 'scholarship', 'aid', 'debt'],
      budget: ['budget', 'expense', 'cost', 'living', 'spend', 'save'],
      investment: ['invest', 'stock', 'crypto', 'airdrop', 'portfolio'],
      income: ['earn', 'income', 'job', 'work', 'freelance', 'side hustle']
    }

    const messageWords = userMessage.toLowerCase().split(' ')
    const detectedTopics = Object.entries(topics).filter(([_, keywords]) =>
      keywords.some(keyword => messageWords.includes(keyword))
    ).map(([topic]) => topic)

    return {
      ...userData,
      userMessage,
      detectedTopics: detectedTopics.length ? detectedTopics : ['general'],
      context: {
        country: userData.country,
        monthlyBudget: userData.monthlyIncome - userData.monthlyExpenses,
        savingsPotential: (userData.monthlyIncome - userData.monthlyExpenses) * 0.2
      }
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const enrichedUserData = await getAIResponseForTopic(inputMessage)
      const response = await getAIRecommendations(enrichedUserData)

      const isValidResponse = (resp: any): resp is AIResponse => {
        return resp 
          && typeof resp === 'object' 
          && 'data' in resp 
          && typeof resp.data === 'object'
          && 'recommendations' in resp.data 
          && typeof resp.data.recommendations === 'object'
          && 'advice' in resp.data.recommendations;
      }

      if (isValidResponse(response)) {
        const aiMessage: Message = {
          role: 'assistant',
          content: response.data.recommendations.advice,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <HolographicCard className="h-[600px] flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-6 h-6 text-cyan-500" />
          <h3 className="text-xl font-bold">AI Financial Advisor</h3>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-grow mb-4 pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-cyan-500 text-black ml-auto'
                      : 'bg-gray-800 text-white'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-white rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:-.3s]" />
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:-.5s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me about your finances..."
            className="flex-grow bg-gray-900 border-gray-700"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-cyan-500 hover:bg-cyan-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </HolographicCard>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HolographicCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Risk Level</p>
              <p className="text-2xl font-bold">Medium</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-cyan-500" />
          </div>
        </HolographicCard>

        <HolographicCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Monthly Savings</p>
              <p className="text-2xl font-bold">${userData.monthlyIncome - userData.monthlyExpenses}</p>
            </div>
            <PiggyBank className="w-8 h-8 text-cyan-500" />
          </div>
        </HolographicCard>

        <HolographicCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Loan Amount</p>
              <p className="text-2xl font-bold">${userData.loanAmount}</p>
            </div>
            <DollarSign className="w-8 h-8 text-cyan-500" />
          </div>
        </HolographicCard>
      </div>
    </div>
  )
} 