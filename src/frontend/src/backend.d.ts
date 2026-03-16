import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WorkoutSession {
    date: string;
    exercises: Array<ExerciseLog>;
    totalCalories: number;
}
export interface SessionStats {
    totalCaloriesBurned: number;
    totalWeightLifted: number;
    totalSessions: bigint;
}
export interface ExerciseLog {
    weight: number;
    name: string;
    reps: bigint;
    sets: bigint;
    caloriesBurned: number;
    metValue: number;
}
export interface UserProfile {
    age: bigint;
    weight: number;
    fitnessGoal: WorkoutGoal;
    name: string;
    gender: Gender;
}
export enum Gender {
    other = "other",
    female = "female",
    male = "male"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum WorkoutGoal {
    weightLoss = "weightLoss",
    muscleGain = "muscleGain",
    generalHealth = "generalHealth",
    endurance = "endurance"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllStatsSortedByCalories(): Promise<Array<SessionStats>>;
    getAllStatsSortedBySessionCount(): Promise<Array<SessionStats>>;
    getAllStatsSortedByTotalWeight(): Promise<Array<SessionStats>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getSessionStats(): Promise<SessionStats | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWorkoutSessions(): Promise<Array<WorkoutSession>>;
    isCallerAdmin(): Promise<boolean>;
    logWorkoutSession(date: string, exercises: Array<ExerciseLog>): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
