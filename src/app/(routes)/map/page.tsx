"use client"

import type React from "react"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Building,
  Droplets,
  Mountain,
  Car,
  Home,
  MapIcon,
  Layers,
  Search,
  Info,
  RefreshCw,
  AlertCircle,
  Loader2,
  Menu,
  X,
  Settings,
  MapPin,
} from "lucide-react"
import { useMapData } from "@/hooks/use-map-data"

// Dynamic import to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/ui/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 text-blue-600 animate-spin" />
        <p className="text-sm sm:text-base text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
})

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  building: <Building className="h-4 w-4" />,
  droplets: <Droplets className="h-4 w-4" />,
  mountain: <Mountain className="h-4 w-4" />,
  car: <Car className="h-4 w-4" />,
  home: <Home className="h-4 w-4" />,
  map: <MapIcon className="h-4 w-4" />,
  circle: <div className="w-4 h-4 rounded-full bg-current" />,
}

export default function MapPage() {
  const { layers, layerData, loading, error, summary, toggleLayer, refreshLayers } = useMapData()

  const [searchTerm, setSearchTerm] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      // On desktop, always show sidebar
      if (!mobile) {
        setSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const filteredLayers = layers.filter(
    (layer) =>
      layer.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      layer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      layer.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const activeLayers = layers.filter((layer) => layer.active)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 text-blue-600 animate-spin" />
          <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Loading Haripur Municipality Map</h2>
          <p className="text-sm sm:text-base text-gray-600">Connecting to local government servers...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 text-red-500" />
              <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Connection Error</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4">{error}</p>
              <Button onClick={refreshLayers} className="w-full bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Connection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm px-4 py-3 relative z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Button */}
            {isMobile && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSidebar}
                className="h-9 w-9 p-0 border-gray-300 hover:bg-gray-50"
              >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                <span className="sr-only">Toggle menu</span>
              </Button>
            )}

            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              <div>
                <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900">Haripur Municipality Map</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Interactive GIS mapping system</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshLayers}
              className="h-8 px-3 text-xs sm:text-sm border-gray-300 hover:bg-gray-50"
            >
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <div className="hidden sm:flex items-center gap-2">
              <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                <Layers className="h-3 w-3 mr-1" />
                {summary.activeLayers} Active
              </Badge>
              <Badge variant="outline" className="text-xs border-green-200 text-green-700 hidden md:flex">
                <Info className="h-3 w-3 mr-1" />
                {summary.totalFeatures} Features
              </Badge>
            </div>
          </div>
        </div>

        {/* Mobile Stats */}
        {isMobile && (
          <div className="flex mt-2 space-x-2">
            <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
              <Layers className="h-3 w-3 mr-1" />
              {summary.activeLayers} Active
            </Badge>
            <Badge variant="outline" className="text-xs border-green-200 text-green-700">
              <Info className="h-3 w-3 mr-1" />
              {summary.totalFeatures} Features
            </Badge>
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
            onClick={closeSidebar}
            style={{ top: "0", left: "0", right: "0", bottom: "0" }}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            ${isMobile ? "fixed top-0 left-0 h-full" : "relative"} 
            ${isMobile && sidebarOpen ? "translate-x-0" : isMobile ? "-translate-x-full" : "translate-x-0"}
            w-80 sm:w-96 lg:w-80 xl:w-96 bg-white border-r border-gray-200 flex flex-col overflow-hidden
            transition-transform duration-300 ease-in-out shadow-lg
            ${isMobile ? "z-[9999]" : "z-10"}
          `}
        >
          {/* Mobile Sidebar Header */}
          {isMobile && (
            <div className="flex items-center justify-between p-4 border-b bg-blue-50 border-blue-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-blue-600" />
                Map Layers
              </h2>
              <Button variant="ghost" size="sm" onClick={closeSidebar} className="h-8 w-8 p-0 hover:bg-blue-100">
                <X className="h-4 w-4" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
          )}

          {/* Search */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search layers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Layer Controls */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Layers className="h-4 w-4 mr-2 text-blue-600" />
                Available Layers ({layers.length})
              </h3>

              {filteredLayers.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">No layers found</p>
                  <p className="text-xs text-gray-400 mt-1">Try adjusting your search terms</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLayers.map((layer) => {
                    const config =
                      {
                        bdpt: "building",
                        hydro: "droplets",
                        hydro_ln: "droplets",
                        landc: "mountain",
                        topog: "mountain",
                        trans: "car",
                        village: "home",
                        wardmap: "map",
                      }[layer.name] || "circle"

                    return (
                      <Card
                        key={layer.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                          layer.active
                            ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200"
                            : "border-gray-200 hover:border-gray-300"
                        } ${layer.loading ? "opacity-75 cursor-not-allowed" : ""}`}
                        onClick={() => {
                          if (!layer.loading) {
                            toggleLayer(layer.id)
                            if (isMobile) {
                              // Close sidebar after selection on mobile
                              setTimeout(() => setSidebarOpen(false), 500)
                            }
                          }
                        }}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div
                                className="p-2 rounded-lg relative flex-shrink-0"
                                style={{ backgroundColor: `${layer.color}20`, color: layer.color }}
                              >
                                {layer.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : iconMap[config]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 truncate">{layer.displayName}</h4>
                                <p className="text-xs text-gray-500 truncate">
                                  {layer.description || `${layer.name} layer data`}
                                </p>
                                {layer.error && <p className="text-xs text-red-500 truncate mt-1">⚠️ {layer.error}</p>}
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                              <Badge
                                variant={layer.active ? "default" : "secondary"}
                                className={`text-xs ${
                                  layer.active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {layer.loading ? "Loading..." : layer.active ? "ON" : "OFF"}
                              </Badge>
                              {layer.featureCount > 0 && (
                                <span className="text-xs text-gray-400">{layer.featureCount} items</span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center text-gray-900">
                  <Info className="h-4 w-4 mr-2 text-blue-600" />
                  Map Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Layers:</span>
                    <span className="font-medium text-gray-900">{summary.totalLayers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Layers:</span>
                    <span className="font-medium text-blue-600">{summary.activeLayers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Features:</span>
                    <span className="font-medium text-green-600">{summary.totalFeatures}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative bg-gray-100 z-0">
          <MapComponent activeLayers={activeLayers} layerData={layerData} />

          {/* Floating Action Button for Mobile */}
          {isMobile && !sidebarOpen && (
            <Button
              onClick={toggleSidebar}
              className="fixed bottom-6 left-6 z-[100] h-14 w-14 rounded-full shadow-xl bg-blue-600 hover:bg-blue-700 border-2 border-white"
              size="sm"
            >
              <Layers className="h-6 w-6 text-white" />
              <span className="sr-only">Open layers menu</span>
            </Button>
          )}

          {/* Legend */}
          {activeLayers.length > 0 && (
            <div className="absolute top-4 right-4 z-20">
              <Card className="w-48 sm:w-64 shadow-lg border-gray-200 bg-white/95 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs sm:text-sm text-gray-900">Active Layers</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {activeLayers.slice(0, 5).map((layer) => (
                      <div key={layer.id} className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                          style={{ backgroundColor: layer.color }}
                        />
                        <span className="text-xs text-gray-700 truncate">{layer.displayName}</span>
                        {layer.featureCount > 0 && (
                          <span className="text-xs text-gray-500 flex-shrink-0">({layer.featureCount})</span>
                        )}
                      </div>
                    ))}
                    {activeLayers.length > 5 && (
                      <div className="text-xs text-gray-500 text-center pt-1 border-t border-gray-200">
                        +{activeLayers.length - 5} more layers
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* No layers message */}
          {activeLayers.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm p-4">
              <Card className="w-full max-w-sm shadow-lg border-gray-200">
                <CardContent className="pt-6 text-center">
                  <Layers className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">No Active Layers</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {isMobile
                      ? "Tap the layers button to select map data to display"
                      : "Select layers from the sidebar to view map data"}
                  </p>
                  {isMobile && (
                    <Button onClick={toggleSidebar} className="bg-blue-600 hover:bg-blue-700">
                      <Layers className="h-4 w-4 mr-2" />
                      Open Layers Menu
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
