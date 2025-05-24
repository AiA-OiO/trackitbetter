import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Habit {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  chain_color: "bronze" | "silver" | "gold" | "diamond";
  current_streak: number;
  longest_streak: number;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  completed_date: string;
  created_at: string;
  user_id: string;
}

// Habit operations
export const habitService = {
  // Get all habits for a user
  async getHabits(userId: string): Promise<Habit[]> {
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create a new habit
  async createHabit(
    habit: Omit<Habit, "id" | "created_at" | "updated_at">,
  ): Promise<Habit> {
    const { data, error } = await supabase
      .from("habits")
      .insert(habit)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a habit
  async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit> {
    const { data, error } = await supabase
      .from("habits")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a habit
  async deleteHabit(id: string): Promise<void> {
    const { error } = await supabase.from("habits").delete().eq("id", id);

    if (error) throw error;
  },

  // Get completions for a habit
  async getHabitCompletions(habitId: string): Promise<HabitCompletion[]> {
    const { data, error } = await supabase
      .from("habit_completions")
      .select("*")
      .eq("habit_id", habitId)
      .order("completed_date", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Toggle habit completion for a date
  async toggleHabitCompletion(
    habitId: string,
    date: string,
    userId: string,
  ): Promise<void> {
    // Check if completion already exists
    const { data: existing } = await supabase
      .from("habit_completions")
      .select("id")
      .eq("habit_id", habitId)
      .eq("completed_date", date)
      .single();

    if (existing) {
      // Remove completion
      const { error } = await supabase
        .from("habit_completions")
        .delete()
        .eq("id", existing.id);

      if (error) throw error;
    } else {
      // Add completion
      const { error } = await supabase.from("habit_completions").insert({
        habit_id: habitId,
        completed_date: date,
        user_id: userId,
      });

      if (error) throw error;
    }

    // Update streak calculations
    await this.updateHabitStreaks(habitId);
  },

  // Update habit streaks based on completions
  async updateHabitStreaks(habitId: string): Promise<void> {
    const completions = await this.getHabitCompletions(habitId);
    const dates = completions
      .map((c) => new Date(c.completed_date))
      .sort((a, b) => a.getTime() - b.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate streaks
    for (let i = 0; i < dates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const daysDiff = Math.floor(
          (dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24),
        );
        if (daysDiff === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }

      longestStreak = Math.max(longestStreak, tempStreak);

      // Check if this is part of current streak (ending today or yesterday)
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const daysDiffFromToday = Math.floor(
        (today.getTime() - dates[i].getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysDiffFromToday <= 1) {
        currentStreak = tempStreak;
      }
    }

    // Determine chain color based on current streak
    let chainColor: "bronze" | "silver" | "gold" | "diamond" = "bronze";
    if (currentStreak >= 50) chainColor = "diamond";
    else if (currentStreak >= 30) chainColor = "gold";
    else if (currentStreak >= 15) chainColor = "silver";

    // Update habit with new streak data
    await this.updateHabit(habitId, {
      current_streak: currentStreak,
      longest_streak: longestStreak,
      chain_color: chainColor,
    });
  },
};
