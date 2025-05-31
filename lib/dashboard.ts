import { UserData, LoanPrediction, GlobalData } from '@/types/dashboard'
import { db, getDoc, getDocs } from './firebase'

export async function fetchUserData(userId: string): Promise<UserData> {
  // If no userId is provided, use the test user ID
  const id = userId || 'test-user-id'
  
  try {
    // Use our mock getDoc function directly
    const userDoc = await getDoc({
      collection: 'users',
      id
    })
    
    if (!userDoc.exists()) {
      // Return default user data if not found
      return {
        name: 'Demo User',
        email: 'demo@example.com',
        university: 'Demo University',
        loanAmount: 45000,
        interestRate: 4.25,
        repaymentTerm: 120,
        monthlyIncome: 3200,
        monthlyExpenses: 2100,
        country: 'USA',
      }
    }
    
    return userDoc.data() as UserData
  } catch (error) {
    console.error('Error fetching user data:', error)
    // Return default user data on error
    return {
      name: 'Demo User',
      email: 'demo@example.com',
      university: 'Demo University',
      loanAmount: 45000,
      interestRate: 4.25,
      repaymentTerm: 120,
      monthlyIncome: 3200,
      monthlyExpenses: 2100,
      country: 'USA',
    }
  }
}

export async function processData(userData: UserData): Promise<GlobalData> {
  try {
    // Fetch global data using our mock getDocs function
    const loansSnapshot = await getDocs({
      docs: db.collection('loans').docs
    })
    
    const riskSnapshot = await getDocs({
      docs: db.collection('risks').docs
    })
    
    const inclusionSnapshot = await getDocs({
      docs: db.collection('inclusion').docs
    })

    return {
      globalLoanData: loansSnapshot.docs.map(doc => doc.data()) as Array<{ loanAmount: number; defaultStatus: number }>,
      riskFactors: riskSnapshot.docs.map(doc => doc.data()) as Array<{ creditScore: number; riskLevel: string }>,
      inclusionMetrics: Object.fromEntries(
        inclusionSnapshot.docs.map(doc => [doc.id || 'unknown', doc.data().score])
      )
    }
  } catch (error) {
    console.error('Error processing data:', error)
    // Return mock data on error
    return {
      globalLoanData: [
        { loanAmount: 40000, defaultStatus: 0 },
        { loanAmount: 60000, defaultStatus: 1 },
        { loanAmount: 35000, defaultStatus: 0 },
      ],
      riskFactors: [
        { creditScore: 650, riskLevel: 'medium' },
        { creditScore: 750, riskLevel: 'low' },
        { creditScore: 550, riskLevel: 'high' },
      ],
      inclusionMetrics: {
        'gender-gap': 0.82,
        'income-diversity': 0.65,
        'regional-coverage': 0.91,
      }
    }
  }
}

export async function generatePredictions(
  userData: UserData,
  globalData: GlobalData
): Promise<LoanPrediction> {
  const monthlyPayment = calculateMonthlyPayment(userData)
  const defaultRisk = calculateDefaultRisk(userData, globalData)
  const estimatedRepaymentTime = calculateRepaymentTime(userData, monthlyPayment)
  
  const monthlySavings = Math.max(0, userData.monthlyIncome - userData.monthlyExpenses - monthlyPayment)
  
  return {
    defaultRisk,
    estimatedRepaymentTime,
    monthlySavings,
  }
}

function calculateMonthlyPayment(userData: UserData): number {
  const { loanAmount, interestRate, repaymentTerm } = userData
  const monthlyRate = interestRate / 100 / 12
  return loanAmount * monthlyRate * Math.pow(1 + monthlyRate, repaymentTerm) / 
         (Math.pow(1 + monthlyRate, repaymentTerm) - 1)
}

function calculateDefaultRisk(userData: UserData, globalData: GlobalData): number {
  const debtToIncomeRatio = userData.loanAmount / (userData.monthlyIncome * 12)
  
  // Simple risk calculation based on debt-to-income ratio
  const baseRisk = debtToIncomeRatio * 20
  
  // Adjust based on global data
  const similarLoans = globalData.globalLoanData.filter(loan => 
    Math.abs(loan.loanAmount - userData.loanAmount) < 10000
  )
  
  if (similarLoans.length === 0) return baseRisk
  
  const similarDefaultRate = similarLoans.reduce(
    (sum, loan) => sum + loan.defaultStatus, 0
  ) / similarLoans.length
  
  return Math.min(100, Math.max(0, baseRisk + similarDefaultRate * 30))
}

function calculateRepaymentTime(userData: UserData, monthlyPayment: number): number {
  // Simplified calculation: Just return the term in years
  return userData.repaymentTerm / 12
} 