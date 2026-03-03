import React from "react";

const BarChart = ({ data, themeUtils, title, height = 250 }) => {
  if (!data || !data.labels || !data.datasets?.[0]?.data) {
    return <div className="text-center text-gray-500">No data available</div>;
  }

  const values = data.datasets[0].data;
  const labels = data.labels;
  const maxValue = Math.max(...values);
  const total = values.reduce((a, b) => a + b, 0);
  const average = Math.round(total / values.length);
  const barColor = data.datasets[0].backgroundColor || "#3b82f6";

  const format = (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v);

  const ySteps = 5;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) =>
    Math.round((maxValue / ySteps) * (ySteps - i))
  );

  return (
    <div className="w-full overflow-hidden">
      <h3
        className="text-sm font-semibold mb-4"
        style={{ color: themeUtils.getTextColor(true) }}
      >
        {title}
      </h3>

      <div className="flex">
        {/* Y Axis */}
        <div className="w-[44px] flex flex-col justify-between pr-2">
          {yLabels.map((v, i) => (
            <div
              key={i}
              className="text-xs text-right"
              style={{ color: themeUtils.getTextColor(false, true) }}
            >
              {format(v)}
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="flex-1 relative">
          {/* Grid */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {yLabels.map((_, i) => (
              <div
                key={i}
                className="border-t opacity-30"
                style={{ borderColor: themeUtils.getBorderColor() }}
              />
            ))}
          </div>

          {/* Bars */}
          <div
            className="relative flex items-end justify-center gap-1 sm:gap-3 px-1 sm:px-2"
            style={{ height: `${height}px` }}
          >
            {values.map((value, index) => {
              const barHeight = (value / maxValue) * height;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center w-8 sm:w-12 lg:w-[60px]"
                >
                  <div
                    className="w-full flex flex-col items-center justify-end mb-2"
                    style={{ height: `${height}px` }}
                  >
                    {/* Value on top */}
                    <div
                      className="text-xs font-semibold mb-1"
                      style={{
                        color: themeUtils.getTextColor(false, true),
                        minHeight: "20px",
                        display: "flex",
                        alignItems: "flex-end",
                        paddingBottom: "2px",
                      }}
                    >
                      {format(value)}
                    </div>

                    {/* Bar */}
                    <div
                      className="rounded-t transition-all duration-300 hover:opacity-80 relative group w-6 sm:w-10 lg:w-[55px]"
                      style={{
                        height: `${barHeight}px`,
                        background: barColor,
                        minHeight: "4px",
                      }}
                    >
                      {/* ORIGINAL TOOLTIP (unchanged) */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        {value.toLocaleString()} BTU
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* X Axis */}
      <div className="flex pl-[44px] mt-2">
        <div className="flex-1 flex justify-center gap-1 sm:gap-3">
          {labels.map((label, index) => {
            const date = new Date(label);
            const day = !isNaN(date.getTime())
              ? date.toLocaleDateString("en-US", { weekday: "short" })
              : label;

            return (
              <div
                key={index}
                className="text-xs text-center w-8 sm:w-12 lg:w-[60px]"
                style={{ color: themeUtils.getTextColor(false, true) }}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div
        className="mt-3 pt-2 border-t grid grid-cols-3 text-center text-xs"
        style={{ borderColor: themeUtils.getBorderColor() }}
      >
        <div>
          <div style={{ color: themeUtils.getTextColor(false, true) }}>Total</div>
          <div className="font-bold" style={{ color: themeUtils.getTextColor(true) }}>{format(total)}</div>
        </div>
        <div>
          <div style={{ color: themeUtils.getTextColor(false, true) }}>Avg</div>
          <div className="font-bold" style={{ color: themeUtils.getTextColor(true) }}>{format(average)}</div>
        </div>
        <div>
          <div style={{ color: themeUtils.getTextColor(false, true) }}>Days</div>
          <div className="font-bold" style={{ color: themeUtils.getTextColor(true) }}>{values.length}</div>
        </div>
      </div>
    </div>
  );
};

export default BarChart;
