
import { supabase } from "../base/supabaseService";
import type { Lyric } from "@/types/lyric";

export const fetchLyrics = async (searchTerm?: string) => {
  try {
    let query = supabase
      .from('lyrics')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,artist.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
    }
    
    return await query;
  } catch (error) {
    console.error('Erro ao buscar letras:', error);
    return { data: null, error };
  }
};

export const addLyric = async (lyric: Omit<Lyric, 'id' | 'created_at'>) => {
  return await supabase
    .from('lyrics')
    .insert({ 
      title: lyric.title, 
      artist: lyric.artist,
      content: lyric.content,
      tags: lyric.tags || []
    })
    .select()
    .single();
};

export const addLyricToDb = addLyric; // Alias for compatibility

export const updateLyric = async (id: string, lyric: Partial<Omit<Lyric, 'id' | 'created_at'>>) => {
  return await supabase
    .from('lyrics')
    .update({ 
      title: lyric.title, 
      artist: lyric.artist,
      content: lyric.content,
      tags: lyric.tags
    })
    .eq('id', id);
};

export const deleteLyric = async (id: string) => {
  return await supabase
    .from('lyrics')
    .delete()
    .eq('id', id);
};

export const deleteLyricFromDb = deleteLyric; // Alias for compatibility

export const fetchLyricsByArtist = async (artist: string) => {
  try {
    return await supabase
      .from('lyrics')
      .select('*')
      .eq('artist', artist)
      .order('created_at', { ascending: false });
  } catch (error) {
    console.error('Erro ao buscar letras por artista:', error);
    return { data: null, error };
  }
};

export const fetchArtists = async () => {
  try {
    const { data, error } = await supabase
      .from('lyrics')
      .select('artist')
      .not('artist', 'is', null);
    
    if (error) throw error;
    
    // Extrair artistas únicos
    const artists = [...new Set(data?.map(item => item.artist) || [])];
    return { data: artists.filter(Boolean), error: null };
  } catch (error) {
    console.error('Erro ao buscar artistas:', error);
    return { data: [], error };
  }
};
