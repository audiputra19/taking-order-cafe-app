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
  label?: string;
  height?: number;
}

const MAX_LABEL_LENGTH = 10;
const BarChart: React.FC<CategoryBarChartProps> = ({
  data,
  label,
  height = 300,
}) => {
  const { labels, values } = useMemo(() => {
    const labels = data.map((d) =>
      d.category.length > MAX_LABEL_LENGTH
        ? d.category.slice(0, MAX_LABEL_LENGTH) + "..."
        : d.category
    );
    const values = data.map((d) => d.qty);

    return { labels, values };
  }, [data]);

  const chartData = {
    labels,
    datasets: [
      {
        label,
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
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          // tooltip menampilkan nama kategori penuh
          title: (tooltipItems: any) => {
            const idx = tooltipItems[0].dataIndex;
            return data[idx].category;
          },
        },
      },
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
