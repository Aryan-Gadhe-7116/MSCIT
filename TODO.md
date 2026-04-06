# Supabase Database Integration Plan

## Approved Plan Steps:

1. ✅ Install @supabase/supabase-js (done)
2. ✅ Created .env.example and src/lib/supabase.ts (add your anon key to .env.local)
3. ✅ Created create_tables.sql - run in Supabase SQL Editor
4. Refactor `src/lib/data.ts`:
   - Remove localStorage
   - Add Supabase CRUD async functions using React Query hooks (useStudentsQuery, useAddStudent, etc.)
   - Update auth to Supabase.auth
5. Update dependent pages (Students.tsx, Batches.tsx, Login.tsx, etc.) to use Query hooks instead of direct db calls
6. Add QueryClientProvider to App.tsx if missing
7. User creates Supabase tables (students, batches, trainers, exams, payments, notifications, users) matching types from data.ts
8. Test CRUD operations
9. Rebuild (`npm run build`) and preview production
10. Deploy-ready with Supabase backend

**Current status: Starting installation**
