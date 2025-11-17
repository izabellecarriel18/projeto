/*
  # Add Tires Category

  1. Changes
    - This migration prepares the database for the new "Pneus" (Tires) category
    - No schema changes needed as the products table already supports any category value
    - The category field in products table is already flexible (text type)
  
  2. Notes
    - Products with category "Pneus" can now be added through the application
    - Tire categories will be: ALTO, BAIXO, OFF ROAD (stored in brand field)
*/

-- No structural changes needed
-- The products table already accepts any category value
-- This migration serves as documentation for the new category
SELECT 1;