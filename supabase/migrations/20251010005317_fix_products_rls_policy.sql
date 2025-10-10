/*
  # Fix Products RLS Policy
  
  1. Changes
    - Drop existing policy
    - Create new policy that allows both anon and authenticated users to view products
  
  2. Security
    - Products remain publicly viewable
    - Policy applies to both anon and authenticated roles
*/

DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;

CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);