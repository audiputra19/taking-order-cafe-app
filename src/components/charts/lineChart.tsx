import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export type Order = {
  id: string | number;
  createdAt: string; // ISO string
  qty: number;
};

export type RangeType = "last30" | "yearToDate" | "weekly" | "quarterly" | "custom";

interface OrderBarChartProps {
  orders: Order[];
  range: RangeType;
  startDate?: string; // ISO
  endDate?: string; // ISO
  title?: string;
  height?: number;
}

function fmtDate(d: Date) {
  return d.toLocaleDateString();
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function getStartEnd(range: RangeType, startDate?: string, endDate?: string) {
  const today = new Date();
  if (range === "last30") {
    const end = endOfDay(today);
    const start = startOfDay(addDays(end, -29));
    return { start, end };
  }
  if (range === "yearToDate" || range === "quarterly") {
    const start = startOfDay(new Date(today.getFullYear(), 0, 1));
    const end = endOfDay(new Date(today.getFullYear(), 11, 31)); // akhir tahun
    return { start, end };
  }
  if (range === "weekly") {
    const end = endOfDay(today);
    const start = startOfDay(addDays(end, -6));
    return { start, end };
  }
  const s = startDate ? startOfDay(new Date(startDate)) : startOfDay(today);
  const e = endDate ? endOfDay(new Date(endDate)) : endOfDay(today);
  return { start: s, end: e };
}

function bucketPerWeek(orders: Order[], start: Date, end: Date) {
  const buckets: { label: string; start: Date; end: Date; total: number }[] = [];
  let curStart = new Date(start);
  let idx = 1;
  while (curStart <= end) {
    const curEnd = endOfDay(addDays(curStart, 6));
    const actualEnd = curEnd > end ? end : curEnd;
    buckets.push({
      label: `Week ${idx}`,
      start: new Date(curStart),
      end: new Date(actualEnd),
      total: 0,
    });
    curStart = addDays(curEnd, 1);
    idx += 1;
  }

  for (const o of orders) {
    const t = new Date(o.createdAt);
    for (const b of buckets) {
      if (t >= b.start && t <= b.end) {
        b.total += o.qty;
        break;
      }
    }
  }
  return buckets;
}

function bucketPerDay(orders: Order[], start: Date, end: Date) {
  const buckets: { label: string; date: Date; total: number }[] = [];
  let cur = new Date(start);
  while (cur <= end) {
    buckets.push({ label: fmtDate(cur), date: new Date(cur), total: 0 });
    cur = addDays(cur, 1);
  }

  for (const o of orders) {
    const t = new Date(o.createdAt);
    for (const b of buckets) {
      if (t >= startOfDay(b.date) && t <= endOfDay(b.date)) {
        b.total += o.qty;
        break;
      }
    }
  }
  return buckets;
}

function bucketPerMonth(orders: Order[], start: Date, end: Date) {
  const buckets: { label: string; year: number; month: number; total: number }[] = [];
  const sY = start.getFullYear();
  const sM = start.getMonth();
  const eY = end.getFullYear();
  const eM = end.getMonth();
  let y = sY;
  let m = sM;
  while (y < eY || (y === eY && m <= eM)) {
    const label = new Date(y, m, 1).toLocaleString(undefined, {
      month: "short",
      year: "numeric",
    });
    buckets.push({ label, year: y, month: m, total: 0 });
    m += 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
  }

  for (const o of orders) {
    const t = new Date(o.createdAt);
    for (const b of buckets) {
      if (t.getFullYear() === b.year && t.getMonth() === b.month) {
        b.total += o.qty;
        break;
      }
    }
  }
  return buckets;
}

function bucketPerQuarter(orders: Order[], start: Date, end: Date) {
  const buckets: { label: string; year: number; quarter: number; total: number }[] = [];
  const sY = start.getFullYear();
  const eY = end.getFullYear();

  for (let y = sY; y <= eY; y++) {
    for (let q = 1; q <= 4; q++) {
      const startMonth = (q - 1) * 3;
      const endMonth = startMonth + 2;
      const quarterStart = new Date(y, startMonth, 1);
      const quarterEnd = endOfDay(new Date(y, endMonth + 1, 0));
      if (quarterEnd < start || quarterStart > end) continue;

      buckets.push({
        label: `Q${q} ${y}`,
        year: y,
        quarter: q,
        total: 0,
      });
    }
  }

  for (const o of orders) {
    const t = new Date(o.createdAt);
    const q = Math.floor(t.getMonth() / 3) + 1;
    for (const b of buckets) {
      if (t.getFullYear() === b.year && q === b.quarter) {
        b.total += o.qty;
        break;
      }
    }
  }

  return buckets;
}

const LineChart: React.FC<OrderBarChartProps> = ({
  orders,
  range,
  startDate,
  endDate,
  title,
  height = 300,
}) => {
  const { start, end } = getStartEnd(range, startDate, endDate);

  const { labels, data, maxPeriod } = useMemo(() => {
    const filtered = orders.filter((o) => {
      const t = new Date(o.createdAt);
      return t >= start && t <= end;
    });

    let buckets: { label: string; total: number }[] = [];

    if (range === "last30") {
      buckets = bucketPerWeek(filtered, start, end);
    } else if (range === "weekly") {
      buckets = bucketPerDay(filtered, start, end);
    } else if (range === "quarterly") {
      buckets = bucketPerQuarter(filtered, start, end);
    } else {
      buckets = bucketPerMonth(filtered, start, end);
    }

    const max = buckets.reduce(
      (acc, cur) => (cur.total > acc.total ? cur : acc),
      { label: "", total: 0 }
    );

    return {
      labels: buckets.map((b) => b.label),
      data: buckets.map((b) => b.total),
      maxPeriod: max,
    };
  }, [orders, range, start.toISOString(), end.toISOString()]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Orders",
        data,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.3, // bikin garis smooth
        fill: true, 
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: !!title, text: title },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: { stacked: false },
      y: { beginAtZero: true },
    },
  };

  return (
    <div style={{ height }}>
      <Line options={options} data={chartData} />
    </div>
  );
};

export default LineChart;