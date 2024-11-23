import { Ai } from '@cloudflare/ai'
import { getEmbedding } from './utils/embeddings'
import type { AiTextGenerationOutput } from '@cloudflare/ai/dist/ai/tasks/types/tasks'

// Define types for Cloudflare Workers
interface KVNamespace {
  get(key: string, type?: 'text' | 'json' | 'arrayBuffer' | 'stream'): Promise<any>;
  put(key: string, value: string | ReadableStream | ArrayBuffer): Promise<void>;
  delete(key: string): Promise<void>;
}

interface Env {
  AI: Ai;
  VECTORIZE: any;
  FINANCIAL_DATA: KVNamespace;
}

interface FinancialDataset {
  scholarships: Array<{
    id: string;
    name: string;
    amount: number;
    country: string;
    criteria: string;
    deadline: string;
  }>;
  grants: Array<{
    id: string;
    program: string;
    maxAmount: number;
    eligibility: string;
    country: string;
  }>;
  investmentStrategies: Array<{
    id: string;
    type: string;
    riskLevel: string;
    minAmount: number;
    description: string;
    studentFriendly: boolean;
  }>;
  costOfLiving: Array<{
    country: string;
    city: string;
    averageRent: number;
    monthlyExpenses: number;
    studentDiscounts: string[];
  }>;
}

interface RequestBody {
  prompt: string;
  userData: {
    country: string;
    university: string;
    monthlyIncome: number;
    monthlyExpenses: number;
    loanAmount: number;
    userMessage: string;
  };
}

async function handleRecommendations(request: Request, env: Env) {
  const body = await request.json() as unknown;
  
  // Type guard to validate request body
  const isValidRequestBody = (data: unknown): data is RequestBody => {
    if (!data || typeof data !== 'object') return false;
    
    const { prompt, userData } = data as any;
    
    return Boolean(
      prompt && 
      typeof prompt === 'string' &&
      userData &&
      typeof userData === 'object' &&
      'country' in userData &&
      'university' in userData &&
      'monthlyIncome' in userData &&
      'monthlyExpenses' in userData &&
      'loanAmount' in userData &&
      'userMessage' in userData
    );
  };

  if (!isValidRequestBody(body)) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { prompt, userData } = body;
    
    // Generate embedding for the prompt
    const embedding = await getEmbedding(env.AI, prompt);
    
    // Query vector database
    const vectorResults = await env.VECTORIZE.query({
      vector: embedding,
      topK: 5,
    });

    // Get relevant data from KV store
    const relevantData = await Promise.all(
      vectorResults.matches.map(async (match: any) => {
        const data = await env.FINANCIAL_DATA.get(match.id, 'json');
        return { ...data, score: match.score };
      })
    );

    // Construct AI prompt
    const aiPrompt = `
      As an AI financial advisor, analyze this student's situation and provide detailed recommendations:

      Student Profile:
      - Country: ${userData.country}
      - University: ${userData.university}
      - Monthly Income: $${userData.monthlyIncome}
      - Monthly Expenses: $${userData.monthlyExpenses}
      - Loan Amount: $${userData.loanAmount}
      
      User Question: ${userData.userMessage}
      
      Relevant Financial Data:
      ${JSON.stringify(relevantData, null, 2)}

      Based on the above information, provide detailed recommendations for:
      1. Loan Management & Financial Aid
      2. Budget Optimization
      3. Investment Opportunities
      4. Extra Income Sources

      Format the response in clear sections with actionable bullet points.
      Include specific numbers, deadlines, and eligibility criteria where applicable.
    `;

    // Get AI completion with proper typing
    const completion = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
      messages: [{ role: 'user', content: aiPrompt }]
    });

    // Handle the response based on the actual structure
    const response = completion as unknown as { response: string };

    if (!response || typeof response.response !== 'string') {
      throw new Error('Invalid AI response format');
    }

    return new Response(JSON.stringify({
      data: {
        recommendations: {
          advice: response.response,
          relevantData
        }
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in handleRecommendations:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate recommendations',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export default {
  async fetch(request: Request, env: Env) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    const url = new URL(request.url)
    
    try {
      switch (url.pathname) {
        case '/api/recommendations':
          return handleRecommendations(request, env)
        default:
          return new Response('Not found', { status: 404 })
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
} 