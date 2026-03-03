import React, { useRef, useEffect, useState } from "react";

const PieChart = ({ data, themeUtils, title, height = 160 }) => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Resize handling
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current?.parentElement) {
        const { width, height: containerHeight } = canvasRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width, height: containerHeight });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (canvasRef.current?.parentElement) {
      resizeObserver.observe(canvasRef.current.parentElement);
    }

    return () => {
      window.removeEventListener("resize", updateDimensions);
      resizeObserver.disconnect();
    };
  }, []);

  // Render pie chart on canvas
  useEffect(() => {
    if (!data || !data.labels || !data.datasets || !data.datasets[0]?.data) return;
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    // High DPI support
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    ctx.scale(dpr, dpr);

    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) * 0.75; // Slightly larger for better fill

    ctx.clearRect(0, 0, width, height);

    const values = data.datasets[0].data;
    const total = values.reduce((sum, val) => sum + (val || 0), 0);
    if (total === 0) return;

    let startAngle = -Math.PI / 2; // Start from top (12 o'clock)

    const backgroundColors = data.datasets[0].backgroundColor || [
      "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#f59e0b", "#8b5cf6"
    ];

    values.forEach((value, index) => {
      if (value === 0) return;

      const sliceAngle = (value / total) * 2 * Math.PI;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();

      ctx.fillStyle = backgroundColors[index % backgroundColors.length];
      ctx.fill();

      // White stroke between slices
      ctx.strokeStyle = themeUtils?.getBgColor("card") || "#ffffff";
      ctx.lineWidth = 3;
      ctx.stroke();

      startAngle += sliceAngle;
    });

    // Inner circle for donut effect
    const innerRadius = radius * 0.55;
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = themeUtils?.getBgColor("card") || "#ffffff";
    ctx.fill();

    // Center total text
    if (innerRadius > 30) {
      ctx.fillStyle = themeUtils?.getTextColor(true) || "#1f2937";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("Total", centerX, centerY);

      ctx.font = "bold 16px sans-serif";
      ctx.textBaseline = "top";
      ctx.fillText(total.toLocaleString(), centerX, centerY);
    }
  }, [data, dimensions, themeUtils]);

  // Helper to format large numbers
  const formatValue = (value) => (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value);

  if (!data || !data.labels || !data.datasets?.[0]?.data) {
    return <div className="text-center text-gray-500">No data available</div>;
  }

  const values = data.datasets[0].data;
  const total = values.reduce((a, b) => a + b, 0);
  const backgroundColors = data.datasets[0].backgroundColor || [
    "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#f59e0b"
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {title && (
        <h3
          className="text-sm font-medium mb-3 text-center"
          style={{ color: themeUtils?.getTextColor(true) }}
        >
          {title}
        </h3>
      )}

      {/* Pie Chart Canvas */}
      <div className="relative w-full" style={{ height: `${height}px` }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* Legend Below Pie Chart */}
      <div className="w-full mt-4 grid grid-cols-2 gap-2 text-xs">
        {data.labels.map((label, index) => {
          const value = values[index];
          if (value === 0) return null;

          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

          return (
            <div
              key={index}
              className="flex items-center justify-between px-2 py-1.5 rounded"
              style={{ backgroundColor: themeUtils?.getBgColor("hover") }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: backgroundColors[index % backgroundColors.length] }}
                />
                <span
                  className="truncate max-w-[100px]"
                  style={{ color: themeUtils?.getTextColor(false), fontSize: "0.75rem" }}
                  title={label}
                >
                  {label}
                </span>
              </div>

              <div className="text-right">
                <div
                  className="font-semibold"
                  style={{ color: themeUtils?.getTextColor(true), fontSize: "0.75rem" }}
                >
                  {formatValue(value)}
                </div>
                <div
                  style={{ color: themeUtils?.getTextColor(false, true), fontSize: "0.65rem" }}
                >
                  {percentage}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Summary */}
      <div
        className="w-full mt-3 pt-2 border-t text-center text-xs"
        style={{ borderColor: themeUtils?.getBorderColor() }}
      >
        <span style={{ color: themeUtils?.getTextColor(false, true) }}>
          Total:{" "}
        </span>
        <span className="font-bold" style={{ color: themeUtils?.getTextColor(true) }}>
          {total.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default PieChart;