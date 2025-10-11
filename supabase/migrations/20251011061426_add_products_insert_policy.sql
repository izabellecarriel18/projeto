/*
  # Add INSERT policy for products table

  1. Changes
    - Add policy to allow authenticated admin users to insert new products
    - This enables admins to create products through the AddProductModal

  2. Security
    - Policy only allows authenticated users with admin role to insert products
    - Uses the profiles table to verify admin status
*/

CREATE POLICY "Admins can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
