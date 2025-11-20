import type React from 'react';
import type { GradeData } from '@/utils/grade-map';

interface SimpleBarChartProps {
    data: GradeData[];
}

const getBarColor = (grade: string): string => {
    const lowerGrade = grade.toLowerCase();

    if (['f3', 'f3+', 'f4'].includes(lowerGrade)) {
        return '#10b981'; // Green
    } else if (['f4+', 'f5', 'f5+'].includes(lowerGrade)) {
        return '#f59e0b'; // Orange
    } else if (
        lowerGrade.startsWith('f6a') ||
        lowerGrade.startsWith('f6b') ||
        lowerGrade.startsWith('f6c')
    ) {
        return '#ef4444'; // Red
    } else if (
        lowerGrade.startsWith('f7a') ||
        lowerGrade.startsWith('f7b') ||
        lowerGrade.startsWith('f7c')
    ) {
        return '#000000'; // Black
    } else if (
        lowerGrade.startsWith('f8') ||
        lowerGrade.startsWith('f9')
    ) {
        return '#ffffff'; // White
    } else {
        return '#93c5fd'; // Light Blue (Default)
    }
};

const getBarBorder = (grade: string): string => {
    if (getBarColor(grade) === '#ffffff') {
        return '#000000'; // Black border for white bars
    } else {
        return 'transparent';
    }
};

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return null;
    }

    const maxValue = Math.max(...data.map((item) => item.count));
    const minBarHeight = 32; // Minimum height percentage
    const barWidth = 18; // Fixed width for each bar in pixels
    const chartWidth = data.length * (barWidth + 4); // Total width (bar width + gap)

    return (
        <div
            className="flex items-end h-32 pt-6 gap-1 w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
            style={{
                minWidth: `${chartWidth}px`,
            }}
        >
            {data.map((item) => {
                const heightPercent = Math.max(
                    (item.count / maxValue) * 100,
                    minBarHeight
                );
                const barColor = getBarColor(item.grade);
                const borderColor = getBarBorder(item.grade);

                return (
                    <div
                        key={item.grade}
                        className="relative flex flex-col justify-end items-center"
                        style={{
                            width: `${barWidth}px`,
                            height: `${heightPercent}%`,
                            backgroundColor: barColor,
                            border: `1px solid ${borderColor}`,
                        }}
                    >
                        <div
                            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-white w-full p-[2px] text-center"
                            style={{
                                writingMode: 'vertical-rl',
                                textOrientation: 'mixed',
                            }}
                        >
                            {item.grade}
                        </div>
                        <div
                            className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-semibold"
                            style={{
                                color: barColor === '#ffffff' ? '#000000' : barColor,
                            }}
                        >
                            {item.count}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
