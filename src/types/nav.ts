export interface SubCategory {
  type: string
  label: string
  href: string
}

export interface NavItem {
  type: string
  label: string
  href: string
  id?:string
  sub?: SubCategory[]
}

export interface NavData {
  navData: NavItem[]
}
