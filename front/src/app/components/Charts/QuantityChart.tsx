"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { useTheme } from "@mui/material";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

const RepositoriesChart: React.FC<{ repositories: number }> = ({
  repositories,
}) => {
  const labels = ["Repositories"];
  const theme = useTheme();

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Number of Repositories",
        data: [repositories],
        backgroundColor: theme.palette.primary.main,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
    scales: {
      y: {
        title: {
          display: true,
          text: "Number of Repositories",
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `Repositories: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "100%", marginBottom: 2 }}>
      <h2 style={{ textAlign: "center" }}>Number of Repositories</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default RepositoriesChart;
