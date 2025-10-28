-- Make username column optional for Google OAuth users
-- Run this in your production database (Neon PostgreSQL)

-- Step 1: Make username nullable
ALTER TABLE "users" ALTER COLUMN "username" DROP NOT NULL;

-- Step 2: Verify the change
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'username';
