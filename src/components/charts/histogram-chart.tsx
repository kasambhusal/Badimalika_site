"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
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
  xAxisLabel?: string
  yAxisLabel?: string
  className?: string
}

export function HistogramChart({
  data,
  title = "Histogram",
  xAxisLabel = "Range",
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
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <ChartMenu elementId={chartId} filename={title.toLowerCase().replace(/\s+/g, "-")} />
      </CardHeader>
      <CardContent>
        <div id={chartId} data-chart-id={chartId} className="chart-container">
          <ChartContainer config={chartConfig} className="min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: xAxisLabel,
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  label={{
                    value: yAxisLabel,
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <ChartTooltip
                  content={(props) => {
                    const payload = props?.payload as Array<{ payload: HistogramData }> | undefined
                    return (
                      <ChartTooltipContent>
                        {payload && payload.length > 0 ? (
                          <>
                            <p className="font-bold">{payload[0].payload.range}</p>
                            <p className="text-sm text-muted-foreground">
                              Frequency: {payload[0].payload.frequency}
                            </p>
                          </>
                        ) : null}
                      </ChartTooltipContent>
                    )
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
                        className="hover:brightness-90 transition-all duration-200"
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
