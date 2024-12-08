"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { useTheme } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const RepositoriesStarsDistributionChart: React.FC<{
  repos: Array<{ name: string; stars: number }>;
}> = ({ repos }) => {
  const theme = useTheme();

  const countStarsDistribution = (repos: Array<{ stars: number }>) => {
    const distribution: { [key: number]: number } = {};

    repos.forEach((repo) => {
      const stars = repo.stars;
      if (distribution[stars]) {
        distribution[stars] += 1;
      } else {
        distribution[stars] = 1;
      }
    });

    return distribution;
  };

  const distribution = countStarsDistribution(repos);

  const labels = Object.keys(distribution).map((key) => `${key} Stars`);
  const data = Object.values(distribution);

  const generateVividColorsFromTheme = (count: number) => {
    const colors: string[] = [];

    const themeColors = [
      theme.palette.primary.main,
      theme.palette.primary.light,
      theme.palette.primary.dark,
      theme.palette.secondary.main,
      theme.palette.secondary.light,
      theme.palette.secondary.dark,
      theme.palette.success.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.error.main,
    ];

    let index = 0;
    while (colors.length < count) {
      colors.push(themeColors[index % themeColors.length]);
      index++;
    }

    return colors;
  };

  const backgroundColors = generateVividColorsFromTheme(labels.length);

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: backgroundColors,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.label}: ${tooltipItem.raw} repositories`;
          },
        },
      },
    },
  };

  if (repos.length === 0) {
    return (
      <div style={{ width: "100%", height: "100%", marginBottom: 2 }}>
        <h2 style={{ textAlign: "center" }}>No Repositories</h2>
        <p style={{ textAlign: "center", color: "gray" }}>
          There are no repositories with stars to display.
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", marginBottom: 2 }}>
      <h2 style={{ textAlign: "center" }}>Star Distribution by Repository</h2>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default RepositoriesStarsDistributionChart;
