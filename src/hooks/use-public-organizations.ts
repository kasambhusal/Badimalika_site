"use client"

import { useState, useEffect, useCallback } from "react"
import { Get } from "@/lib/api"
import type {
  PublicOrganization,
  PublicOrganizationResponse,
  PublicOrganizationCategory,
  PublicCategoriesResponse,
} from "@/types/public-organization"

interface UsePublicOrganizationsParams {
  limit: number
  offset: number
  searchTerm?: string
  category?: string
}

interface UsePublicOrganizationsReturn {
  organizations: PublicOrganization[]
  total: number
  loading: boolean
  error: string | null
  refetch: () => void
}

export function usePublicOrganizations({
  limit,
  offset,
  searchTerm,
  category,
}: UsePublicOrganizationsParams): UsePublicOrganizationsReturn {
  const [organizations, setOrganizations] = useState<PublicOrganization[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      })

      if (searchTerm && searchTerm.trim()) {
        params.append("q", searchTerm.trim())
      }

      if (category && category !== "all") {
        params.append("category", category)
      }

      const response = (await Get({
        url: `/public/organizations/?${params.toString()}`,
      })) as PublicOrganizationResponse

      setOrganizations(response.results || [])
      setTotal(response.count || 0)
    } catch (err) {
      console.error("Error fetching public organizations:", err)
      setError("संस्थाहरू लोड गर्न समस्या भयो। कृपया पुनः प्रयास गर्नुहोस्।")
      setOrganizations([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [limit, offset, searchTerm, category])

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  return {
    organizations,
    total,
    loading,
    error,
    refetch: fetchOrganizations,
  }
}

export function usePublicOrganizationCategories() {
  const [categories, setCategories] = useState<PublicOrganizationCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = (await Get({
          url: "/public/organizations/categories/",
        })) as PublicCategoriesResponse

        if (response && response.categories && Array.isArray(response.categories)) {
          setCategories(response.categories)
        } else {
          setCategories([])
        }
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError("श्रेणीहरू लोड गर्न समस्या भयो।")
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

export function useOrganizationStats() {
  const [stats, setStats] = useState({
    educational: 0,
    health: 0,
    financial: 0,
    ngo: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch counts for each category
        const [educational, health, financial, ngo] = await Promise.all([
          Get({ url: "/public/organizations/?category=educational&limit=1" }) as Promise<PublicOrganizationResponse>,
          Get({ url: "/public/organizations/?category=health&limit=1" }) as Promise<PublicOrganizationResponse>,
          Get({ url: "/public/organizations/?category=financial&limit=1" }) as Promise<PublicOrganizationResponse>,
          Get({ url: "/public/organizations/?category=ngo&limit=1" }) as Promise<PublicOrganizationResponse>,
        ])

        setStats({
          educational: educational.count || 0,
          health: health.count || 0,
          financial: financial.count || 0,
          ngo: ngo.count || 0,
        })
      } catch (err) {
        console.error("Error fetching organization stats:", err)
        setError("तथ्याङ्क लोड गर्न समस्या भयो।")
        setStats({ educational: 0, health: 0, financial: 0, ngo: 0 })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}
