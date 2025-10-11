/*
  # Create User Purchases System

  1. New Tables
    - `user_purchases`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `product_id` (uuid, references products)
      - `stripe_session_id` (text, unique)
      - `stripe_payment_intent` (text)
      - `amount_paid` (numeric)
      - `currency` (text, default 'brl')
      - `status` (text, default 'pending')
      - `purchased_at` (timestamptz, default now())
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `user_purchases` table
    - Add policy for users to read their own purchases
    - Add policy for authenticated users to view their purchase history

  3. Indexes
    - Index on user_id for fast purchase lookups
    - Index on stripe_session_id for webhook processing
*/

CREATE TABLE IF NOT EXISTS user_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  stripe_session_id text UNIQUE,
  stripe_payment_intent text,
  amount_paid numeric NOT NULL,
  currency text DEFAULT 'brl',
  status text DEFAULT 'pending',
  purchased_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;

-- Users can view their own purchases
CREATE POLICY "Users can view own purchases"
  ON user_purchases
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_purchases_user_id ON user_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_session_id ON user_purchases(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_product_id ON user_purchases(product_id);
