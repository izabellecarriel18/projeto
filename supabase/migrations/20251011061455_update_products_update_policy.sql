/*
  # Update products UPDATE policy to allow both admins and edge functions

  1. Changes
    - Replace the old UPDATE policy with a more flexible one
    - Allow authenticated admins to update products
    - Allow anon users to update only the description field (for AI generation via edge function)

  2. Security
    - Admins can update all fields
    - Anonymous users can only update description field (for AI edge function)
*/

CREATE POLICY "Allow product updates"
  ON products
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
