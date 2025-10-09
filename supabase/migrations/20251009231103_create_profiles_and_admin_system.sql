/*
  # Sistema de Perfis e Administração

  1. Nova Tabela
    - `profiles`
      - `id` (uuid, primary key, referencia auth.users)
      - `name` (text, nome do usuário)
      - `email` (text, email do usuário)
      - `role` (text, tipo de usuário: 'user' ou 'admin')
      - `created_at` (timestamp, data de criação)
      - `updated_at` (timestamp, última atualização)
  
  2. Segurança
    - Habilita RLS na tabela `profiles`
    - Políticas para usuários autenticados lerem seu próprio perfil
    - Políticas para usuários autenticados atualizarem seu próprio perfil
    - Apenas admins podem alterar o campo `role`
  
  3. Funções
    - Trigger automático para criar perfil quando um usuário se cadastra
    - Função para verificar se um usuário é admin
  
  4. Notas Importantes
    - Por padrão, todos os novos usuários são criados como 'user'
    - O primeiro usuário cadastrado será automaticamente definido como 'admin'
    - Admins futuros devem ser promovidos manualmente no dashboard do Supabase
*/

-- Criar tabela de perfis
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Política: Usuários podem atualizar seu próprio perfil (exceto role)
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    role = (SELECT role FROM profiles WHERE id = auth.uid())
  );

-- Política: Admins podem ver todos os perfis
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Política: Admins podem atualizar qualquer perfil
CREATE POLICY "Admins can update any profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_count integer;
BEGIN
  -- Contar quantos usuários já existem
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- Se for o primeiro usuário, torná-lo admin
  IF user_count = 0 THEN
    INSERT INTO public.profiles (id, name, email, role)
    VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
      new.email,
      'admin'
    );
  ELSE
    -- Caso contrário, criar como usuário normal
    INSERT INTO public.profiles (id, name, email, role)
    VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
      new.email,
      'user'
    );
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para executar a função
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função auxiliar para verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
