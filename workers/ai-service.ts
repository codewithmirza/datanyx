import { Ai } from '@cloudflare/ai'
import type { KVNamespace } from '@cloudflare/workers-types'

// Define our own Env interface
interface Env {
  AI: Ai;
  VECTORIZE: any;
  FINANCIAL_DATA: KVNamespace;
}

interface FinancialData {
  loanAmount: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  country: string;
  university: string;
}

interface AiResponse {
  response: string;
}

export default {
  async fetch(request: Request, env: Env) {
    const ai = new Ai(env.AI)

    // Handle CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    try {
      const { pathname } = new URL(request.url)

      switch (pathname) {
        case '/api/recommendations':
          return handleRecommendations(request, env, ai)
        case '/api/scholarships':
          return handleScholarshipSearch(request, env, ai)
        case '/api/investment-advice':
          return handleInvestmentAdvice(request, env, ai)
        case '/api/cost-analysis':
          return handleCostAnalysis(request, env, ai)
        default:
          return new Response('Not found', { status: 404 })
      }
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      })
    }
  }
}

async function handleRecommendations(request: Request, env: Env, ai: Ai) {
  const data: FinancialData = await request.json()
  
  const prompt = `
    As an AI financial advisor, analyze this student's situation:
    - Loan Amount: $${data.loanAmount}
    - Monthly Income: $${data.monthlyIncome}
    - Monthly Expenses: $${data.monthlyExpenses}
    - Country: ${data.country}
    - University: ${data.university}
  `

  const completion = await ai.run('@cf/meta/llama-2-7b-chat-int8', {
    messages: [{ role: 'user', content: prompt }]
  }) as { response: string }

  const metrics = calculateFinancialMetrics(data)

  return new Response(JSON.stringify({
    success: true,
    data: {
      recommendations: parseAIResponse(completion.response),
      metrics
    }
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  })
}

// Helper functions
function calculateFinancialMetrics(data: FinancialData) {
  const debtToIncomeRatio = data.loanAmount / (data.monthlyIncome * 12)
  const monthlySavings = data.monthlyIncome - data.monthlyExpenses
  const savingsRate = (monthlySavings / data.monthlyIncome) * 100

  return {
    debtToIncomeRatio,
    monthlySavings,
    savingsRate,
    riskLevel: debtToIncomeRatio > 0.43 ? 'High' : debtToIncomeRatio > 0.36 ? 'Medium' : 'Low'
  }
}

function parseAIResponse(response: string): string[] {
  try {
    return response.split('\n').filter(line => line.trim().length > 0)
  } catch {
    return ['Unable to parse AI recommendations']
  }
}

async function handleScholarshipSearch(request: Request, env: Env, ai: Ai) {
  const { country, studyLevel, amount } = await request.json()
  const query = `Find scholarships for ${studyLevel} students in ${country} with amount around ${amount}`
  
  try {
    // Generate embeddings
    const embedding = await ai.run('@cf/baai/bge-base-en-v1.5', {
      text: [query]  // Pass as array
    })

    // Query the vector index
    const results = await env.VECTORIZE.query({
      vector: embedding.data[0],  // Use first embedding
      topK: 5
    })

    return new Response(JSON.stringify({ 
      success: true,
      matches: results 
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (error) {
    console.error('Search error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to search scholarships' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
  }
}

async function handleInvestmentAdvice(request: Request, env: Env, ai: Ai) {
  const { savings, riskTolerance, timeHorizon } = await request.json()
  const prompt = `Generate investment advice for a student with ${savings} savings, ${riskTolerance} risk tolerance, and ${timeHorizon} time horizon.`
  
  const completion = await ai.run('@cf/meta/llama-2-7b-chat-int8', {
    messages: [{ role: 'user', content: prompt }]
  }) as { response: string }
  
  return new Response(JSON.stringify({ advice: completion.response }))
}

async function handleCostAnalysis(request: Request, env: Env, ai: Ai) {
  const { expenses, location } = await request.json()
  
  const completion = await ai.run('@cf/meta/llama-2-7b-chat-int8', {
    messages: [{ 
      role: 'user', 
      content: `Analyze these monthly expenses in ${location} and suggest optimizations: ${JSON.stringify(expenses)}` 
    }]
  }) as { response: string }
  
  return new Response(JSON.stringify({ analysis: completion.response }))
} 