import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Edit,
  Trash2,
  Calendar as CalendarIcon,
  Trophy,
  ArrowLeft,
} from "lucide-react";
import ChainCalendar from "./ChainCalendar";
import ChainView from "./ChainView";

interface HabitDetailProps {
  id?: string;
  title?: string;
  description?: string;
  streak?: number;
  longestStreak?: number;
  startDate?: Date;
  completedDates?: Date[];
  onBack?: () => void;
  onSave?: (habit: any) => void;
  onDelete?: (id: string) => void;
  onCheckCompletion?: (date: Date) => void;
}

const getChainColor = (streak: number) => {
  if (streak >= 30) return "diamond";
  if (streak >= 21) return "gold";
  if (streak >= 14) return "silver";
  if (streak >= 7) return "bronze";
  return "default";
};

const getChainColorClass = (color: string) => {
  switch (color) {
    case "diamond":
      return "bg-blue-300 text-blue-800";
    case "gold":
      return "bg-yellow-300 text-yellow-800";
    case "silver":
      return "bg-gray-300 text-gray-800";
    case "bronze":
      return "bg-amber-600 text-amber-950";
    default:
      return "bg-slate-500 text-slate-50";
  }
};

const HabitDetail = (props: HabitDetailProps) => {
  const {
    id = "1",
    title = "Morning Meditation",
    description = "Meditate for 10 minutes every morning to start the day with clarity and focus.",
    streak = 15,
    longestStreak = 21,
    startDate = new Date(2023, 0, 1),
    completedDates = [
      new Date(),
      new Date(Date.now() - 86400000),
      new Date(Date.now() - 86400000 * 2),
    ],
    onBack = () => {},
    onSave = () => {},
    onDelete = () => {},
    onCheckCompletion = () => {},
  } = props;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [activeTab, setActiveTab] = useState("calendar");

  const chainColor = getChainColor(streak);
  const chainColorClass = getChainColorClass(chainColor);

  const handleSaveEdit = () => {
    onSave({
      id,
      title: editTitle,
      description: editDescription,
    });
    setIsEditDialogOpen(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onCheckCompletion(date);
    }
  };

  const milestones = [
    { days: 7, name: "Bronze Chain", achieved: streak >= 7 },
    { days: 14, name: "Silver Chain", achieved: streak >= 14 },
    { days: 21, name: "Gold Chain", achieved: streak >= 21 },
    { days: 30, name: "Diamond Chain", achieved: streak >= 30 },
  ];

  return (
    <div className="bg-background w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold flex-1">{title}</h1>
        <div className="flex space-x-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Habit</DialogTitle>
                <DialogDescription>
                  Make changes to your habit details here.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title">Title</label>
                  <Input
                    id="title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description">Description</label>
                  <Textarea
                    id="description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your habit and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(id)}
                  className="bg-destructive text-destructive-foreground"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Habit Chain</span>
                <Badge className={chainColorClass}>
                  {chainColor.charAt(0).toUpperCase() + chainColor.slice(1)}{" "}
                  Chain
                </Badge>
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="calendar">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Calendar View
                  </TabsTrigger>
                  <TabsTrigger value="chain">
                    <Trophy className="h-4 w-4 mr-2" />
                    Chain View
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="calendar" className="space-y-4">
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      className="rounded-md border"
                      modifiers={{
                        completed: completedDates,
                      }}
                      modifiersClassNames={{
                        completed:
                          "bg-primary text-primary-foreground font-bold",
                      }}
                    />
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    Click on a date to mark it as completed
                  </div>
                </TabsContent>
                <TabsContent value="chain">
                  <div className="space-y-6">
                    <div className="h-[400px] w-full">
                      <ChainCalendar
                        completedDates={completedDates}
                        chainColor={chainColor}
                        habitTitle={title}
                        currentStreak={streak}
                        longestStreak={longestStreak}
                      />
                    </div>
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-2">
                        Chain Timeline
                      </h3>
                      <ChainView
                        completedDates={completedDates}
                        chainColor={chainColor}
                        onDateToggle={handleDateSelect}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Streak</span>
                <span className="text-2xl font-bold">{streak} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Longest Streak</span>
                <span className="text-xl font-semibold">
                  {longestStreak} days
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Started</span>
                <span>
                  {startDate && !isNaN(startDate.getTime())
                    ? format(startDate, "MMM d, yyyy")
                    : "Not set"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Completion Rate</span>
                <span>
                  {Math.round(
                    (completedDates.length /
                      ((new Date().getTime() - startDate.getTime()) /
                        (1000 * 60 * 60 * 24) +
                        1)) *
                      100,
                  )}
                  %
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {milestones.map((milestone) => (
                  <div key={milestone.days} className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${milestone.achieved ? "bg-green-500" : "bg-gray-300"}`}
                    ></div>
                    <span
                      className={
                        milestone.achieved
                          ? "font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {milestone.name} ({milestone.days} days)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HabitDetail;
