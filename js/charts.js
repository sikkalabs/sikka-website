const ChartColors = {
  blue: "#3b82f6",
  yellow: "#fbbf24",
  green: "#22c55e",
  red: "#ef4444",
  orange: "#f97316",
  purple: "#a855f7",
  grid: "rgba(255, 255, 255, 0.06)",
  text: "#71717a",
};

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#1a1a1a",
      borderColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      titleColor: "#fff",
      bodyColor: "#a1a1aa",
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: { color: ChartColors.grid, drawBorder: false },
      ticks: { color: ChartColors.text, font: { size: 10 } },
      border: { display: false },
    },
    y: {
      grid: { color: ChartColors.grid, drawBorder: false },
      ticks: { color: ChartColors.text, font: { size: 10 } },
      border: { display: false },
    },
  },
};

function deepMerge(target, source) {
  const out = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      out[key] = deepMerge(out[key] || {}, source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}

function createLineChart(canvasId, labels, datasets, options = {}) {
  const el = document.getElementById(canvasId);
  if (!el || typeof Chart === "undefined") return null;

  return new Chart(el, {
    type: "line",
    data: { labels, datasets },
    options: deepMerge(chartDefaults, {
      elements: {
        line: { tension: 0.4, borderWidth: 2 },
        point: { radius: 0, hitRadius: 8, hoverRadius: 4 },
      },
      ...options,
    }),
  });
}

function createBarChart(canvasId, labels, data, color = ChartColors.blue, options = {}) {
  const el = document.getElementById(canvasId);
  if (!el || typeof Chart === "undefined") return null;

  return new Chart(el, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: color,
        borderRadius: 4,
        borderSkipped: false,
      }],
    },
    options: deepMerge(chartDefaults, options),
  });
}

function createDoughnutChart(canvasId, data, colors, options = {}) {
  const el = document.getElementById(canvasId);
  if (!el || typeof Chart === "undefined") return null;

  return new Chart(el, {
    type: "doughnut",
    data: {
      labels: data.labels,
      datasets: [{
        data: data.values,
        backgroundColor: colors,
        borderWidth: 0,
        spacing: 2,
      }],
    },
    options: deepMerge({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "75%",
      plugins: {
        legend: { display: false },
        tooltip: chartDefaults.plugins.tooltip,
      },
    }, options),
  });
}

function createGaugeChart(canvasId, value, max = 100) {
  const el = document.getElementById(canvasId);
  if (!el || typeof Chart === "undefined") return null;

  const pct = Math.min(value / max, 1);
  return new Chart(el, {
    type: "doughnut",
    data: {
      datasets: [{
        data: [pct * 100, 100 - pct * 100],
        backgroundColor: [ChartColors.yellow, "rgba(255,255,255,0.06)"],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "82%",
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
    },
  });
}

function initHeroTxChart() {
  return createLineChart("hero-tx-chart", [
    "05:00", "07:00", "09:00", "11:00", "13:00", "15:00", "17:00", "18:00",
  ], [
    {
      label: "DAG Txs",
      data: [1.2, 1.8, 2.4, 3.1, 2.8, 3.5, 2.9, 3.2],
      borderColor: ChartColors.blue,
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      fill: true,
    },
    {
      label: "Tips",
      data: [0.4, 0.5, 0.6, 0.8, 0.7, 0.9, 0.7, 0.8],
      borderColor: ChartColors.yellow,
      backgroundColor: "transparent",
      fill: false,
    },
  ], {
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "start",
        labels: {
          color: ChartColors.text,
          font: { size: 10 },
          boxWidth: 12,
          padding: 8,
        },
      },
    },
    scales: {
      y: { ...chartDefaults.scales.y, max: 4, ticks: { ...chartDefaults.scales.y.ticks, stepSize: 1 } },
    },
  });
}

function initDashboardCharts() {
  createGaugeChart("gauge-network", 78);

  createBarChart("chart-activity", ["10am", "12pm", "2pm", "4pm", "6pm"], [45, 62, 38, 71, 55], ChartColors.blue, {
    scales: {
      y: {
        ...chartDefaults.scales.y,
        max: 80,
        ticks: { ...chartDefaults.scales.y.ticks, callback: v => v + "%" },
      },
    },
  });

  createDoughnutChart("chart-status", {
    labels: ["Open", "In Progress", "Resolved"],
    values: [5, 12, 78],
  }, [ChartColors.red, ChartColors.yellow, ChartColors.blue]);

  createLineChart("chart-pow", ["0s", "60s", "120s", "180s", "240s"], [
    {
      label: "Required bits",
      data: [2, 2, 4, 6, 8],
      borderColor: ChartColors.yellow,
      backgroundColor: "rgba(251, 191, 36, 0.1)",
      fill: true,
    },
  ], {
    scales: {
      y: { ...chartDefaults.scales.y, ticks: { ...chartDefaults.scales.y.ticks, stepSize: 2 } },
    },
  });
}

function initFeaturesCharts() {
  createLineChart("chart-congestion", ["0–59", "60–119", "120–179", "180–239", "240–299"], [
    {
      label: "Expected hashes",
      data: [4, 16, 64, 256, 1024],
      borderColor: ChartColors.blue,
      backgroundColor: "rgba(59, 130, 246, 0.15)",
      fill: true,
    },
  ], {
    scales: {
      y: {
        ...chartDefaults.scales.y,
        type: "logarithmic",
        ticks: { ...chartDefaults.scales.y.ticks, callback: v => v.toLocaleString() },
      },
    },
  });

  createDoughnutChart("chart-crypto", {
    labels: ["ML-DSA-87", "SHA3-256", "Tor"],
    values: [60, 25, 15],
  }, [ChartColors.blue, ChartColors.yellow, ChartColors.green]);
}

function initArchitectureCharts() {
  createBarChart("chart-finality", ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"], [40, 80, 120, 160, 200], ChartColors.green, {
    scales: {
      y: {
        ...chartDefaults.scales.y,
        max: 220,
        ticks: { ...chartDefaults.scales.y.ticks, callback: v => v },
      },
    },
  });

  createDoughnutChart("chart-supply", {
    labels: ["Operators", "Genesis"],
    values: [100, 0],
  }, [ChartColors.blue, "rgba(255,255,255,0.06)"]);
}

function initUseCasesCharts() {
  createBarChart("chart-usecases", ["AI", "Micro", "Escrow", "Identity", "Global", "IoT"], [92, 88, 75, 70, 95, 82], ChartColors.blue);
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("hero-tx-chart")) initHeroTxChart();
  if (document.getElementById("gauge-network")) initDashboardCharts();
  if (document.getElementById("chart-congestion")) initFeaturesCharts();
  if (document.getElementById("chart-finality")) initArchitectureCharts();
  if (document.getElementById("chart-usecases")) initUseCasesCharts();
});