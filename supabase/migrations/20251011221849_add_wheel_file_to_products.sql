/*
  # Add wheel file support to products

  1. Changes
    - Add `wheel_file_url` column to products table for storing wheel file path
    - Add `wheel_file_name` column to products table for storing original wheel file name
  
  2. Notes
    - These columns are optional (nullable)
    - Will allow products to have a main file and a wheel file
    - Both files will be delivered when user purchases the product
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'wheel_file_url'
  ) THEN
    ALTER TABLE products ADD COLUMN wheel_file_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'wheel_file_name'
  ) THEN
    ALTER TABLE products ADD COLUMN wheel_file_name text;
  END IF;
END $$;
