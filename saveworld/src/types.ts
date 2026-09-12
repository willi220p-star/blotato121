export interface Person {
  id: string
  name: string
  color: string
}

export interface Category {
  id: string
  name: string
}

export interface Income {
  id: string
  personId: string
  month: string
  source: string
  amount: number
}

export interface Expense {
  id: string
  personId: string
  month: string
  categoryId: string
  note: string
  amount: number
}

export interface Investment {
  id: string
  personId: string
  month: string
  name: string
  amount: number
}

export interface ActualSavings {
  personId: string
  month: string
  amount: number
}

export interface Settings {
  householdName: string
  currency: string
}

export interface AppState {
  settings: Settings
  people: Person[]
  categories: Category[]
  incomes: Income[]
  expenses: Expense[]
  investments: Investment[]
  actuals: ActualSavings[]
}

export interface MonthTotals {
  earnings: number
  spending: number
  estimatedSavings: number
  actualSavings: number
  difference: number
  investments: number
}

export const PERSON_COLORS = [
  '#1b4d3e',
  '#7a2e4a',
  '#1d4e6b',
  '#4a3f72',
  '#3d5a1f',
  '#0f766e',
]
