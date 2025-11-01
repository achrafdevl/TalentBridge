import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const chartColors = {
  primary: "#4f46e5",
  secondary: "#7c3aed",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  gradient: {
    start: "#6366f1",
    end: "#8b5cf6",
  },
};

export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "top" as const,
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: 12,
          weight: "normal" as const,
        },
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 12,
      titleFont: {
        size: 14,
        weight: "bold" as const,
      },
      bodyFont: {
        size: 13,
      },
      cornerRadius: 8,
    },
  },
};

export const createBarChartData = (
  similarity: number,
  keywordCoverage?: number
) => {
  const similarityPercent = Math.round(similarity * 100);
  const coveragePercent = keywordCoverage
    ? Math.round(keywordCoverage * 100)
    : 0;

  return {
    labels: ["Similarity Score", "Keyword Coverage"],
    datasets: [
      {
        label: "Match Percentage",
        data: [similarityPercent, coveragePercent],
        backgroundColor: [
          similarityPercent >= 70
            ? chartColors.success
            : similarityPercent >= 50
            ? chartColors.warning
            : chartColors.danger,
          coveragePercent >= 70
            ? chartColors.info
            : coveragePercent >= 50
            ? chartColors.warning
            : chartColors.danger,
        ],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };
};

export const createPieChartData = (
  commonCount: number,
  cvOnly: number,
  jobOnly: number
) => {
  return {
    labels: ["Common Keywords", "CV Only", "Job Only"],
    datasets: [
      {
        data: [commonCount, cvOnly, jobOnly],
        backgroundColor: [
          chartColors.success,
          chartColors.primary,
          chartColors.warning,
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };
};

export const createLineChartData = (
  labels: string[],
  similarityData: number[]
) => {
  return {
    labels,
    datasets: [
      {
        label: "Similarity Trend",
        data: similarityData,
        borderColor: chartColors.primary,
        backgroundColor: chartColors.primary + "20",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: chartColors.primary,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
      },
    ],
  };
};

export const pieChartOptions = {
  ...defaultChartOptions,
  plugins: {
    ...defaultChartOptions.plugins,
    legend: {
      ...defaultChartOptions.plugins.legend,
      position: "bottom" as const,
    },
  },
};

export const barChartOptions = {
  ...defaultChartOptions,
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: function (value: any) {
          return value + "%";
        },
        font: {
          size: 11,
        },
      },
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 11,
        },
      },
    },
  },
};

