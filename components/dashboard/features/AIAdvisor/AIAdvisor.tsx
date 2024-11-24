import { useState, useEffect } from 'react'
import { HolographicCard } from '@/components/dashboard/HolographicUI'
import { AlertTriangle, PiggyBank, DollarSign, Send, Bot } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  reaction?: '👍' | '👎' | null;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
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

// Gemini API configuration
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

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

  const sendMessageToGemini = async (prompt: string) => {
    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `As an AI financial advisor, analyze this situation:
                - Country: ${userData.country}
                - University: ${userData.university}
                - Monthly Income: $${userData.monthlyIncome}
                - Monthly Expenses: $${userData.monthlyExpenses}
                - Loan Amount: $${userData.loanAmount}
                
                User Question: ${prompt}
                
                Provide specific, actionable advice focusing on:
                1. Loan Management & Financial Aid
                2. Budget Optimization
                3. Investment Opportunities
                4. Extra Income Sources`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json() as GeminiResponse;
      
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('No valid response found in the API result');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      reaction: null
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToGemini(inputMessage);
      
      const aiMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        reaction: null
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        timestamp: new Date(),
        reaction: null
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReaction = (index: number, reaction: '👍' | '👎') => {
    setMessages(messages.map((msg, i) => 
      i === index ? { ...msg, reaction } : msg
    ));
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <HolographicCard className="h-[600px] flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-6 h-6 text-cyan-500" />
          <h3 className="text-xl font-bold">AI Financial Advisor</h3>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-grow mb-4 h-[400px]">
          <div className="space-y-4 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'assistant' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'assistant'
                      ? 'bg-gray-800 text-white'
                      : 'bg-cyan-500 text-white'
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                    {message.role === 'assistant' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleReaction(index, '👍')}
                          className={`p-1 rounded ${message.reaction === '👍' ? 'bg-cyan-500' : ''}`}
                        >
                          👍
                        </button>
                        <button 
                          onClick={() => handleReaction(index, '👎')}
                          className={`p-1 rounded ${message.reaction === '👎' ? 'bg-cyan-500' : ''}`}
                        >
                          👎
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-white rounded-lg p-4">
                  <div className="flex gap-2">
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