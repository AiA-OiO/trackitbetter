import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  Settings,
  User,
  LogOut,
  BarChart3,
  Calendar,
  CheckCircle2,
  Trophy,
} from "lucide-react";
import HabitCard from "./HabitCard";

const Home = () => {
  const [activeTab, setActiveTab] = useState("habits");
  const [isCreateHabitDialogOpen, setIsCreateHabitDialogOpen] = useState(false);

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  };

  // Mock habits data
  const habits = [
    {
      id: "1",
      title: "Daily Exercise",
      description: "Workout for at least 30 minutes",
      currentStreak: 12,
      longestStreak: 15,
      chainColor: "silver",
      lastChecked: "2023-06-15",
    },
    {
      id: "2",
      title: "Read Books",
      description: "Read at least 20 pages",
      currentStreak: 25,
      longestStreak: 25,
      chainColor: "gold",
      lastChecked: "2023-06-15",
    },
    {
      id: "3",
      title: "Meditation",
      description: "Meditate for 10 minutes",
      currentStreak: 5,
      longestStreak: 8,
      chainColor: "bronze",
      lastChecked: "2023-06-14",
    },
    {
      id: "4",
      title: "Learn Programming",
      description: "Code for at least 1 hour",
      currentStreak: 50,
      longestStreak: 50,
      chainColor: "diamond",
      lastChecked: "2023-06-15",
    },
  ];

  // Mock statistics data
  const statistics = {
    totalHabits: 4,
    totalCompletions: 92,
    averageStreak: 23,
    longestStreak: 50,
    achievements: [
      {
        id: "1",
        name: "First Week",
        description: "Completed a habit for 7 days in a row",
        icon: <Trophy className="h-4 w-4" />,
      },
      {
        id: "2",
        name: "Silver Chain",
        description: "Reached a 15-day streak",
        icon: <Trophy className="h-4 w-4" />,
      },
      {
        id: "3",
        name: "Gold Chain",
        description: "Reached a 30-day streak",
        icon: <Trophy className="h-4 w-4" />,
      },
      {
        id: "4",
        name: "Diamond Chain",
        description: "Reached a 50-day streak",
        icon: <Trophy className="h-4 w-4" />,
      },
    ],
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle habit creation logic here
    setIsCreateHabitDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Chain Habit Tracker</h1>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <Tabs
          defaultValue="habits"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="habits" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Habits</span>
              </TabsTrigger>
              <TabsTrigger
                value="statistics"
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Statistics</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            {activeTab === "habits" && (
              <Dialog
                open={isCreateHabitDialogOpen}
                onOpenChange={setIsCreateHabitDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    <span>New Habit</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Habit</DialogTitle>
                    <DialogDescription>
                      Define a new habit you want to track daily. Click save
                      when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateHabit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          placeholder="e.g., Daily Exercise"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="e.g., Workout for at least 30 minutes"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="frequency">Frequency</Label>
                        <Select defaultValue="daily">
                          <SelectTrigger id="frequency">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekdays">Weekdays</SelectItem>
                            <SelectItem value="weekends">Weekends</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save Habit</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <TabsContent value="habits" className="space-y-4">
            {habits.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No habits yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first habit to start building chains
                </p>
                <Button onClick={() => setIsCreateHabitDialogOpen(true)}>
                  Create Habit
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habits.map((habit) => (
                  <Link
                    to={`/habit/${habit.id}`}
                    key={habit.id}
                    className="block"
                  >
                    <HabitCard
                      id={habit.id}
                      title={habit.title}
                      description={habit.description}
                      currentStreak={habit.currentStreak}
                      longestStreak={habit.longestStreak}
                      chainColor={habit.chainColor}
                      lastUpdated={new Date(habit.lastChecked)}
                    />
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Habits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statistics.totalHabits}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Completions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statistics.totalCompletions}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statistics.averageStreak} days
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Longest Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statistics.longestStreak} days
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>
                  Badges earned through consistent habit tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {statistics.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-start space-x-4 p-4 border rounded-lg"
                    >
                      <div className="bg-primary/10 p-2 rounded-full">
                        {achievement.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{achievement.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={user.email} />
                </div>
                <div className="space-y-2">
                  <Label>Theme Preference</Label>
                  <Select defaultValue="system">
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chain Settings</CardTitle>
                <CardDescription>
                  Configure your chain appearance and milestones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Chain Color Milestones</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className="bg-amber-700/20 text-amber-700 border-amber-700/30"
                      >
                        Bronze
                      </Badge>
                      <span className="text-sm">1-14 days</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className="bg-slate-300/20 text-slate-500 border-slate-300/30"
                      >
                        Silver
                      </Badge>
                      <span className="text-sm">15-29 days</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className="bg-amber-400/20 text-amber-500 border-amber-400/30"
                      >
                        Gold
                      </Badge>
                      <span className="text-sm">30-49 days</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className="bg-sky-300/20 text-sky-500 border-sky-300/30"
                      >
                        Diamond
                      </Badge>
                      <span className="text-sm">50+ days</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Home;
