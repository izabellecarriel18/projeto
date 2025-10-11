/*
  # UltimateCars3D Platform Schema

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text) - Product name (e.g., "Audi S5 Sedan")
      - `category` (text) - Category: "solid_cars", "complete_cars", "wheels", "bus_truck"
      - `brand` (text) - Car brand (Audi, BMW, etc.)
      - `image_url` (text) - Product image URL
      - `price` (numeric) - Price in BRL
      - `formats` (text[]) - Available file formats (STL)
      - `description` (text) - Product description
      - `created_at` (timestamptz)
      
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text) - Course title
      - `description` (text) - Course description
      - `image_url` (text) - Course cover image
      - `price` (numeric) - Course price in BRL
      - `installment_price` (numeric) - Monthly installment price
      - `installments` (integer) - Number of installments
      - `level` (text) - Course level (Beginner, Intermediate, Advanced)
      - `duration` (text) - Course duration
      - `format` (text) - Course format (Online, Video, etc.)
      - `modules` (integer) - Number of modules
      - `created_at` (timestamptz)
      
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text) - Customer name
      - `avatar_url` (text) - Customer photo URL
      - `rating` (integer) - Rating (1-5 stars)
      - `text` (text) - Testimonial text
      - `created_at` (timestamptz)
      
    - `faqs`
      - `id` (uuid, primary key)
      - `question` (text) - FAQ question
      - `answer` (text) - FAQ answer
      - `category` (text) - FAQ category: "general", "courses", "products"
      - `display_order` (integer) - Display order
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Tables are read-only for public users
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  brand text NOT NULL,
  image_url text NOT NULL,
  price numeric NOT NULL,
  formats text[] NOT NULL DEFAULT '{}',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  price numeric NOT NULL,
  installment_price numeric NOT NULL,
  installments integer NOT NULL DEFAULT 12,
  level text NOT NULL,
  duration text NOT NULL,
  format text NOT NULL,
  modules integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  avatar_url text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Courses are viewable by everyone"
  ON courses FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Testimonials are viewable by everyone"
  ON testimonials FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "FAQs are viewable by everyone"
  ON faqs FOR SELECT
  TO anon
  USING (true);