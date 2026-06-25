-- Add is_featured column to products table
ALTER TABLE public.products 
ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;

-- Create an index for faster querying of featured products
CREATE INDEX idx_products_is_featured ON public.products(is_featured);
