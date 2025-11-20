import type React from "react";

interface SimpleBarChartProps {
  data: { grade: string; count: number }[];
}

// Update the SimpleBarChart component to have a fixed minimum width based on the data
const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map((item) => item.count));
  const minBarHeight = 32; // Adjust this value as needed
  const barWidth = 18; // Fixed width for each bar
  const chartWidth = data.length * (barWidth + 4); // Total width (bar width + gap)

  const getBarColor = (name: string): string => {
    const lowerName = name.toLowerCase();

    if (["f3", "f3+", "f4"].includes(lowerName)) {
      return "#008000"; // Green
    } else if (["f4+", "f5", "f5+"].includes(lowerName)) {
      return "#FFA500"; // Orange
    } else if (
      lowerName.startsWith("f6a") ||
      lowerName.startsWith("f6b") ||
      lowerName.startsWith("f6c")
    ) {
      return "#FF0000"; // Red
    } else if (
      lowerName.startsWith("f7a") ||
      lowerName.startsWith("f7b") ||
      lowerName.startsWith("f7c")
    ) {
      return "#000000"; // Black
    } else if (
      lowerName.startsWith("f8") ||
      lowerName.startsWith("f9") ||
      lowerName.startsWith("f10") ||
      lowerName.startsWith("f11") ||
      lowerName.startsWith("f12") ||
      lowerName.startsWith("f13") ||
      lowerName.startsWith("f14") ||
      lowerName.startsWith("f15")
    ) {
      return "#FFFFFF"; // White
    } else {
      return "#ADD8E6"; // Light Blue (Default)
    }
  };

  const getBarBorder = (name: string): string => {
    if (getBarColor(name) === "#FFFFFF") {
      return "#000000"; // Black border for white bars
    } else {
      return "transparent";
    }
  };

  return (
    <div
      className="flex items-end h-32 pt-6 gap-1 w-full"
      style={{
        minWidth: `${chartWidth}px`, // Set minimum width based on number of bars
        width: `${chartWidth}px`, // Force the width to be fixed
      }}
    >
      {data.map((item) => (
        <div
          key={item.grade}
          className="relative flex flex-col justify-end items-center"
          style={{
            width: `${barWidth}px`,
            height: Math.max((item.count / maxValue) * 100, minBarHeight) + "%", // Apply min height
            backgroundColor: getBarColor(item.grade),
            border: `1px solid ${getBarBorder(item.grade)}`,
          }}
        >
          <div
            className="subpixel-antialiased absolute bottom-0 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs transform -rotate-90 transform-origin-0-0 font-semibold text-white w-full p-[2px]"
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            {item.grade}
          </div>
          <div
            className={`subpixel-antialiased absolute top-[-20px] left-1/2 transform -translate-x-1/2 whitespace-nowrap p-1 text-xs transform -rotate-90 transform-origin-0-0 font-semibold`}
            style={{
              color: getBarColor(item.grade),
            }}
          >
            {item.count}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SimpleBarChart;
