# AI Fitness Logger

## Current State
- Dark athletic theme with lime-green primary, Bricolage Grotesque + Satoshi fonts
- Dashboard with stat cards, recent sessions, feature image cards
- History, Challenges, Login, Layout components
- Workout images present in /assets/generated/

## Requested Changes (Diff)

### Add
- New gym-energy fonts: Bebas Neue (display/headings) + Barlow (body) from Google Fonts
- Progress charts on Dashboard: weekly calorie burn bar chart + weekly weight lifted line chart using recharts
- New gym images: gym-hero, gym-weights, gym-pullup, gym-nutrition in Dashboard and Login pages

### Modify
- index.css: swap Google Fonts import to Bebas Neue + Barlow; update --font-display and --font-body references
- tailwind.config.js: map fontFamily.display to Bebas Neue, fontFamily.body to Barlow
- Dashboard.tsx: add two charts below stat cards (WeeklyCaloriesChart + WeeklyWeightChart), update hero image cards to use new gym-hero and gym-pullup images
- Login.tsx: swap hero banner to use new gym-hero.dim_1200x600.jpg
- History.tsx: add small per-session calorie sparkline badges

### Remove
- Nothing removed

## Implementation Plan
1. Update index.css to import Bebas Neue + Barlow from Google Fonts; update CSS custom properties for font-display and font-body
2. Update tailwind.config.js fontFamily mappings
3. Add two recharts-based charts to Dashboard.tsx:
   - WeeklyCaloriesChart: bar chart of calories burned per day over last 7 days
   - WeeklyWeightChart: bar chart of weight lifted per session over last 7 workouts
4. Update Dashboard feature image cards to use gym-hero.dim_1200x600.jpg and gym-pullup.dim_600x400.jpg
5. Update Login.tsx hero banner to use gym-hero.dim_1200x600.jpg
6. Validate and build
