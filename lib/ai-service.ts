interface AIRequestData {
  loanAmount: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  country: string;
  university: string;
  userMessage: string;
  detectedTopics: string[];
  context: {
    country: string;
    monthlyBudget: number;
    savingsPotential: number;
  };
}

interface ScholarshipInfo {
  name: string;
  amount: number;
  deadline: string;
  eligibility: string;
}

interface InvestmentOption {
  type: string;
  risk: string;
  minAmount: number;
  description: string;
}

const API_BASE = 'https://smartfinance-ai.manwaarullahb.workers.dev'

export async function getAIRecommendations(data: AIRequestData) {
  try {
    const response = await fetch(`${API_BASE}/api/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: data.userMessage,
        userData: data
      })
    })

    if (!response.ok) throw new Error('AI service error')
    return await response.json()
  } catch (error) {
    console.error('Error calling AI service:', error)
    throw error
  }
}

export async function getAvailableScholarships(country: string, university: string) {
  return fetchFromAI('/api/scholarships', { country, university })
}

export async function getInvestmentSuggestions(budget: number, riskTolerance: string) {
  return fetchFromAI('/api/investment-suggestions', { budget, riskTolerance })
}

export async function getCryptoOpportunities() {
  return fetchFromAI('/api/crypto-opportunities', {})
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