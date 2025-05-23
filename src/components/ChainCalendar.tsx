import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  format,
  isSameDay,
  isWithinInterval,
  addDays,
  subDays,
} from "date-fns";

interface ChainCalendarProps {
  habitId?: string;
  habitTitle?: string;
  completedDates?: Date[];
  currentStreak?: number;
  longestStreak?: number;
  chainColor?: "bronze" | "silver" | "gold" | "diamond";
  onDateToggle?: (date: Date) => void;
}

const ChainCalendar = ({
  habitId = "1",
  habitTitle = "Daily Exercise",
  completedDates = [
    new Date(2023, 5, 15),
    new Date(2023, 5, 16),
    new Date(2023, 5, 17),
    new Date(2023, 5, 18),
  ].filter((date) => date && !isNaN(date.getTime())),
  currentStreak = 4,
  longestStreak = 7,
  chainColor = "silver",
  onDateToggle = () => {},
}: ChainCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  // Chain color styles
  const chainColorStyles = {
    bronze: "bg-amber-600",
    silver: "bg-slate-400",
    gold: "bg-yellow-500",
    diamond: "bg-cyan-300",
  };

  // Check if a date is completed
  const isDateCompleted = (date: Date) => {
    return completedDates.some((completedDate) =>
      isSameDay(completedDate, date),
    );
  };

  // Check if a date is part of a chain
  const isPartOfChain = (date: Date) => {
    if (!isDateCompleted(date)) return false;

    // Check if previous or next day is completed to determine if it's part of a chain
    const prevDay = subDays(date, 1);
    const nextDay = addDays(date, 1);

    return isDateCompleted(prevDay) || isDateCompleted(nextDay);
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onDateToggle(date);
    }
  };

  // Custom day renderer for the calendar
  const renderDay = (day: Date) => {
    // Check if day is a valid Date object
    if (!day || isNaN(day.getTime())) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          -
        </div>
      );
    }

    const isCompleted = isDateCompleted(day);
    const isChained = isPartOfChain(day);
    const isPrevDayCompleted = isDateCompleted(subDays(day, 1));
    const isNextDayCompleted = isDateCompleted(addDays(day, 1));

    return (
      <div
        className={`relative w-full h-full flex items-center justify-center ${isCompleted ? chainColorStyles[chainColor] : ""}`}
      >
        {/* Left connector */}
        {isCompleted && isPrevDayCompleted && (
          <div
            className={`absolute left-0 w-1/2 h-1 ${chainColorStyles[chainColor]}`}
          ></div>
        )}

        {/* Right connector */}
        {isCompleted && isNextDayCompleted && (
          <div
            className={`absolute right-0 w-1/2 h-1 ${chainColorStyles[chainColor]}`}
          ></div>
        )}

        {/* Circle background */}
        {isCompleted && (
          <div
            className={`absolute inset-0 ${chainColorStyles[chainColor]} rounded-full transform scale-75`}
          ></div>
        )}

        <div className={`z-10 ${isCompleted ? "text-white font-bold" : ""}`}>
          {format(day, "d")}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl bg-white shadow-lg">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">{habitTitle} Chain</CardTitle>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="border-2 border-primary">
                    Current: {currentStreak} days
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your current streak</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="outline"
                    className="border-2 border-secondary"
                  >
                    Best: {longestStreak} days
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your longest streak</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    className={`${chainColorStyles[chainColor]} text-white`}
                  >
                    {chainColor.charAt(0).toUpperCase() + chainColor.slice(1)}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your current chain level</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md border"
              components={{
                Day: ({ day, ...props }) => {
                  // Validate day before rendering
                  if (!day || isNaN(day.getTime())) {
                    return <div className="w-9 h-9 p-0">-</div>;
                  }
                  return (
                    <button
                      {...props}
                      className={`w-9 h-9 p-0 ${isDateCompleted(day) ? "bg-opacity-90" : ""}`}
                    >
                      {renderDay(day)}
                    </button>
                  );
                },
              }}
            />
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full ${chainColorStyles.bronze}`}
              ></div>
              <span className="text-sm">Bronze (3-9 days)</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full ${chainColorStyles.silver}`}
              ></div>
              <span className="text-sm">Silver (10-29 days)</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full ${chainColorStyles.gold}`}
              ></div>
              <span className="text-sm">Gold (30-99 days)</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full ${chainColorStyles.diamond}`}
              ></div>
              <span className="text-sm">Diamond (100+ days)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChainCalendar;
