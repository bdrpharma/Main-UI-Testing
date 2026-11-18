# BDR Healthcare Mobile App

Expo + React Native + TypeScript UI implementation based on the provided BDR Healthcare screen-flow reference.

## Included
- User authentication flow (Splash, role selection, login, OTP, registration, success)
- Doctor registration + document upload + pending/rejected states
- User Home, Medicines, Medicine Details
- Nearby stores with List/Map-style UI
- Programs, Program Details, Registration Form
- Blogs and Blog Details
- Notifications
- Forms & Surveys
- Support, FAQ and chatbot UI
- User Profile
- Doctor Home, Guidelines, Resources, Notifications, Profile
- Shared components, service layer, hooks, constants and types
- Supabase client placeholder using EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY

## Run
1. Install Node.js LTS.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and put the Supabase values supplied by your backend developer.
4. Run `npx expo start`.

The UI has demo data so screens can be explored before the Supabase tables are connected.
