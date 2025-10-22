-- Create user_credits table
CREATE TABLE public.user_credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 100,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create video_history table
CREATE TABLE public.video_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  video_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('completed', 'processing', 'failed')),
  idea_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scheduled_posts table
CREATE TABLE public.scheduled_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.video_history(id) ON DELETE CASCADE,
  platforms TEXT[] NOT NULL,
  caption TEXT,
  hashtags TEXT[],
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'cancelled')),
  workflow_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create credit_transactions table
CREATE TABLE public.credit_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_credits
CREATE POLICY "Users can view their own credits"
  ON public.user_credits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credits"
  ON public.user_credits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits"
  ON public.user_credits FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for video_history
CREATE POLICY "Users can view their own video history"
  ON public.video_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own video history"
  ON public.video_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video history"
  ON public.video_history FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own video history"
  ON public.video_history FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for scheduled_posts
CREATE POLICY "Users can view their own scheduled posts"
  ON public.scheduled_posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scheduled posts"
  ON public.scheduled_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled posts"
  ON public.scheduled_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scheduled posts"
  ON public.scheduled_posts FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for credit_transactions
CREATE POLICY "Users can view their own credit transactions"
  ON public.credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credit transactions"
  ON public.credit_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to update user credits timestamp
CREATE OR REPLACE FUNCTION public.update_user_credits_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_credits_timestamp
  BEFORE UPDATE ON public.user_credits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_credits_timestamp();

-- Create indexes for better performance
CREATE INDEX idx_video_history_user_id ON public.video_history(user_id);
CREATE INDEX idx_scheduled_posts_user_id ON public.scheduled_posts(user_id);
CREATE INDEX idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX idx_scheduled_posts_scheduled_time ON public.scheduled_posts(scheduled_time);