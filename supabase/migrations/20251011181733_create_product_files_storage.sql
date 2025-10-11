/*
  # Create Product Files Storage System

  1. Storage
    - Create `product-files` bucket for storing downloadable files
    - Set up RLS policies for secure file access
  
  2. Table Changes
    - Add `file_url` column to products table
    - Add `file_name` column to products table
  
  3. Security
    - Only authenticated admins can upload files
    - Only users who purchased the product can download files
    - Public read access is disabled by default
*/

-- Create storage bucket for product files
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-files', 'product-files', false)
ON CONFLICT (id) DO NOTHING;

-- Add file columns to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'file_url'
  ) THEN
    ALTER TABLE products ADD COLUMN file_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'file_name'
  ) THEN
    ALTER TABLE products ADD COLUMN file_name text;
  END IF;
END $$;

-- Storage policy: Only admins can upload files
CREATE POLICY "Admins can upload product files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'product-files' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Storage policy: Only admins can update files
CREATE POLICY "Admins can update product files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'product-files' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Storage policy: Only admins can delete files
CREATE POLICY "Admins can delete product files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'product-files' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Storage policy: Users who purchased can download files
CREATE POLICY "Users can download purchased product files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'product-files' AND
    (
      -- Admin can see all files
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
      OR
      -- User purchased the product
      EXISTS (
        SELECT 1 FROM user_purchases up
        JOIN products p ON p.id = up.product_id
        WHERE up.user_id = auth.uid()
        AND up.status = 'completed'
        AND storage.objects.name LIKE p.id || '%'
      )
    )
  );
