/*
  # Sistema de Slots Fixos para Imagens

  1. Nova Tabela
    - `site_images`
      - `id` (uuid, primary key)
      - `slot_id` (text, unique) - Identificador único do slot (ex: 'hero_bg', 'product_gallery_1')
      - `image_url` (text) - URL da imagem no Storage
      - `default_url` (text) - URL padrão caso não haja imagem customizada
      - `description` (text) - Descrição do slot
      - `updated_at` (timestamptz)

  2. Segurança
    - RLS habilitado
    - Todos podem visualizar (SELECT)
    - Apenas usuários autenticados podem atualizar (UPDATE)
    - Não permite INSERT ou DELETE (slots são fixos)

  3. Slots Pré-definidos
    - hero_bg: Imagem de fundo do Hero
    - differentials_bg: Imagem de fundo dos Diferenciais
    - product_gallery_1, 2, 3: Galeria de produtos
    - course_card_1, 2: Cards de cursos
*/

CREATE TABLE IF NOT EXISTS site_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id text UNIQUE NOT NULL,
  image_url text,
  default_url text NOT NULL,
  description text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site images"
  ON site_images
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update site images"
  ON site_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS site_images_slot_id_idx ON site_images(slot_id);

DROP TRIGGER IF EXISTS update_site_images_updated_at ON site_images;
CREATE TRIGGER update_site_images_updated_at
  BEFORE UPDATE ON site_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

INSERT INTO site_images (slot_id, image_url, default_url, description) VALUES
  ('hero_bg', 'https://i.imgur.com/HtRfEMb.jpeg', 'https://i.imgur.com/HtRfEMb.jpeg', 'Imagem de fundo do Hero'),
  ('differentials_bg', 'https://i.imgur.com/nHXjTtQ.jpg', 'https://i.imgur.com/nHXjTtQ.jpg', 'Imagem de fundo dos Diferenciais'),
  ('product_gallery_1', NULL, 'https://via.placeholder.com/800x450/1f2937/ffffff?text=Produto+1', 'Primeira imagem da galeria de produtos'),
  ('product_gallery_2', NULL, 'https://via.placeholder.com/800x450/1f2937/ffffff?text=Produto+2', 'Segunda imagem da galeria de produtos'),
  ('product_gallery_3', NULL, 'https://via.placeholder.com/800x450/1f2937/ffffff?text=Produto+3', 'Terceira imagem da galeria de produtos'),
  ('course_card_1', '/src/assets/image.png', '/src/assets/image.png', 'Imagem do primeiro curso'),
  ('course_card_2', '/src/assets/image.png', '/src/assets/image.png', 'Imagem do segundo curso')
ON CONFLICT (slot_id) DO NOTHING;
