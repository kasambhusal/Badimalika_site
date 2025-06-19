"use client";

import { useState, useEffect } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartMenu } from "./chart-menu";

interface HalfDonutData {
  name: string;
  value: number;
  color?: string;
}

interface HalfDonutChartProps {
  data: HalfDonutData[];
  title?: string;
  className?: string;
}

export function HalfDonutChart({
  data,
  title = "Half Donut Chart",
  className,
}: HalfDonutChartProps) {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const [chartId, setChartId] = useState<string>("");

  useEffect(() => {
    const id = `half-donut-chart-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setChartId(id);
  }, []);

  const chartConfig = data.reduce((config, item, index) => {
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
    ];
    config[item.name] = {
      label: item.name,
      color: item.color || vibrantColors[index % vibrantColors.length],
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>);

  const handleSegmentClick = (data: HalfDonutData) => {
    setActiveSegment(activeSegment === data.name ? null : data.name);
  };

  if (!chartId) return null;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <ChartMenu
          elementId={chartId}
          filename={title.toLowerCase().replace(/\s+/g, "-")}
        />
      </CardHeader>
      <CardContent>
        <div id={chartId} data-chart-id={chartId} className="chart-container">
          <ChartContainer config={chartConfig} className="min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="80%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                  onClick={handleSegmentClick}
                  className="cursor-pointer"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {data.map((entry, index) => {
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
                    ];
                    const baseColor =
                      entry.color ||
                      vibrantColors[index % vibrantColors.length];
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={baseColor}
                        opacity={
                          activeSegment === null || activeSegment === entry.name
                            ? 1
                            : 0.7
                        }
                        stroke={activeSegment === entry.name ? "#000" : "none"}
                        strokeWidth={activeSegment === entry.name ? 2 : 0}
                        className="hover:brightness-90 transition-all duration-200"
                      />
                    );
                  })}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
