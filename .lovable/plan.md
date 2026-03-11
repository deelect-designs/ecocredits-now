# EcoCredit — Implementation Plan

## Overview

A responsive web app (PWA-installable) that lets users earn digital credits by uploading photos of recyclable waste. Real authentication via Supabase, with a demo mode for competition presentations.

---

## 1. Design System & Layout

- **Colors**: Green (#2E7D32), Blue (#1565C0), white, light grey
- **Style**: Rounded cards, clean icons (Lucide), minimal text, mobile-first
- **Layout**: Bottom navigation on mobile (Home, Upload, Dashboard, More), top navbar on desktop

## 2. Authentication (Supabase)

- Sign up / Login pages with email or phone number
- Profile creation: name, phone, city
- Profiles table linked to auth.users

## 3. Pages & Features

### Public Website Pages

- **Homepage**: Hero ("Turn Waste into Financial Opportunity"), Problem/Solution sections, How It Works, Impact stats, CTA
- **How It Works**: 4-step visual flow (Upload → AI Verify → Earn → Convert)
- **Impact Page**: Global metrics cards (waste recycled, plastic removed, active collectors)
- **About Page**: Mission statement and scalability/future plans section

### App Pages (authenticated)

- **Waste Upload Page**: Camera/image upload, simulated AI detection (random classification with confidence score), GPS capture, quantity input, submit → confirmation screen with credits earned
- **User Dashboard**: Total EcoCredits, waste submissions list, environmental impact stats (CO₂ saved, kg collected), simple charts using Recharts
- **Credit Conversion Page**: Buttons for Cash, Airtime, Save, Microloan (simulated for MVP)
- **Leaderboard**: Top recyclers table (name, city, credits)
- **Profile Page**: User info and settings

### Admin View

- Simple admin page: user list, total submissions, platform stats

## 4. Database (Supabase)

- **profiles**: name, phone, city, linked to auth.users
- **user_roles**: role-based access (user/admin)
- **waste_submissions**: user_id, waste_type, quantity, credits_earned, image_url, location, timestamp
- **credit_transactions**: user_id, type (earn/convert), amount, method

## 5. AI Simulation

- On image upload, randomly assign waste type (Plastic, Metal, Cardboard, Can) with a confidence score (85-98%)
- Display result card with detected type and score

## 6. Credit Reward Logic

- Plastic → 10 credits, Aluminium → 12, Cardboard → 8, Metal → 15, Other → 5
- Credits calculated per quantity submitted and stored in database

## 7. Demo Mode

- A "Demo Mode" toggle button that auto-runs: upload simulation → AI detection → credit award → dashboard update
- Pre-seeded demo data (e.g., Musa from Lagos with 340 credits, plus several other users)

## 8. PWA Setup

- Install vite-plugin-pwa with manifest, icons, and mobile meta tags
- Installable from browser on mobile devices

## 9. Storage

- Supabase Storage bucket for waste images