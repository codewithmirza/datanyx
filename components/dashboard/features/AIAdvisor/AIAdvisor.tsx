import { useState, useEffect } from 'react'
import { HolographicCard } from '@/components/dashboard/HolographicUI'
import { AlertTriangle, PiggyBank, DollarSign } from 'lucide-react'
import { getAIRecommendations } from '@/lib/ai-service'

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
  const [aiData, setAiData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAIData = async () => {
      try {
        const data = await getAIRecommendations(userData)
        setAiData(data)
      } catch (error) {
        console.error('Error fetching AI data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAIData()
  }, [userData])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <HolographicCard>
        <h3 className="text-xl font-bold mb-4">AI Recommendations</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
            <div>
              <p className="text-gray-400">Loan Strategy</p>
              <p className="text-lg text-white">
                {aiData?.data?.recommendations?.loanStrategy || 'Loading...'}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-cyan-500" />
          </div>
        </div>
      </HolographicCard>

      <HolographicCard>
        <h3 className="text-xl font-bold mb-4">Financial Health</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
            <div>
              <p className="text-gray-400">Risk Level</p>
              <p className="text-2xl font-bold text-white">
                {aiData?.data?.financialMetrics?.risk?.riskLevel || 'N/A'}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-cyan-500" />
          </div>
          <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
            <div>
              <p className="text-gray-400">Monthly Savings Target</p>
              <p className="text-2xl font-bold text-white">
                ${aiData?.data?.financialMetrics?.monthly?.availableForSavings || 0}
              </p>
            </div>
            <PiggyBank className="w-8 h-8 text-cyan-500" />
          </div>
          <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
            <div>
              <p className="text-gray-400">Emergency Fund Goal</p>
              <p className="text-2xl font-bold text-white">
                ${aiData?.data?.financialMetrics?.projections?.emergencyFundTarget || 0}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-cyan-500" />
          </div>
        </div>
      </HolographicCard>
    </>
  )
} 