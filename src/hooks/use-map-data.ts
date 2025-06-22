"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { MapAPI, type ApiLayer, type GeoJSONResponse } from "@/lib/map-api-client"

export interface LayerInfo extends ApiLayer {
  displayName: string
  icon: React.ReactNode
  color: string
  active: boolean
  featureCount: number
  loading: boolean
  error: string | null
}

export function useMapData() {
  const [layers, setLayers] = useState<LayerInfo[]>([])
  const [layerData, setLayerData] = useState<Map<string, GeoJSONResponse>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState({
    totalLayers: 0,
    totalFeatures: 0,
    activeLayers: 0,
  })

  // Layer display configuration
  const getLayerConfig = (layerName: string) => {
    const configs: Record<string, { displayName: string; color: string; icon: string }> = {
      bdpt: { displayName: "Building Points", color: "#28a745", icon: "building" },
      hydro: { displayName: "Hydro Features", color: "#007bff", icon: "droplets" },
      hydro_ln: { displayName: "Hydro Lines", color: "#17a2b8", icon: "droplets" },
      landc: { displayName: "Land Cover", color: "#6f42c1", icon: "mountain" },
      topog: { displayName: "Topography", color: "#fd7e14", icon: "mountain" },
      trans: { displayName: "Transportation", color: "#dc3545", icon: "car" },
      village: { displayName: "Villages", color: "#20c997", icon: "home" },
      wardmap: { displayName: "Ward Map", color: "#6610f2", icon: "map" },
    }

    return (
      configs[layerName] || {
        displayName: layerName.charAt(0).toUpperCase() + layerName.slice(1),
        color: "#6c757d",
        icon: "circle",
      }
    )
  }

  // Load initial layers
  const loadLayers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const apiLayers = await MapAPI.getLayers()

      const enhancedLayers: LayerInfo[] = apiLayers.map((layer) => {
        const config = getLayerConfig(layer.name)
        return {
          ...layer,
          displayName: config.displayName,
          icon: null, // Will be set in the component
          color: config.color,
          active: false, // Start with all layers inactive for performance
          featureCount: 0,
          loading: false,
          error: null,
        }
      })

      setLayers(enhancedLayers)

      // Load summary
      const summaryData = await MapAPI.getMapSummary()
      setSummary(summaryData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load map data"
      setError(errorMessage)
      console.error("Error loading layers:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load data for a specific layer
  const loadLayerData = useCallback(
    async (layerName: string) => {
      // Don't reload if we already have the data
      if (layerData.has(layerName)) {
        return layerData.get(layerName)!
      }

      // Set loading state for this layer
      setLayers((prev) =>
        prev.map((layer) => (layer.name === layerName ? { ...layer, loading: true, error: null } : layer)),
      )

      try {
        const data = await MapAPI.getLayerData(layerName)

        // Cache the data
        setLayerData((prev) => new Map(prev).set(layerName, data))

        // Update layer info
        setLayers((prev) =>
          prev.map((layer) =>
            layer.name === layerName
              ? {
                  ...layer,
                  loading: false,
                  featureCount: data.features?.length || 0,
                  error: null,
                }
              : layer,
          ),
        )

        return data
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : `Failed to load ${layerName} data`

        // Update layer error state
        setLayers((prev) =>
          prev.map((layer) => (layer.name === layerName ? { ...layer, loading: false, error: errorMessage } : layer)),
        )

        throw err
      }
    },
    [layerData],
  )

  // Toggle layer active state
  const toggleLayer = useCallback(
    async (layerId: number) => {
      const layer = layers.find((l) => l.id === layerId)
      if (!layer) return

      const newActiveState = !layer.active

      // Update UI immediately for responsiveness
      setLayers((prev) => prev.map((l) => (l.id === layerId ? { ...l, active: newActiveState } : l)))

      // Load data if activating the layer
      if (newActiveState) {
        try {
          await loadLayerData(layer.name)
        } catch (error) {
          // Revert the active state if loading failed
          setLayers((prev) => prev.map((l) => (l.id === layerId ? { ...l, active: false } : l)))
          console.error(`Failed to activate layer ${layer.name}:`, error)
        }
      }

      // Update summary
      const activeCount = layers.filter((l) => (l.id === layerId ? newActiveState : l.active)).length
      setSummary((prev) => ({ ...prev, activeLayers: activeCount }))
    },
    [layers, loadLayerData],
  )

  // Initialize on mount
  useEffect(() => {
    loadLayers()
  }, [loadLayers])

  return {
    layers,
    layerData,
    loading,
    error,
    summary,
    toggleLayer,
    loadLayerData,
    refreshLayers: loadLayers,
  }
}
