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
  '#0071e3',
  '#ff375f',
  '#30d158',
  '#bf5af2',
  '#ff9f0a',
  '#64d2ff',
]
