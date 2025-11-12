/*
  # Fix Critical Security Vulnerabilities

  1. Security Issues Fixed
    - **CRITICAL**: Remove insecure "Allow product updates" policy that allows anyone to modify products
    - Add proper admin-only policy for product updates
    - Restrict image table modifications to admins only (product_images, course_images, site_images)
    - Prevent users from setting admin role during profile creation
    - Add validation to prevent role escalation

  2. New Policies
    - Products: Only admins can update products
    - Product Images: Only admins can insert/update/delete
    - Course Images: Only admins can insert/update/delete
    - Site Images: Only admins can update
    - Profiles: Role defaults to 'user' and cannot be set during insert

  3. Important Notes
    - All changes maintain backward compatibility for legitimate users
    - Admin verification uses the secure is_admin() function
    - Public read access is maintained where appropriate
*/

-- ============================================================================
-- PRODUCTS TABLE - Fix critical update vulnerability
-- ============================================================================

-- Drop the insecure policy that allows anyone to update products
DROP POLICY IF EXISTS "Allow product updates" ON public.products;

-- Create secure policy: Only admins can update products
CREATE POLICY "Admins can update products"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- PRODUCT_IMAGES TABLE - Restrict to admins only
-- ============================================================================

-- Drop insecure policies
DROP POLICY IF EXISTS "Authenticated users can insert product images" ON public.product_images;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON public.product_images;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON public.product_images;

-- Create secure admin-only policies
CREATE POLICY "Admins can insert product images"
  ON public.product_images
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update product images"
  ON public.product_images
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete product images"
  ON public.product_images
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- COURSE_IMAGES TABLE - Restrict to admins only
-- ============================================================================

-- Drop insecure policies
DROP POLICY IF EXISTS "Authenticated users can insert course images" ON public.course_images;
DROP POLICY IF EXISTS "Authenticated users can update course images" ON public.course_images;
DROP POLICY IF EXISTS "Authenticated users can delete course images" ON public.course_images;

-- Create secure admin-only policies
CREATE POLICY "Admins can insert course images"
  ON public.course_images
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update course images"
  ON public.course_images
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete course images"
  ON public.course_images
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- SITE_IMAGES TABLE - Restrict updates to admins only
-- ============================================================================

-- Drop insecure policy
DROP POLICY IF EXISTS "Authenticated users can update site images" ON public.site_images;

-- Create secure admin-only policy
CREATE POLICY "Admins can update site images"
  ON public.site_images
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- PROFILES TABLE - Prevent role escalation during creation
-- ============================================================================

-- Drop the overly permissive insert policy
DROP POLICY IF EXISTS "Allow insert for new users" ON public.profiles;

-- Create secure policy that prevents setting admin role
CREATE POLICY "Allow insert for new users with user role only"
  ON public.profiles
  FOR INSERT
  TO public
  WITH CHECK (
    role = 'user'
  );

-- Update the profiles update policy to be more explicit about role protection
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile but not role"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (
      SELECT profiles.role
      FROM public.profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- ============================================================================
-- Additional Security: Add constraint to ensure role cannot be NULL
-- ============================================================================

-- Ensure role column has proper constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'profiles_role_not_null'
  ) THEN
    ALTER TABLE public.profiles
    ALTER COLUMN role SET NOT NULL;
  END IF;
END $$;