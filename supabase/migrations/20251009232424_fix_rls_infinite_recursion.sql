/*
  # Corrigir Recursão Infinita nas Políticas RLS

  1. Problema Identificado
    - As políticas de admin estavam causando recursão infinita
    - A política verificava profiles.role enquanto tentava ler profiles
    
  2. Solução
    - Remover políticas recursivas de admin
    - Simplificar para apenas permitir usuários lerem seus próprios perfis
    - Operações de admin serão feitas via service role no backend
    
  3. Segurança
    - Usuários só podem ler/atualizar seus próprios perfis
    - Sistema permanece seguro e funcional
*/

-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;

-- Política simples para SELECT (sem recursão)
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Política simples para UPDATE (sem recursão)
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));

-- Política para INSERT (para o trigger)
CREATE POLICY "Allow insert for new users"
  ON profiles
  FOR INSERT
  WITH CHECK (true);
