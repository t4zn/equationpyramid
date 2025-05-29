-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view leaderboards" ON public.leaderboards;
DROP POLICY IF EXISTS "Users can insert their own scores" ON public.leaderboards;
DROP POLICY IF EXISTS "Users can update their own scores" ON public.leaderboards;

-- Profiles table policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view other profiles (limited info)"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Leaderboards policies
CREATE POLICY "Anyone can view leaderboards (read-only)"
  ON public.leaderboards
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can insert their own scores"
  ON public.leaderboards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scores"
  ON public.leaderboards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add email verification requirement
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create a secure function to check email verification
CREATE OR REPLACE FUNCTION public.is_email_verified()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT email_confirmed_at IS NOT NULL
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$;

-- Add email verification check to profiles
ALTER TABLE public.profiles
ADD CONSTRAINT email_verification_required
CHECK (is_email_verified());

-- Create a secure function to handle user deletion
CREATE OR REPLACE FUNCTION public.handle_user_deletion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete user's data from profiles
  DELETE FROM public.profiles WHERE id = OLD.id;
  -- Delete user's data from leaderboards
  DELETE FROM public.leaderboards WHERE user_id = OLD.id;
  RETURN OLD;
END;
$$;

-- Create trigger for user deletion
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_deletion();

-- Add rate limiting for leaderboard updates
CREATE OR REPLACE FUNCTION public.check_leaderboard_update_rate()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  update_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO update_count
  FROM public.leaderboards
  WHERE user_id = NEW.user_id
  AND updated_at > NOW() - INTERVAL '1 minute';
  
  IF update_count > 5 THEN
    RAISE EXCEPTION 'Too many updates. Please wait a minute.';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER leaderboard_update_rate_limit
  BEFORE UPDATE ON public.leaderboards
  FOR EACH ROW
  EXECUTE FUNCTION public.check_leaderboard_update_rate();

-- Add indexes for better performance and security
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_leaderboards_user_id ON public.leaderboards(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboards_score ON public.leaderboards(score DESC);

-- Add constraints for data integrity
ALTER TABLE public.profiles
ADD CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30);

ALTER TABLE public.profiles
ADD CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_-]+$');

ALTER TABLE public.leaderboards
ADD CONSTRAINT score_range CHECK (score >= 0);

-- Create a secure function to update user metadata
CREATE OR REPLACE FUNCTION public.update_user_metadata(
  user_id UUID,
  metadata JSONB
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF auth.uid() != user_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  
  UPDATE auth.users
  SET raw_user_meta_data = raw_user_meta_data || metadata
  WHERE id = user_id;
END;
$$; 