interface UserData {
  loanAmount: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  country: string;
  university: string;
}

interface ScholarshipCriteria {
  country: string;
  studyLevel: string;
  amount: number;
}

interface InvestmentData {
  savings: number;
  riskTolerance: string;
  timeHorizon: number;
}

interface ExpenseData {
  expenses: Record<string, number>;
  location: string;
}

const API_BASE = 'https://smartfinance-ai.manwaarullahb.workers.dev'

export async function getAIRecommendations(userData: UserData) {
  return fetchFromAI('/api/recommendations', userData)
}

export async function searchScholarships(criteria: ScholarshipCriteria) {
  return fetchFromAI('/api/scholarships', criteria)
}

export async function getInvestmentAdvice(financialData: InvestmentData) {
  return fetchFromAI('/api/investment-advice', financialData)
}

export async function analyzeCosts(expenseData: ExpenseData) {
  return fetchFromAI('/api/cost-analysis', expenseData)
}

async function fetchFromAI(endpoint: string, data: any) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('AI service error')
    return await response.json()
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error)
    throw error
  }
} 