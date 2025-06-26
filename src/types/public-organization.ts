export interface PublicOrganization {
  id: number
  name: string
  category: string
  category_display?: string
  address?: string
  phone_no?: string
  is_active: boolean
}

export interface PublicOrganizationResponse {
  count: number
  next?: string
  previous?: string
  results: PublicOrganization[]
}

export interface PublicOrganizationCategory {
  value: string
  label: string
}

export interface PublicCategoriesResponse {
  categories: PublicOrganizationCategory[]
}
