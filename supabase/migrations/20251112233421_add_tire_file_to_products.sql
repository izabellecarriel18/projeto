/*
  # Add Tire File Fields to Products

  1. Changes
    - Add `tire_file_url` column to store the URL of the tire file
    - Add `tire_file_name` column to store the original name of the tire file
  
  2. Purpose
    - Allows products to have a separate tire file in addition to car and wheel files
    - Supports complete 3D model distribution with separate tire assets
  
  3. Notes
    - Fields are nullable as not all products may have tire files
    - Follows the same pattern as existing file fields (file_url/file_name, wheel_file_url/wheel_file_name)
*/

-- Add tire file URL column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'tire_file_url'
  ) THEN
    ALTER TABLE public.products
    ADD COLUMN tire_file_url text;
  END IF;
END $$;

-- Add tire file name column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'tire_file_name'
  ) THEN
    ALTER TABLE public.products
    ADD COLUMN tire_file_name text;
  END IF;
END $$;