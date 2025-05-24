import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isSameDay,
  addMonths,
  subMonths,
  differenceInDays,
  isToday,
} from "date-fns";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Target,
  TrendingUp,
} from "lucide-react";

interface ChainViewProps {
  completedDates?: Date[];
  chainColor?: "bronze" | "silver" | "gold" | "diamond";
  onDateToggle?: (date: Date) => void;
  currentStreak?: number;
  longestStreak?: number;
  habitTitle?: string;
}

const ChainView = ({
  completedDates = [],
  chainColor = "silver",
  onDateToggle = () => {},
  currentStreak = 0,
  longestStreak = 0,
  habitTitle = "Habit Progress",
}: ChainViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

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

  // Get all days in the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Calculate progress metrics
  const completedThisMonth = daysInMonth.filter((day) =>
    isDateCompleted(day),
  ).length;
  const progressPercentage = (completedThisMonth / daysInMonth.length) * 100;

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
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={prevMonth}
            className="hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <CardTitle className="text-xl font-bold">
              {format(currentMonth, "MMMM yyyy")}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">{habitTitle}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={nextMonth}
            className="hover:bg-gray-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
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
              {completedThisMonth}
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
            <span className="text-sm font-medium text-gray-600">
              Monthly Progress
            </span>
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
        <div className="space-y-1">
          {daysInMonth.map((day, index) => {
            const isCompleted = isDateCompleted(day);
            const isPrevDayCompleted =
              index > 0 && isDateCompleted(daysInMonth[index - 1]);
            const isNextDayCompleted =
              index < daysInMonth.length - 1 &&
              isDateCompleted(daysInMonth[index + 1]);
            const isTodayDate = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`relative w-full h-14 flex items-center rounded-lg transition-all duration-200 hover:bg-gray-50 ${
                  isTodayDate
                    ? "bg-blue-50 border border-blue-200"
                    : "border border-transparent"
                }`}
              >
                <div className="w-12 text-center">
                  <div
                    className={`text-lg font-bold ${
                      isTodayDate
                        ? "text-blue-600"
                        : isCompleted
                          ? "text-gray-900"
                          : "text-gray-400"
                    }`}
                  >
                    {format(day, "d")}
                  </div>
                  <div className="text-xs text-gray-400">
                    {format(day, "EEE")}
                  </div>
                </div>

                <div className="flex-1 h-8 relative flex items-center mx-4">
                  {/* Base chain line */}
                  <div className="absolute left-0 right-0 h-2 bg-gray-200 rounded-full"></div>

                  {/* Completed day marker with enhanced styling */}
                  {isCompleted && (
                    <div
                      className={`absolute w-8 h-8 rounded-full ${chainColorStyles[chainColor].bg} ${chainColorStyles[chainColor].glow} z-20 cursor-pointer transform hover:scale-110 transition-transform duration-200 flex items-center justify-center`}
                      style={{ left: "calc(50% - 16px)" }}
                      onClick={() => handleDateClick(day)}
                    >
                      <div className="w-3 h-3 bg-white rounded-full opacity-80"></div>
                    </div>
                  )}

                  {/* Enhanced connectors */}
                  {isCompleted && isPrevDayCompleted && (
                    <div
                      className={`absolute left-0 w-1/2 h-2 ${chainColorStyles[chainColor].bg} rounded-l-full z-10`}
                    ></div>
                  )}

                  {isCompleted && isNextDayCompleted && (
                    <div
                      className={`absolute left-1/2 w-1/2 h-2 ${chainColorStyles[chainColor].bg} rounded-r-full z-10`}
                    ></div>
                  )}

                  {/* Today indicator */}
                  {isTodayDate && !isCompleted && (
                    <div
                      className="absolute w-6 h-6 rounded-full border-2 border-blue-400 bg-white z-20 cursor-pointer hover:bg-blue-50 transition-colors duration-200"
                      style={{ left: "calc(50% - 12px)" }}
                      onClick={() => handleDateClick(day)}
                    ></div>
                  )}
                </div>

                <div className="w-16 text-right pr-2">
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
