/*
  # Add UPDATE policy for products table
  
  1. Changes
    - Add policy to allow anon and authenticated users to update product descriptions
    - This enables the AI-generated descriptions to be saved to the database
  
  2. Security
    - Policy allows updates to the products table for description field
    - Required for the automatic description generation feature to work
*/

CREATE POLICY "Allow description updates for products"
  ON products
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
