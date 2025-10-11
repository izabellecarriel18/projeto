/*
  # Add purchase_url column to products table

  1. Changes
    - Add `purchase_url` (text, nullable) column to products table
    - This column will store the link where users can purchase the product

  2. Notes
    - Column is nullable to allow products without purchase links
    - Default value is empty string for consistency with existing code
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'purchase_url'
  ) THEN
    ALTER TABLE products ADD COLUMN purchase_url text DEFAULT '';
  END IF;
END $$;
