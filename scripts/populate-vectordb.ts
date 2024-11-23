import { Ai } from '@cloudflare/ai'
import financialAidData from '../data/financial-aid.json'

export interface Env {
  AI: Ai;
  VECTORIZE: any;
}

async function populateVectorDB(env: Env) {
  const ai = new Ai(env.AI)
  
  const allData = [
    ...financialAidData.scholarships,
    ...financialAidData.grants
  ]
  
  for (const data of allData) {
    try {
      // Generate embeddings
      const embedding = await ai.run('@cf/baai/bge-base-en-v1.5', {
        text: [JSON.stringify(data)]
      })

      // Insert into vector database
      await env.VECTORIZE.insert({
        id: data.id,
        values: embedding.data[0],
        metadata: data
      })

      console.log(`Successfully inserted data for ID: ${data.id}`)
    } catch (error) {
      console.error(`Failed to process data for ID: ${data.id}`, error)
    }
  }
}

export default {
  async fetch(request: Request, env: Env) {
    try {
      await populateVectorDB(env)
      return new Response('Vector DB populated successfully')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      return new Response(`Failed to populate DB: ${errorMessage}`, { status: 500 })
    }
  }
} 