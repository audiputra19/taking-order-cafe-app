import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export type CategoryOrder = {
  category: string;
  qty: number;
};

interface CategoryBarChartProps {
  data: CategoryOrder[];
  height?: number;
}

const BarChart: React.FC<CategoryBarChartProps> = ({
  data,
  height = 300,
}) => {
  const { labels, values, maxCategory } = useMemo(() => {
    const labels = data.map((d) => d.category);
    const values = data.map((d) => d.qty);

    const maxCategory = data.reduce(
      (acc, cur) => (cur.qty > acc.qty ? cur : acc),
      { category: "", qty: 0 }
    );

    return { labels, values, maxCategory };
  }, [data]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Orders",
        data: values,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        borderRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: { ticks: { font: { size: 12 } } },
      y: { beginAtZero: true },
    },
  };

  return (
    <div style={{ height }}>
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default BarChart;
