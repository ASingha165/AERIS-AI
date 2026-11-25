# Stage 4 — Supabase persistence foundation

**Branch:** `feat/stage-4-supabase-foundation`

## Implemented in this foundation

- PostgreSQL migration for `profiles`, `households`, `saved_locations`, `user_preferences`, and `saved_schedules`.
- Row Level Security on every table. Authenticated users can access only rows whose owner matches `auth.uid()`.
- Composite foreign keys prevent a saved schedule or default location from referencing another user's location.
- Check constraints validate coordinates, supported home types, cooking fuel, AQI standard, alert threshold, and string lengths.
- Updated-at triggers and owner/time indexes.
- Settings page now validates and persists non-sensitive preferences in browser localStorage, rather than only showing a success message.
- No new npm dependency is introduced.

## Privacy boundary

The current household form includes family-member names, ages, asthma and cardiovascular flags, and respiratory sensitivity. These are sensitive personal/health details. This migration deliberately does **not** create a cloud `family_members` table or transmit those fields. They remain outside the Stage 4 cloud schema until an explicit consent flow, data-minimization policy, retention/deletion controls, and privacy review are implemented. Do not put medical details into household or schedule free-text fields.

The migration stores only non-clinical household configuration and user-owned application preferences. Exact home addresses are not collected.

## Apply the migration

1. Create a Supabase project using the free plan if available in your account.
2. Open **SQL Editor** in the Supabase dashboard.
3. Paste and run `supabase/migrations/202611250001_initial_schema.sql`.
4. Confirm the five tables exist and RLS is enabled on each.
5. Configure the project URL and anon key in the deployment environment when the Auth integration is implemented.

The SQL migration can be applied without exposing a service-role key. Do not add `SUPABASE_SERVICE_ROLE_KEY` to client code or expose it with a `NEXT_PUBLIC_` prefix.

## Environment variables

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: public anon/publishable key; RLS must remain enabled.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only privileged key; not used by this foundation and must never be exposed to the browser.

## Not yet complete

- Supabase project creation and migration execution.
- Supabase Auth integration and session handling.
- Server/client Supabase SDK setup.
- Syncing settings and non-sensitive household configuration to authenticated user rows.
- End-to-end RLS tests against a live Supabase project.

Stage 4 must not be marked complete until these steps are tested with real project credentials.
