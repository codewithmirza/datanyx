import { Ai } from '@cloudflare/ai'
import financialData from '../data/financial-aid.json'

export interface Env {
  AI: Ai;
  VECTORIZE: any;
  FINANCIAL_DATA: any;
}

async function populateVectorDB(env: Env) {
  const ai = new Ai(env.AI)
  
  const allData = [
    ...financialData.scholarships.map(s => ({
      ...s,
      type: 'scholarship',
      searchText: `${s.name} ${s.criteria} ${s.country}`
    })),
    ...financialData.grants.map(g => ({
      ...g,
      type: 'grant',
      searchText: `${g.program} ${g.eligibility} ${g.country}`
    })),
    ...financialData.investmentStrategies.map(i => ({
      ...i,
      type: 'investment',
      searchText: `${i.type} ${i.description} risk:${i.riskLevel}`
    })),
    ...financialData.costOfLiving.map(c => ({
      ...c,
      type: 'cost-of-living',
      searchText: `${c.country} ${c.city} living expenses student`
    }))
  ]
  
  for (const data of allData) {
    try {
      // Generate embeddings
      const embedding = await ai.run('@cf/baai/bge-base-en-v1.5', {
        text: [data.searchText]
      })

      // Store in vector database
      await env.VECTORIZE.insert({
        id: data.id,
        values: embedding.data[0],
        metadata: data
      })

      // Store full data in KV
      await env.FINANCIAL_DATA.put(data.id, JSON.stringify(data))

      console.log(`Successfully processed data for ID: ${data.id}`)
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
    } catch (error) {
      return new Response(`Failed to populate DB: ${error}`, { status: 500 })
    }
  }
} 