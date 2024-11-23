import { HolographicCard } from '@/components/dashboard/HolographicUI'
import { Calendar, Clock } from 'lucide-react'

interface FinancialTimelineProps {
  userData: {
    loanAmount: number;
    monthlyIncome: number;
    monthlyExpenses: number;
  }
}

export function FinancialTimeline({ userData }: FinancialTimelineProps) {
  return (
    <HolographicCard>
      <h3 className="text-xl font-bold mb-4">Financial Timeline</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
          <div>
            <p className="text-gray-400">Loan Payoff Date</p>
            <p className="text-2xl font-bold text-white">March 2034</p>
          </div>
          <Calendar className="w-8 h-8 text-cyan-500" />
        </div>
        <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
          <div>
            <p className="text-gray-400">Time to Emergency Fund</p>
            <p className="text-2xl font-bold text-white">18 months</p>
          </div>
          <Clock className="w-8 h-8 text-cyan-500" />
        </div>
      </div>
    </HolographicCard>
  )
} 