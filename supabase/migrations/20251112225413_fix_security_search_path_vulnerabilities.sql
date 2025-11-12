/*
  # Fix Security - Search Path Vulnerabilities

  1. Security Fixes
    - Add `SET search_path = ''` to all functions to prevent search_path attacks
    - Functions updated:
      - `public.is_admin` - Admin verification function
      - `public.update_updated_at_column` - Trigger function for updated_at
      - `public.update_orders_updated_at` - Trigger function for orders updated_at
  
  2. Important Notes
    - These changes prevent malicious users from exploiting search_path vulnerabilities
    - All table references are now explicitly qualified with schema names
    - Maintains SECURITY DEFINER where needed but with proper protection
*/

-- Fix is_admin function with proper search_path protection
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$;

-- Fix update_updated_at_column function with proper search_path protection
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix update_orders_updated_at function with proper search_path protection
CREATE OR REPLACE FUNCTION public.update_orders_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;