# Supabase Migration Guide - Softbank Banking App

## Table of Contents
1. [Why Migrate to Supabase?](#why-migrate-to-supabase)
2. [What is Supabase?](#what-is-supabase)
3. [Setup Supabase in v0](#setup-supabase-in-v0)
4. [Database Schema Design](#database-schema-design)
5. [Migration Steps](#migration-steps)
6. [Authentication Strategy](#authentication-strategy)
7. [Row Level Security (RLS)](#row-level-security-rls)
8. [Testing the Migration](#testing-the-migration)

---

## Why Migrate to Supabase?

### Current Problems with localStorage:
- ❌ Data lost when browser cache is cleared
- ❌ Limited storage (5-10MB max)
- ❌ No data sharing between users/devices
- ❌ No real-time updates
- ❌ Not suitable for production apps
- ❌ No backup or recovery options
- ❌ Difficult for admins to manage all user data

### Benefits of Supabase:
- ✅ **Real Database** - PostgreSQL (industry standard)
- ✅ **Persistent Data** - Never lose data when cache clears
- ✅ **Multi-Device** - Access from anywhere
- ✅ **Real-Time** - Live updates across users
- ✅ **Secure** - Row Level Security (RLS) built-in
- ✅ **Scalable** - Handles thousands of users
- ✅ **Free Tier** - Generous limits for development
- ✅ **Built-in Auth** - Replace Firebase if needed
- ✅ **Admin Panel** - Manage data via Supabase dashboard

---

## What is Supabase?

Supabase is an **open-source Firebase alternative** that provides:

1. **PostgreSQL Database** - Store all your data (accounts, transactions, users, etc.)
2. **Authentication** - User signup/login (can replace Firebase)
3. **Real-time subscriptions** - Live data updates
4. **Storage** - File uploads (profile pictures, documents)
5. **Edge Functions** - Serverless API endpoints

**Think of it as:** Firebase + SQL Database + Real-time Features

---

## Setup Supabase in v0

### Step 1: Request Supabase Integration in v0

1. In your v0 chat, type: "Add Supabase integration"
2. v0 will show you a card to connect Supabase
3. Click "Connect Supabase"
4. Follow the prompts to create a Supabase project

### Step 2: Supabase Project Setup

After connecting, you'll have:
- **Supabase URL**: `https://your-project.supabase.co`
- **Anon Key**: Public key for client-side access
- **Service Key**: Secret key for admin operations (NEVER expose in client code)

These will be automatically added as environment variables in v0:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here (server-side only)
```

### Step 3: Install Supabase Client

v0 will automatically install the package, but for reference:
```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

## Database Schema Design

Here's the complete database structure for your banking app:

### Table 1: `users` (extends Firebase Auth)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'superadmin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** Store user profile and role information
- Links to Firebase Auth via `id`
- Stores role for admin access control

### Table 2: `accounts`
```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('savings', 'checking', 'fixed_deposit')),
  account_number TEXT UNIQUE NOT NULL,
  balance DECIMAL(15, 2) DEFAULT 0 CHECK (balance >= 0),
  currency TEXT DEFAULT 'NGN',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
```

**Purpose:** Store bank accounts for each user
- Each user can have multiple accounts
- Balance is decimal for accuracy
- Account number is unique across system

### Table 3: `transactions`
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'transfer', 'account_opened')),
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  description TEXT,
  from_account TEXT,
  to_account TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
```

**Purpose:** Track all financial transactions
- Immutable (never update, only insert)
- Indexed for fast queries by user and date

### Table 4: `loans`
```sql
CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id),
  loan_type TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  purpose TEXT NOT NULL,
  duration_months INTEGER NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL,
  emi DECIMAL(15, 2) NOT NULL,
  total_payable DECIMAL(15, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'closed')),
  applied_date TIMESTAMPTZ DEFAULT NOW(),
  approved_date TIMESTAMPTZ,
  rejected_date TIMESTAMPTZ
);

CREATE INDEX idx_loans_user_id ON loans(user_id);
CREATE INDEX idx_loans_status ON loans(status);
```

**Purpose:** Loan applications and management
- Tracks EMI calculations
- Admin can approve/reject

### Table 5: `fraud_logs`
```sql
CREATE TABLE fraud_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('large_transfer', 'large_deposit', 'large_withdrawal', 'rapid_transactions', 'unusual_pattern')),
  details JSONB NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high')),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fraud_logs_user_id ON fraud_logs(user_id);
CREATE INDEX idx_fraud_logs_severity ON fraud_logs(severity);
CREATE INDEX idx_fraud_logs_timestamp ON fraud_logs(timestamp DESC);
```

**Purpose:** Security monitoring for suspicious activities
- JSONB for flexible details storage
- Indexed for admin dashboard queries

### Table 6: `user_settings`
```sql
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  currency TEXT DEFAULT 'NGN',
  language TEXT DEFAULT 'en',
  theme TEXT DEFAULT 'light',
  notifications_enabled BOOLEAN DEFAULT true,
  two_factor_enabled BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** User preferences and settings
- One row per user

---

## Migration Steps

### Phase 1: Setup (Week 1)

**Step 1: Create Supabase Client**
```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

**Step 2: Create Database Tables**
- Go to Supabase Dashboard → SQL Editor
- Run the SQL scripts above to create all tables
- Or v0 can generate SQL scripts for you to execute

**Step 3: Set Up Row Level Security (see RLS section)**

### Phase 2: Data Migration (Week 1-2)

**Step 1: Export Existing Data**
Create a migration script to export localStorage data:
```javascript
// Export current data before migration
const exportData = () => {
  const data = {
    users: localStorage.getItem('banking_users'),
    accounts: {},
    transactions: {},
    loans: {},
    fraudLogs: {}
  }
  
  // Export all user data
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key.startsWith('banking_accounts_')) {
      data.accounts[key] = localStorage.getItem(key)
    }
    // ... repeat for other data types
  }
  
  console.log('Export complete', data)
  return data
}
```

**Step 2: Import to Supabase**
Run a one-time import script to move data to Supabase

### Phase 3: Update Contexts (Week 2)

**Update BankingContext to use Supabase:**
- Replace `localStorage.getItem()` with `supabase.from('accounts').select()`
- Replace `localStorage.setItem()` with `supabase.from('accounts').insert()`
- Add real-time subscriptions for live updates

**Update AuthContext:**
- Option A: Keep Firebase + Supabase (Firebase for auth, Supabase for data)
- Option B: Migrate to Supabase Auth completely

### Phase 4: Testing (Week 3)

1. **Test user signup/login**
2. **Test account creation**
3. **Test deposits/withdrawals**
4. **Test transfers**
5. **Test admin dashboard**
6. **Test fraud detection**

---

## Authentication Strategy

### Option A: Firebase Auth + Supabase Database (Recommended)

**Why:** You already have Firebase auth working

**How it works:**
1. User signs up/logs in with Firebase
2. Firebase returns user UID
3. Store user data in Supabase `users` table
4. Use Firebase UID as foreign key in all Supabase tables

```javascript
// After Firebase login
const { user } = await signInWithEmailAndPassword(auth, email, password)

