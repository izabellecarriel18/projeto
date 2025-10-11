/*
  # Update Product Files Bucket Configuration

  1. Changes
    - Increase file size limit to 500MB for 3D model files
    - These files (STL, OBJ, FBX, etc.) can be large
*/

-- Update bucket to allow larger files (500MB = 524288000 bytes)
UPDATE storage.buckets
SET file_size_limit = 524288000
WHERE id = 'product-files';
