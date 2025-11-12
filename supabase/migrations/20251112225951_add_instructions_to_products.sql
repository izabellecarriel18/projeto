/*
  # Add instructions field to products

  1. Changes
    - Add `instructions` column to `products` table
      - Type: text (allows long instructions)
      - Nullable: true (optional field)
      - Default: empty string
  
  2. Notes
    - This field will store usage instructions for each product
    - Admins can edit these instructions through the UI
    - Instructions will be displayed in a separate tab in the product card
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'products'
    AND column_name = 'instructions'
  ) THEN
    ALTER TABLE public.products
    ADD COLUMN instructions text DEFAULT '';
  END IF;
END $$;