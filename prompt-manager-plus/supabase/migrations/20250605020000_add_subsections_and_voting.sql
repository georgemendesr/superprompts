
-- Adicionar subseção aos prompts
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS subsection text DEFAULT 'music';

-- Adicionar score para sistema de votação
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS score integer DEFAULT 0;

-- Atualizar tabela de links para incluir título e categoria
ALTER TABLE public.links ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.links ADD COLUMN IF NOT EXISTS category text DEFAULT 'geral';

-- Atualizar tabela de lyrics para incluir artista e tags
ALTER TABLE public.lyrics ADD COLUMN IF NOT EXISTS artist text;
ALTER TABLE public.lyrics ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[];

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_prompts_subsection ON public.prompts(subsection);
CREATE INDEX IF NOT EXISTS idx_prompts_score ON public.prompts(score DESC);
CREATE INDEX IF NOT EXISTS idx_links_category ON public.links(category);
CREATE INDEX IF NOT EXISTS idx_lyrics_artist ON public.lyrics(artist);

-- Criar tabela para conversões (conversor)
CREATE TABLE IF NOT EXISTS public.conversions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    url text NOT NULL,
    format text NOT NULL, -- 'mp3' ou 'mp4'
    status text DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'error'
    output_url text,
    title text,
    duration text,
    file_size text,
    error_message text
);

-- Criar índice para conversões
CREATE INDEX IF NOT EXISTS idx_conversions_status ON public.conversions(status);
CREATE INDEX IF NOT EXISTS idx_conversions_created_at ON public.conversions(created_at DESC);
