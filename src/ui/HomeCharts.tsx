import { HistogramChart } from "@/components/charts/histogram-chart";
import { HalfDonutChart } from "@/components/charts/half-donut-chart";
import { PieChartComponent } from "@/components/charts/pie-chart";
import { BarChartComponent } from "@/components/charts/bar-chart";

// Sample data for demonstration
const histogramData = [
  { range: "0-10", frequency: 15 },
  { range: "11-20", frequency: 25 },
  { range: "21-30", frequency: 35 },
  { range: "31-40", frequency: 20 },
  { range: "41-50", frequency: 10 },
];

const pieData = [
  { name: "Education", value: 35 },
  { name: "Healthcare", value: 25 },
  { name: "Infrastructure", value: 20 },
  { name: "Defense", value: 15 },
  { name: "Other", value: 5 },
];

const barData = [
  { category: "Q1", value: 120 },
  { category: "Q2", value: 150 },
  { category: "Q3", value: 180 },
  { category: "Q4", value: 200 },
];

export default function HomeCharts() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Government Data Visualization Dashboard
        </h1>
        <p className="text-gray-600">
          Interactive charts with export functionality
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HistogramChart
          data={histogramData}
          title="Population Distribution"
          xAxisLabel="Age Groups"
          yAxisLabel="Population Count"
        />

        <HalfDonutChart data={pieData} title="Budget Allocation" />

        <PieChartComponent data={pieData} title="Department Spending" />

        <BarChartComponent
          data={barData}
          title="Quarterly Revenue"
          xAxisLabel="Quarter"
          yAxisLabel="Revenue (in millions)"
        />
      </div>
    </div>
  );
}
