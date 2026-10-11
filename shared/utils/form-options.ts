export const projectTypeOptions = [
  { value: 'site-vitrine', messageKey: 'siteVitrine' },
  { value: 'e-commerce', messageKey: 'ecommerce' },
  { value: 'application-web', messageKey: 'webApp' },
  { value: 'maintenance', messageKey: 'maintenance' },
  { value: 'autre', messageKey: 'other' }
] as const

export const budgetOptions = [
  { value: 'moins-250k', messageKey: 'less250k' },
  { value: '250k-500k', messageKey: '250to500k' },
  { value: '500k-1m', messageKey: '500kto1m' },
  { value: '1m-2m', messageKey: '1to2m' },
  { value: 'plus-2m', messageKey: 'over2m' },
  { value: 'a-definir', messageKey: 'undecided' }
] as const