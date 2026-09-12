import { monthKey, shiftMonth, uid } from './money'
import { PERSON_COLORS, type AppState } from './types'

export function sampleState(base: AppState): AppState {
  const month = monthKey()
  const last = shiftMonth(month, -1)
  const you = { id: uid('pr'), name: 'You', color: PERSON_COLORS[0] }
  const partner = { id: uid('pr'), name: 'Partner', color: PERSON_COLORS[1] }
  const rent = base.categories.find((c) => c.name === 'Rent')?.id ?? 'cat-rent'
  const food = base.categories.find((c) => c.name === 'Food')?.id ?? 'cat-food'
  const bills = base.categories.find((c) => c.name === 'Bills')?.id ?? 'cat-bills'

  return {
    ...base,
    settings: { ...base.settings, householdName: 'You & Partner' },
    people: [you, partner],
    incomes: [
      { id: uid('in'), personId: you.id, month, source: 'Day job', amount: 4200 },
      { id: uid('in'), personId: partner.id, month, source: 'Studio work', amount: 3100 },
      { id: uid('in'), personId: you.id, month: last, source: 'Day job', amount: 4200 },
      { id: uid('in'), personId: partner.id, month: last, source: 'Studio work', amount: 3000 },
    ],
    expenses: [
      { id: uid('ex'), personId: you.id, month, categoryId: rent, note: 'Flat share', amount: 1400 },
      { id: uid('ex'), personId: you.id, month, categoryId: food, note: 'Groceries', amount: 320 },
      { id: uid('ex'), personId: partner.id, month, categoryId: bills, note: 'Internet + phone', amount: 90 },
      { id: uid('ex'), personId: partner.id, month, categoryId: food, note: 'Lunches', amount: 180 },
      { id: uid('ex'), personId: you.id, month: last, categoryId: rent, note: 'Flat share', amount: 1400 },
      { id: uid('ex'), personId: partner.id, month: last, categoryId: food, note: 'Groceries', amount: 260 },
    ],
    investments: [
      { id: uid('iv'), personId: you.id, month, name: 'Index fund', amount: 250 },
      { id: uid('iv'), personId: partner.id, month, name: 'Emergency pot', amount: 150 },
    ],
    actuals: [
      { personId: you.id, month, amount: 2300 },
      { personId: partner.id, month, amount: 2750 },
      { personId: you.id, month: last, amount: 2500 },
      { personId: partner.id, month: last, amount: 2600 },
    ],
  }
}
