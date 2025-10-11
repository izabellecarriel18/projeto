/*
  # Add DELETE policy for products table

  1. Changes
    - Add policy to allow authenticated admin users to delete products
    - This enables admins to delete products through the trash button

  2. Security
    - Policy only allows authenticated users with admin role to delete products
    - Uses the profiles table to verify admin status
*/

CREATE POLICY "Admins can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
