import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format, isSameDay, differenceInDays, isToday } from "date-fns";
import { Flame, Target, TrendingUp } from "lucide-react";

interface ChainViewProps {
  completedDates?: Date[];
  chainColor?: "bronze" | "silver" | "gold" | "diamond";
  onDateToggle?: (date: Date) => void;
  currentStreak?: number;
  longestStreak?: number;
  habitTitle?: string;
  dateRange?: { start: Date; end: Date };
}

const ChainView = ({
  completedDates = [],
  chainColor = "silver",
  onDateToggle = () => {},
  currentStreak = 0,
  longestStreak = 0,
  habitTitle = "Habit Progress",
  dateRange = {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date(),
  },
}: ChainViewProps) => {
  // Chain color styles with gradients and glow effects
  const chainColorStyles = {
    bronze: {
      bg: "bg-gradient-to-r from-amber-600 to-amber-700",
      glow: "shadow-lg shadow-amber-500/50",
      text: "text-amber-100",
      border: "border-amber-500",
      light: "bg-amber-100",
    },
    silver: {
      bg: "bg-gradient-to-r from-slate-400 to-slate-500",
      glow: "shadow-lg shadow-slate-400/50",
      text: "text-slate-100",
      border: "border-slate-400",
      light: "bg-slate-100",
    },
    gold: {
      bg: "bg-gradient-to-r from-yellow-400 to-yellow-500",
      glow: "shadow-lg shadow-yellow-400/50",
      text: "text-yellow-900",
      border: "border-yellow-400",
      light: "bg-yellow-100",
    },
    diamond: {
      bg: "bg-gradient-to-r from-cyan-300 to-blue-400",
      glow: "shadow-lg shadow-cyan-300/50",
      text: "text-cyan-900",
      border: "border-cyan-300",
      light: "bg-cyan-100",
    },
  };

  // Generate date range for display
  const generateDateRange = () => {
    const dates = [];
    const currentDate = new Date(dateRange.start);
    while (currentDate <= dateRange.end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const allDates = generateDateRange();

  // Check if a date is completed
  const isDateCompleted = (date: Date) => {
    if (!date || isNaN(date.getTime())) return false;
    return completedDates.some(
      (completedDate) =>
        completedDate &&
        !isNaN(completedDate.getTime()) &&
        isSameDay(completedDate, date),
    );
  };

  // Calculate progress metrics
  const completedInRange = allDates.filter((day) =>
    isDateCompleted(day),
  ).length;
  const progressPercentage = (completedInRange / allDates.length) * 100;

  // Create zig-zag rows with alternating 4 and 3 days
  const createZigZagRows = () => {
    const rows = [];
    let currentIndex = 0;
    let isEvenRow = true;

    while (currentIndex < allDates.length) {
      const daysInRow = isEvenRow ? 4 : 3;
      const rowDates = allDates.slice(currentIndex, currentIndex + daysInRow);
      if (rowDates.length > 0) {
        rows.push({ dates: rowDates, isEvenRow });
      }
      currentIndex += daysInRow;
      isEvenRow = !isEvenRow;
    }

    return rows;
  };

  const zigZagRows = createZigZagRows();

  // Calculate consecutive streaks in current month
  const getStreakInfo = () => {
    const sortedDates = completedDates.sort(
      (a, b) => a.getTime() - b.getTime(),
    );
    let streaks = [];
    let currentStreakStart = null;
    let currentStreakEnd = null;

    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = sortedDates[i];
      const prevDate = sortedDates[i - 1];

      if (!prevDate || differenceInDays(currentDate, prevDate) > 1) {
        // Start new streak
        if (currentStreakStart && currentStreakEnd) {
          streaks.push({ start: currentStreakStart, end: currentStreakEnd });
        }
        currentStreakStart = currentDate;
        currentStreakEnd = currentDate;
      } else {
        // Continue streak
        currentStreakEnd = currentDate;
      }
    }

    if (currentStreakStart && currentStreakEnd) {
      streaks.push({ start: currentStreakStart, end: currentStreakEnd });
    }

    return streaks;
  };

  const streaks = getStreakInfo();

  // Handle date click
  const handleDateClick = (date: Date) => {
    onDateToggle(date);
  };

  return (
    <Card className="w-full bg-white shadow-lg border-0">
      <CardHeader className="pb-4">
        <div className="text-center mb-4">
          <CardTitle className="text-xl font-bold">{habitTitle}</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            {format(dateRange.start, "MMM d")} -{" "}
            {format(dateRange.end, "MMM d, yyyy")}
          </p>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Flame className="h-4 w-4 text-orange-500 mr-1" />
              <span className="text-sm font-medium text-gray-600">Current</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {currentStreak}
            </div>
            <div className="text-xs text-gray-500">days</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-sm font-medium text-gray-600">
                This Month
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {completedInRange}
            </div>
            <div className="text-xs text-gray-500">completed</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-gray-600">Best</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {longestStreak}
            </div>
            <div className="text-xs text-gray-500">days</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <Badge
              variant="outline"
              className={`${chainColorStyles[chainColor].border} ${chainColorStyles[chainColor].text}`}
            >
              {Math.round(progressPercentage)}%
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-6">
          {zigZagRows.map((row, rowIndex) => {
            const isEvenRow = row.isEvenRow;
            return (
              <div key={rowIndex} className="relative">
                <div
                  className={`flex items-center justify-center gap-4 ${
                    isEvenRow ? "" : "ml-16"
                  }`}
                >
                  {row.dates.map((date, dateIndex) => {
                    const isCompleted = isDateCompleted(date);
                    const isTodayDate = isToday(date);
                    const globalIndex =
                      zigZagRows
                        .slice(0, rowIndex)
                        .reduce((acc, r) => acc + r.dates.length, 0) +
                      dateIndex;
                    const prevDate =
                      globalIndex > 0 ? allDates[globalIndex - 1] : null;
                    const nextDate =
                      globalIndex < allDates.length - 1
                        ? allDates[globalIndex + 1]
                        : null;
                    const isPrevCompleted = prevDate
                      ? isDateCompleted(prevDate)
                      : false;
                    const isNextCompleted = nextDate
                      ? isDateCompleted(nextDate)
                      : false;

                    return (
                      <div
                        key={date.toISOString()}
                        className="relative flex flex-col items-center"
                      >
                        {/* Date display */}
                        <div className="text-center mb-2">
                          <div
                            className={`text-sm font-bold ${
                              isTodayDate
                                ? "text-blue-600"
                                : isCompleted
                                  ? "text-gray-900"
                                  : "text-gray-400"
                            }`}
                          >
                            {format(date, "d")}
                          </div>
                          <div className="text-xs text-gray-400">
                            {format(date, "MMM")}
                          </div>
                        </div>

                        {/* Chain node */}
                        <div className="relative">
                          {isCompleted ? (
                            <div
                              className={`w-8 h-8 rounded-full ${chainColorStyles[chainColor].bg} ${chainColorStyles[chainColor].glow} cursor-pointer transform hover:scale-110 transition-transform duration-200 flex items-center justify-center`}
                              onClick={() => handleDateClick(date)}
                            >
                              <div className="w-3 h-3 bg-white rounded-full opacity-80"></div>
                            </div>
                          ) : (
                            <div
                              className={`w-6 h-6 rounded-full border-2 ${
                                isTodayDate
                                  ? "border-blue-400 bg-blue-50"
                                  : "border-gray-300 bg-white"
                              } cursor-pointer hover:bg-gray-50 transition-colors duration-200`}
                              onClick={() => handleDateClick(date)}
                            ></div>
                          )}
                        </div>

                        {/* Status badge */}
                        <div className="mt-2">
                          {isCompleted && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${chainColorStyles[chainColor].border} ${chainColorStyles[chainColor].text}`}
                            >
                              ✓
                            </Badge>
                          )}
                          {isTodayDate && !isCompleted && (
                            <Badge
                              variant="outline"
                              className="text-xs border-blue-400 text-blue-600"
                            >
                              Today
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Connecting lines for zig-zag pattern */}
                {rowIndex < zigZagRows.length - 1 && (
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                    <svg width="200" height="40" className="overflow-visible">
                      <path
                        d={
                          isEvenRow
                            ? "M 0 0 Q 100 20 200 0"
                            : "M 200 0 Q 100 20 0 0"
                        }
                        stroke="#e5e7eb"
                        strokeWidth="2"
                        fill="none"
                        className="transition-colors duration-200"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Chain Legend */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-600 mb-3">
            Chain Levels
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(chainColorStyles).map(([level, styles]) => (
              <div key={level} className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full ${styles.bg} ${styles.glow}`}
                ></div>
                <span className="text-xs text-gray-600 capitalize">
                  {level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChainView;
