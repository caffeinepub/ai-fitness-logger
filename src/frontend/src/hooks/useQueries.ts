import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ExerciseLog, UserProfile, WorkoutSession } from "../backend.d";
import { useActor } from "./useActor";

export function useWorkoutSessions() {
  const { actor, isFetching } = useActor();
  return useQuery<WorkoutSession[]>({
    queryKey: ["workoutSessions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWorkoutSessions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSessionStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["sessionStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSessionStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLogWorkout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      date,
      exercises,
    }: { date: string; exercises: ExerciseLog[] }) => {
      if (!actor) throw new Error("Not connected");
      return actor.logWorkoutSession(date, exercises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workoutSessions"] });
      queryClient.invalidateQueries({ queryKey: ["sessionStats"] });
    },
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}
