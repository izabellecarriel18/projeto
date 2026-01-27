/*
  # Fix insecure INSERT policy on profiles table
  
  1. Security Changes
    - Remove the insecure "Allow insert for new users" policy that uses WITH CHECK (true)
    - Keep the secure "Allow insert for new users with user role only" policy
    
  2. Notes
    - The removed policy allowed unrestricted INSERT access
    - The remaining policy properly restricts inserts to only allow 'user' role
*/

DROP POLICY IF EXISTS "Allow insert for new users" ON public.profiles;
