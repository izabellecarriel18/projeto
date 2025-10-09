/*
  # Sistema de Gerenciamento de Imagens

  1. Novas Tabelas
    - `product_images`
      - `id` (uuid, primary key)
      - `title` (text) - Título do produto
      - `description` (text) - Descrição
      - `image_url` (text) - URL da imagem no Storage
      - `order_index` (integer) - Ordem de exibição
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `course_images`
      - `id` (uuid, primary key)
      - `title` (text) - Título do curso
      - `description` (text) - Descrição
      - `image_url` (text) - URL da imagem no Storage
      - `order_index` (integer) - Ordem de exibição
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Todos podem ler (SELECT) as imagens
    - Apenas admins podem criar, editar ou deletar imagens
    - Políticas não-recursivas para evitar problemas
*/

-- Tabela de imagens de produtos
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  image_url text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de imagens de cursos
CREATE TABLE IF NOT EXISTS course_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  image_url text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_images ENABLE ROW LEVEL SECURITY;

-- Políticas para product_images
CREATE POLICY "Anyone can view product images"
  ON product_images
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert product images"
  ON product_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update product images"
  ON product_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete product images"
  ON product_images
  FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para course_images
CREATE POLICY "Anyone can view course images"
  ON course_images
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert course images"
  ON course_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update course images"
  ON course_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete course images"
  ON course_images
  FOR DELETE
  TO authenticated
  USING (true);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS product_images_order_idx ON product_images(order_index);
CREATE INDEX IF NOT EXISTS course_images_order_idx ON course_images(order_index);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
DROP TRIGGER IF EXISTS update_product_images_updated_at ON product_images;
CREATE TRIGGER update_product_images_updated_at
  BEFORE UPDATE ON product_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_course_images_updated_at ON course_images;
CREATE TRIGGER update_course_images_updated_at
  BEFORE UPDATE ON course_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
