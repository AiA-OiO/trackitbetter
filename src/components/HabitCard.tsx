import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, CheckCircle2, TrendingUp } from "lucide-react";

interface HabitCardProps {
  id?: string;
  title?: string;
  description?: string;
  currentStreak?: number;
  longestStreak?: number;
  chainColor?: "bronze" | "silver" | "gold" | "diamond";
  lastUpdated?: Date;
  completedToday?: boolean;
  onClick?: () => void;
}

const getChainColorClass = (chainColor: HabitCardProps["chainColor"]) => {
  switch (chainColor) {
    case "bronze":
      return "bg-amber-600";
    case "silver":
      return "bg-slate-400";
    case "gold":
      return "bg-yellow-400";
    case "diamond":
      return "bg-blue-300";
    default:
      return "bg-gray-300";
  }
};

const getChainLabel = (chainColor: HabitCardProps["chainColor"]) => {
  return chainColor
    ? chainColor.charAt(0).toUpperCase() + chainColor.slice(1)
    : "New";
};

const HabitCard = ({
  id = "1",
  title = "Daily Meditation",
  description = "Meditate for at least 10 minutes every day",
  currentStreak = 7,
  longestStreak = 14,
  chainColor = "bronze",
  lastUpdated = new Date(),
  completedToday = false,
  onClick = () => {},
}: HabitCardProps) => {
  const formattedDate =
    lastUpdated && !isNaN(lastUpdated.getTime())
      ? lastUpdated.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "Not set";

  // Calculate progress percentage for visual indicator
  // Assuming bronze is 0-14 days, silver is 15-29, gold is 30-59, diamond is 60+
  let progressPercentage = 0;
  if (chainColor === "bronze") {
    progressPercentage = (currentStreak / 15) * 100;
  } else if (chainColor === "silver") {
    progressPercentage = (currentStreak / 30) * 100;
  } else if (chainColor === "gold") {
    progressPercentage = (currentStreak / 60) * 100;
  } else if (chainColor === "diamond") {
    progressPercentage = 100;
  }

  return (
    <Card
      className="w-full max-w-sm bg-white hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
          <Badge
            variant="outline"
            className={`${getChainColorClass(chainColor)} text-white`}
          >
            {getChainLabel(chainColor)} Chain
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 mb-4">{description}</p>

        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">
            Current streak: {currentStreak} days
          </span>
        </div>

        <div className="mb-4">
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            <span>Last: {formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>Best: {longestStreak} days</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 border-t border-gray-100">
        <div className="w-full flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {completedToday ? "Completed today" : "Not completed today"}
          </span>
          {completedToday && (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default HabitCard;
