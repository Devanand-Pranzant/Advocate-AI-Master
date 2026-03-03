// components/Charts/LineChart.js
import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

const LineChart = ({
  data,
  themeUtils,
  title,
  height = 300,
  showLegend = true,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!data || !data.labels || !data.datasets) return;

    const renderChart = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Chart dimensions
      const margin = { top: 40, right: 60, bottom: 60, left: 60 };
      const chartWidth = width - margin.left - margin.right;
      const chartHeight = height - margin.top - margin.bottom;

      // Get all data points
      const allDataPoints = data.datasets.flatMap((dataset) => dataset.data);
      const maxValue = Math.max(...allDataPoints);
      const minValue = Math.min(...allDataPoints);

      // Add padding to y-axis
      const yMax = maxValue * 1.1;
      const yMin = minValue > 0 ? 0 : minValue * 1.1;

      // Draw chart area
      ctx.fillStyle = themeUtils?.getBgColor("card") || "#ffffff";
      ctx.fillRect(margin.left, margin.top, chartWidth, chartHeight);

      // Draw grid
      ctx.strokeStyle = themeUtils?.getTextColor(false, true) || "#e5e7eb";
      ctx.lineWidth = 1;

      // Vertical grid lines
      const xStep = chartWidth / (data.labels.length - 1);
      for (let i = 0; i < data.labels.length; i++) {
        const x = margin.left + i * xStep;
        ctx.beginPath();
        ctx.moveTo(x, margin.top);
        ctx.lineTo(x, margin.top + chartHeight);
        ctx.stroke();
      }

      // Horizontal grid lines (5 lines)
      for (let i = 0; i <= 5; i++) {
        const y = margin.top + (i / 5) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(margin.left + chartWidth, y);
        ctx.stroke();
      }

      // Draw axes
      ctx.strokeStyle = themeUtils?.getTextColor(false) || "#374151";
      ctx.lineWidth = 2;

      // X-axis
      ctx.beginPath();
      ctx.moveTo(margin.left, margin.top + chartHeight);
      ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight);
      ctx.stroke();

      // Y-axis
      ctx.beginPath();
      ctx.moveTo(margin.left, margin.top);
      ctx.lineTo(margin.left, margin.top + chartHeight);
      ctx.stroke();

      // Draw x-axis labels
      ctx.fillStyle = themeUtils?.getTextColor(false) || "#374151";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      data.labels.forEach((label, i) => {
        const x = margin.left + i * xStep;
        const y = margin.top + chartHeight + 10;
        ctx.fillText(label, x, y);
      });

      // Draw y-axis labels
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";

      for (let i = 0; i <= 5; i++) {
        const value = yMin + (i / 5) * (yMax - yMin);
        const y = margin.top + chartHeight - (i / 5) * chartHeight;
        const label = formatYAxisLabel(value);
        ctx.fillText(label, margin.left - 10, y);
      }

      // Draw data lines and points
      data.datasets.forEach((dataset, datasetIndex) => {
        // Draw line
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = dataset.borderColor || getColor(datasetIndex);
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        dataset.data.forEach((value, i) => {
          const x = margin.left + i * xStep;
          const y =
            margin.top +
            chartHeight -
            ((value - yMin) / (yMax - yMin)) * chartHeight;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });

        ctx.stroke();

        // Draw points
        dataset.data.forEach((value, i) => {
          const x = margin.left + i * xStep;
          const y =
            margin.top +
            chartHeight -
            ((value - yMin) / (yMax - yMin)) * chartHeight;

          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fillStyle = themeUtils?.getBgColor("card") || "#ffffff";
          ctx.fill();
          ctx.strokeStyle = dataset.borderColor || getColor(datasetIndex);
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw value label on hover
          ctx.fillStyle = themeUtils?.getTextColor(false) || "#374151";
          ctx.font = "bold 12px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillText(formatValue(value), x, y - 10);
        });
      });

      // Draw legend
      if (showLegend) {
        drawLegend(ctx, width, margin, data);
      }

      // Draw title
      if (title) {
        ctx.fillStyle = themeUtils?.getTextColor(true) || "#111827";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(title, width / 2, 10);
      }
    };

    const drawLegend = (ctx, width, margin, data) => {
      const legendX = margin.left;
      const legendY = margin.top - 30;
      const itemWidth = 120;

      data.datasets.forEach((dataset, index) => {
        const x = legendX + index * itemWidth;

        // Draw color line
        ctx.beginPath();
        ctx.moveTo(x, legendY + 8);
        ctx.lineTo(x + 30, legendY + 8);
        ctx.strokeStyle = dataset.borderColor || getColor(index);
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw label
        ctx.fillStyle = themeUtils?.getTextColor(false) || "#374151";
        ctx.font = "12px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(
          dataset.label || `Dataset ${index + 1}`,
          x + 40,
          legendY + 8
        );
      });
    };

    const formatYAxisLabel = (value) => {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
      return Math.round(value).toString();
    };

    const formatValue = (value) => {
      if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
      return value.toLocaleString();
    };

    const getColor = (index) => {
      const colors = [
        "#6366f1",
        "#10b981",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#06b6d4",
        "#84cc16",
        "#f97316",
        "#ec4899",
        "#14b8a6",
      ];
      return colors[index % colors.length];
    };

    renderChart();

    // Handle resize
    const handleResize = () => {
      renderChart();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [data, themeUtils, title, height, showLegend]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={height * 2}
        className="w-full h-full"
      />
    </div>
  );
};

LineChart.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        data: PropTypes.arrayOf(PropTypes.number),
        borderColor: PropTypes.string,
        backgroundColor: PropTypes.string,
      })
    ),
  }).isRequired,
  themeUtils: PropTypes.object,
  title: PropTypes.string,
  height: PropTypes.number,
  showLegend: PropTypes.bool,
};

export default LineChart;
