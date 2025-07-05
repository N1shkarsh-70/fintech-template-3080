
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analysis_sessions table to track upload sessions
CREATE TABLE public.analysis_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  session_id TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'uploading' CHECK (status IN ('uploading', 'processing', 'completed', 'failed')),
  file_count INTEGER DEFAULT 0,
  zip_url TEXT,
  zip_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '6 hours')
);

-- Enable RLS on both tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- RLS policies for analysis_sessions
CREATE POLICY "Users can view their own sessions" 
  ON public.analysis_sessions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions" 
  ON public.analysis_sessions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" 
  ON public.analysis_sessions FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('user-uploads', 'user-uploads', false),
  ('user-zips', 'user-zips', false);

-- Storage policies for user-uploads bucket
CREATE POLICY "Users can upload their own files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'user-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'user-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for user-zips bucket  
CREATE POLICY "Users can create their own zips"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-zips' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own zips"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'user-zips' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own zips"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'user-zips' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
