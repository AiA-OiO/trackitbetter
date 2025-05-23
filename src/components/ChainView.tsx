import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ChainViewProps {
  completedDates?: Date[];
  chainColor?: "bronze" | "silver" | "gold" | "diamond";
  onDateToggle?: (date: Date) => void;
}

const ChainView = ({
  completedDates = [],
  chainColor = "silver",
  onDateToggle = () => {},
}: ChainViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Chain color styles
  const chainColorStyles = {
    bronze: "bg-amber-600",
    silver: "bg-slate-400",
    gold: "bg-yellow-500",
    diamond: "bg-cyan-300",
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

  // Handle date click
  const handleDateClick = (date: Date) => {
    onDateToggle(date);
  };

  return (
    <Card className="w-full bg-white">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium">
            {format(currentMonth, "MMMM yyyy")}
          </h3>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap">
          {daysInMonth.map((day, index) => {
            const isCompleted = isDateCompleted(day);
            const isPrevDayCompleted =
              index > 0 && isDateCompleted(daysInMonth[index - 1]);
            const isNextDayCompleted =
              index < daysInMonth.length - 1 &&
              isDateCompleted(daysInMonth[index + 1]);

            return (
              <div
                key={day.toISOString()}
                className="relative w-full h-12 flex items-center border-b border-gray-100"
              >
                <div className="w-10 text-center text-sm text-gray-500">
                  {format(day, "d")}
                </div>

                <div className="flex-1 h-6 relative flex items-center">
                  {/* The chain line */}
                  <div className="absolute left-0 right-0 h-1 bg-gray-100"></div>

                  {/* Completed day marker */}
                  {isCompleted && (
                    <div
                      className={`absolute w-6 h-6 rounded-full ${chainColorStyles[chainColor]} z-10`}
                      style={{ left: "calc(50% - 12px)" }}
                      onClick={() => handleDateClick(day)}
                    ></div>
                  )}

                  {/* Left connector */}
                  {isCompleted && isPrevDayCompleted && (
                    <div
                      className={`absolute left-0 w-1/2 h-1 ${chainColorStyles[chainColor]}`}
                    ></div>
                  )}

                  {/* Right connector */}
                  {isCompleted && isNextDayCompleted && (
                    <div
                      className={`absolute left-1/2 w-1/2 h-1 ${chainColorStyles[chainColor]}`}
                    ></div>
                  )}
                </div>

                <div className="w-20 text-right pr-2 text-xs text-gray-400">
                  {format(day, "EEE")}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChainView;
