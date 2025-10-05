import { useMemo, type FC } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export interface DonutData {
  name: string;
  qty: number;
}

interface DonutChartProps {
  orders: DonutData[];
  height: number;
  colors: string[]
}

const DonutChart: FC<DonutChartProps> = ({ orders, height, colors }) => {
  const { labels, values } = useMemo(() => {
    return {
      labels: orders.map((o) => o.name),
      values: orders.map((o) => o.qty),
    };
  }, [orders]);

  const data = {
    labels,
    datasets: [
      {
        label: "Orders",
        data: values,
        backgroundColor: colors,
        borderColor: "white",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "70%",
    plugins: {
      legend: {
        position: "top" as const,
        align: "start" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 15,
          boxWidth: 12,
          boxHeight: 10,
          generateLabels: (chart: any) => {
            const dataset = chart.data.datasets[0];
            const total = dataset.data.reduce((a: number, b: number) => a + b, 0);

            return chart.data.labels.map((label: string, i: number) => {
              const value = dataset.data[i];
              const percentage = Math.round((value / total) * 100);
              return {
                text: `\u00A0\u00A0${percentage}% - ${label}`,
                fillStyle: dataset.backgroundColor[i],
                strokeStyle: "#FFFFFF",
                lineWidth: 1, 
                pointStyle: "circle",
                fontColor: "oklch(55.1% 0.027 264.364)"
              };
            });
          },
        },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Doughnut
        data={data}
        options={{
          ...options,
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
};

export default DonutChart;
