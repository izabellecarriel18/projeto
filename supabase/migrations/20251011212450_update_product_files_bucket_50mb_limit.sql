/*
  # Update Product Files Bucket to 50MB Limit

  1. Changes
    - Set file size limit to 50MB (Supabase free tier limit)
    - 50MB = 52428800 bytes
*/

UPDATE storage.buckets
SET file_size_limit = 52428800
WHERE id = 'product-files';
