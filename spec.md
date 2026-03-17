# AI Fitness Logger

## Current State
The app has a Suggestions page with AI workout recommendations (progressive overload, variety, base building). It uses workout session data and user profile data. The dashboard shows calories burned stats.

## Requested Changes (Diff)

### Add
- AI Protein Intake card on the Suggestions page that calculates daily protein intake recommendation based on:
  - Calories burned in recent workouts (from session data)
  - User body weight and fitness goal (from profile)
  - Post-workout protein boost formula tied to calorie expenditure
- Display: daily protein goal (g), protein per meal suggestion (3 meals), post-workout protein recommendation
- Visual breakdown: base protein (from weight/goal), workout bonus protein (from calories burned)

### Modify
- Suggestions.tsx: add ProteinIntakeCard component above or below existing suggestions

### Remove
- Nothing

## Implementation Plan
1. Add `ProteinIntakeCard` component in Suggestions.tsx
2. Use `useUserProfile` and `useWorkoutSessions` hooks (already available)
3. Calculate: base = weight_kg * goal_multiplier (0.8 for general, 1.2 for endurance, 1.6 for muscle gain, 1.0 for weight loss), workout_bonus = avg_daily_calories_burned * 0.05
4. Show total daily protein, per-meal split, and post-workout serving recommendation
5. Show a placeholder with profile prompt if no profile set
