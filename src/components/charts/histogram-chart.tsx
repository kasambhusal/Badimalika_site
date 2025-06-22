"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Cell, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartMenu } from "./chart-menu"

interface HistogramData {
  range: string
  frequency: number
  color?: string
}

interface HistogramChartProps {
  data: HistogramData[]
  title?: string
  yAxisLabel?: string
  className?: string
}

export function HistogramChart({
  data,
  title = "Histogram",
  yAxisLabel = "Frequency",
  className,
}: HistogramChartProps) {
  const [activeBar, setActiveBar] = useState<string | null>(null)
  const [chartId, setChartId] = useState<string>("")

  useEffect(() => {
    const id = `histogram-chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    setChartId(id)
  }, [])

  const vibrantColors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#EC4899",
    "#6366F1",
  ]

  const chartConfig = data.reduce(
    (config, item, index) => {
      config[item.range] = {
        label: item.range,
        color: item.color || vibrantColors[index % vibrantColors.length],
      }
      return config
    },
    {} as Record<string, { label: string; color: string }>,
  )

  const handleBarClick = (data: HistogramData) => {
    setActiveBar(activeBar === data.range ? null : data.range)
  }

  if (!chartId) return null

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm sm:text-base font-medium truncate">{title}</CardTitle>
        <ChartMenu elementId={chartId} filename={title.toLowerCase().replace(/\s+/g, "-")} />
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <div id={chartId} data-chart-id={chartId} className="chart-container w-full">
          <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] md:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 10 }}
                  angle={window.innerWidth < 640 ? -45 : 0}
                  textAnchor={window.innerWidth < 640 ? "end" : "middle"}
                  height={window.innerWidth < 640 ? 80 : 60}
                  interval={0}
                />
                <YAxis tick={{ fontSize: 10 }} width={window.innerWidth < 640 ? 40 : 60} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as HistogramData
                      return (
                        <div className="bg-white p-3 border rounded shadow-lg">
                          <p className="font-semibold text-sm">{label}</p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">{yAxisLabel}:</span> {data.frequency}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                  cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                />
                <Bar
                  dataKey="frequency"
                  onClick={handleBarClick}
                  className="cursor-pointer transition-all duration-200"
                  radius={[4, 4, 0, 0]}
                >
                  {data.map((entry, index) => {
                    const barColor = entry.color || vibrantColors[index % vibrantColors.length]
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={barColor}
                        opacity={activeBar === null || activeBar === entry.range ? 1 : 0.7}
                        className="hover:brightness-110 transition-all duration-200"
                      />
                    )
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
