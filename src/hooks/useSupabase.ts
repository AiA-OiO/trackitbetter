import { useState, useEffect } from "react";
import { supabase, Habit, HabitCompletion, habitService } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

// Hook for authentication
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };
};

// Hook for habits management
export const useHabits = (userId?: string) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHabits = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const data = await habitService.getHabits(userId);
      setHabits(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch habits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [userId]);

  const createHabit = async (
    habitData: Omit<Habit, "id" | "created_at" | "updated_at">,
  ) => {
    try {
      const newHabit = await habitService.createHabit(habitData);
      setHabits((prev) => [newHabit, ...prev]);
      return newHabit;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create habit");
      throw err;
    }
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    try {
      const updatedHabit = await habitService.updateHabit(id, updates);
      setHabits((prev) => prev.map((h) => (h.id === id ? updatedHabit : h)));
      return updatedHabit;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update habit");
      throw err;
    }
  };

  const deleteHabit = async (id: string) => {
    try {
      await habitService.deleteHabit(id);
      setHabits((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete habit");
      throw err;
    }
  };

  return {
    habits,
    loading,
    error,
    createHabit,
    updateHabit,
    deleteHabit,
    refetch: fetchHabits,
  };
};

// Hook for habit completions
export const useHabitCompletions = (habitId?: string) => {
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompletions = async () => {
    if (!habitId) return;

    try {
      setLoading(true);
      const data = await habitService.getHabitCompletions(habitId);
      setCompletions(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch completions",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletions();
  }, [habitId]);

  const toggleCompletion = async (date: string, userId: string) => {
    if (!habitId) return;

    try {
      await habitService.toggleHabitCompletion(habitId, date, userId);
      await fetchCompletions(); // Refresh completions
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to toggle completion",
      );
      throw err;
    }
  };

  return {
    completions,
    loading,
    error,
    toggleCompletion,
    refetch: fetchCompletions,
  };
};