// Create/update user in Supabase
await supabase.from('users').upsert({
  id: user.uid,
  email: user.email,
  display_name: user.displayName,
  role: 'user'
})
```

### Option B: Full Supabase Auth Migration

Replace Firebase completely with Supabase Auth

**Pros:**
- One less service to manage
- Simpler setup
- Built-in RLS with auth

**Cons:**
- Need to migrate existing Firebase users
- Change login/signup code

---

## Row Level Security (RLS)

RLS ensures users can only access their own data. **This is critical for security!**

### Enable RLS on All Tables

```sql
-- Enable RLS on accounts table
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own accounts
CREATE POLICY "Users can view own accounts"
ON accounts FOR SELECT
USING (auth.uid() = user_id);

-- Users can only insert their own accounts
CREATE POLICY "Users can create own accounts"
ON accounts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own accounts
CREATE POLICY "Users can update own accounts"
ON accounts FOR UPDATE
USING (auth.uid() = user_id);
```

### Admin Policies

```sql
-- Admins can see all accounts
CREATE POLICY "Admins can view all accounts"
ON accounts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
  )
);
```

**Repeat for all tables:** transactions, loans, fraud_logs, etc.

---

## Testing the Migration

### Pre-Migration Checklist
- [ ] Backup all localStorage data
- [ ] Supabase project created
- [ ] All tables created in Supabase
- [ ] RLS policies configured
- [ ] Test user created in Supabase

### Migration Checklist
- [ ] User signup creates Supabase user record
- [ ] Account creation stores in Supabase
- [ ] Transactions saved to Supabase
- [ ] Admin dashboard shows all users
- [ ] Fraud detection logs to Supabase
- [ ] No localStorage dependencies remain

### Post-Migration Testing
1. **Create new user** - Should work end-to-end
2. **Create account** - Should appear in Supabase dashboard
3. **Make transfer** - Should create transaction record
4. **Admin login** - Should see all users
5. **Fraud detection** - Should log to database

---

## Common Issues & Solutions

### Issue 1: "Row Level Security policy violation"
**Solution:** Check RLS policies, ensure user is authenticated

### Issue 2: "Foreign key constraint violation"
**Solution:** Ensure user exists in `users` table before creating accounts

### Issue 3: "Data not updating in real-time"
**Solution:** Set up Supabase real-time subscriptions

### Issue 4: "Admin can't see all data"
**Solution:** Create admin-specific RLS policies

---

## Cost Estimate

### Supabase Free Tier (Perfect for Development)
- ✅ 500MB database storage
- ✅ 1GB file storage
- ✅ 2GB bandwidth
- ✅ 50,000 monthly active users
- ✅ 500,000 database queries/month
- ✅ Unlimited API requests

### When to Upgrade (Pro: $25/month)
- More than 500MB data
- More than 50K users
- Need better performance

---

## Timeline

**Week 1: Setup & Schema**
- Day 1-2: Connect Supabase, create tables
- Day 3-4: Set up RLS policies
- Day 5: Test schema with sample data

**Week 2: Code Migration**
- Day 1-3: Update BankingContext
- Day 4-5: Update AuthContext
- Day 6-7: Update all pages

**Week 3: Testing & Deployment**
- Day 1-3: Thorough testing
- Day 4-5: Data migration from localStorage
- Day 6-7: Deploy and monitor

---

## Next Steps

1. **Review this guide** with your team
2. **Request Supabase integration** in v0
3. **Create database tables** using SQL scripts
4. **Let me know** when ready - I'll update the code to use Supabase!

---

## Questions?

- **Q: Can I keep both localStorage and Supabase?**
  A: Yes! Keep localStorage as a cache for offline access

- **Q: Will this break existing users?**
  A: We'll migrate their data first, so no data loss

- **Q: Do I need to learn SQL?**
  A: No! Supabase has a nice JavaScript API. I'll handle the code.

- **Q: What about my Firebase auth?**
  A: We can keep it! Use Firebase for auth + Supabase for data.

---

Ready to migrate? Let me know and I'll start updating the code! 🚀
