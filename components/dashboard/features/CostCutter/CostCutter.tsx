import { HolographicCard } from '@/components/dashboard/HolographicUI'
import { Scissors, TrendingDown } from 'lucide-react'

interface CostCutterProps {
  userData: {
    monthlyExpenses: number;
    country: string;
  }
}

export function CostCutter({ userData }: CostCutterProps) {
  return (
    <>
      <HolographicCard>
        <h3 className="text-xl font-bold mb-4">Expense Analysis</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
            <div>
              <p className="text-gray-400">Current Monthly Expenses</p>
              <p className="text-2xl font-bold text-white">${userData.monthlyExpenses}</p>
            </div>
            <Scissors className="w-8 h-8 text-cyan-500" />
          </div>
        </div>
      </HolographicCard>

      <HolographicCard>
        <h3 className="text-xl font-bold mb-4">Potential Savings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
            <div>
              <p className="text-gray-400">Optimization Target</p>
              <p className="text-2xl font-bold text-white">-15%</p>
            </div>
            <TrendingDown className="w-8 h-8 text-cyan-500" />
          </div>
        </div>
      </HolographicCard>
    </>
  )
} 