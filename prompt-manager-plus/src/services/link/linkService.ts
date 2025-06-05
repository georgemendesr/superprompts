
import { supabase } from "../base/supabaseService";
import type { Link } from "@/types/link";

export const fetchLinks = async (category?: string) => {
  try {
    let query = supabase
      .from('links')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    return await query;
  } catch (error) {
    console.error('Erro ao buscar links:', error);
    return { data: null, error };
  }
};

export const addLink = async (link: Omit<Link, 'id' | 'created_at'>) => {
  return await supabase
    .from('links')
    .insert({ 
      url: link.url, 
      title: link.title,
      description: link.description,
      category: link.category || 'geral'
    })
    .select()
    .single();
};

export const addLinkToDb = addLink; // Alias for compatibility

export const updateLink = async (id: string, link: Partial<Omit<Link, 'id' | 'created_at'>>) => {
  return await supabase
    .from('links')
    .update({ 
      url: link.url, 
      title: link.title,
      description: link.description,
      category: link.category
    })
    .eq('id', id);
};

export const deleteLink = async (id: string) => {
  return await supabase
    .from('links')
    .delete()
    .eq('id', id);
};

export const deleteLinkFromDb = deleteLink; // Alias for compatibility

export const fetchLinkCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('links')
      .select('category')
      .not('category', 'is', null);
    
    if (error) throw error;
    
    // Extrair categorias únicas
    const categories = [...new Set(data?.map(item => item.category) || [])];
    return { data: categories.filter(Boolean), error: null };
  } catch (error) {
    console.error('Erro ao buscar categorias de links:', error);
    return { data: [], error };
  }
};
