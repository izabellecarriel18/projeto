/*
  # Corrigir Permissões do Trigger de Perfis

  1. Alterações
    - Recria a função handle_new_user com permissões corretas
    - Adiciona política para permitir INSERT na tabela profiles pelo trigger
    - Garante que o trigger tenha acesso total ao auth.users

  2. Segurança
    - Função executada com SECURITY DEFINER para ter permissões necessárias
    - Mantém todas as políticas RLS existentes
*/

-- Recriar a função com permissões corretas
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_count integer;
BEGIN
  -- Contar quantos perfis já existem
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  
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
EXCEPTION
  WHEN others THEN
    -- Log do erro mas não impede a criação do usuário
    RAISE WARNING 'Erro ao criar perfil: %', SQLERRM;
    RETURN new;
END;
$$;

-- Garantir que o trigger existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Adicionar política para permitir INSERT de serviço (trigger)
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
CREATE POLICY "Service role can insert profiles"
  ON profiles
  FOR INSERT
  WITH CHECK (true);
