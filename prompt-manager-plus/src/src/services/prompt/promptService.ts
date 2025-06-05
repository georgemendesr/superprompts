
import { supabase } from "../base/supabaseService";
import type { DatabaseError } from "@/types/database";

// Função otimizada com paginação real e suporte a subseções
export const fetchPrompts = async (
  limit: number = 20, 
  offset: number = 0, 
  subsection?: string,
  categoryId?: string
) => {
  try {
    let query = supabase
      .from('prompts')
      .select('id, text, category_id, rating, background_color, tags, created_at, score, subsection')
      .order('score', { ascending: false, nullsLast: true })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (subsection) {
      query = query.eq('subsection', subsection);
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    return await query;
  } catch (error) {
    console.error('Erro ao buscar prompts:', error);
    return { data: null, error };
  }
};

export const getPromptsInCategories = async (categoryIds: string[]): Promise<number> => {
  if (categoryIds.length === 0) return 0;
  
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('id', { count: 'exact' })
      .in('category_id', categoryIds);
      
    if (error) throw error;
    
    return data?.length || 0;
  } catch (error) {
    console.error('Erro ao verificar prompts nas categorias:', error);
    return 0;
  }
};

export const deletePromptsInCategories = async (
  categoryIds: string[]
): Promise<{ error: DatabaseError | null }> => {
  if (categoryIds.length === 0) return { error: null };
  
  try {
    // Get all prompts in these categories
    const { data: prompts, error: fetchError } = await supabase
      .from('prompts')
      .select('id')
      .in('category_id', categoryIds);
      
    if (fetchError) throw fetchError;
    
    if (prompts && prompts.length > 0) {
      // Delete all comments for these prompts first
      const promptIds = prompts.map(p => p.id);
      
      const { error: commentsError } = await supabase
        .from('comments')
        .delete()
        .in('prompt_id', promptIds);
        
      if (commentsError) throw commentsError;
      
      // Then delete the prompts
      const { error: promptsError } = await supabase
        .from('prompts')
        .delete()
        .in('category_id', categoryIds);
        
      if (promptsError) throw promptsError;
    }
    
    return { error: null };
  } catch (error: unknown) {
    console.error('Erro ao deletar prompts nas categorias:', error);
    const message =
      error && typeof error === 'object' && 'message' in error
        ? String((error as { message: string }).message)
        : String(error);
    return { error: { message } };
  }
};

export const deletePromptFromDb = async (id: string) => {
  try {
    // Primeiro deletamos todos os comentários associados ao prompt
    const { error: commentsError } = await supabase
      .from('comments')
      .delete()
      .eq('prompt_id', id);
    
    if (commentsError) {
      console.error('Erro ao deletar comentários:', commentsError);
      throw commentsError;
    }
    
    // Depois deletamos o prompt
    const { error } = await supabase
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar prompt:', error);
      throw error;
    }
    
    return { data: null, error: null };
  } catch (error) {
    console.error('Erro ao deletar prompt:', error);
    return { data: null, error };
  }
};

export const updatePromptInDb = async (id: string, text: string) => {
  try {
    const { error } = await supabase
      .from('prompts')
      .update({ text: text.trim() })
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao atualizar prompt:', error);
      throw error;
    }
    
    return { data: null, error: null };
  } catch (error) {
    console.error('Erro ao atualizar prompt:', error);
    return { data: null, error };
  }
};

// Função para criar prompt com subseção
export const createPromptWithSubsection = async (
  text: string,
  categoryId: string,
  subsection: string = 'music',
  tags: string[] = [],
  backgroundColor?: string
) => {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .insert({
        text: text.trim(),
        category_id: categoryId,
        subsection,
        tags,
        background_color: backgroundColor,
        score: 0,
        rating: 0
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao criar prompt:', error);
    return { data: null, error };
  }
};

// Função para atualizar score do prompt
export const updatePromptScore = async (id: string, newScore: number) => {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .update({ score: Math.max(0, Math.min(100, newScore)) })
      .eq('id', id)
      .select('score')
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao atualizar score:', error);
    return { data: null, error };
  }
};

// Função para buscar prompts por subseção
export const fetchPromptsBySubsection = async (
  subsection: string,
  limit: number = 20,
  offset: number = 0
) => {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select(`
        *,
        categories (
          id,
          name,
          parent_id
        )
      `)
      .eq('subsection', subsection)
      .order('score', { ascending: false, nullsLast: true })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Erro ao buscar prompts por subseção:', error);
    return { data: [], error };
  }
};

// Função para converter prompts para formato CSV
export const convertPromptsToCSV = (prompts: Array<{
  text: string;
  category: string;
  rating: number;
  comments: string[];
  tags: string[];
  createdAt: string;
  score?: number;
  subsection?: string;
}>): string => {
  // Headers
  let csv = "Texto,Categoria,Subseção,Avaliação,Score,Comentários,Tags,Data de Criação\n";
  
  // Adicionar cada linha
  prompts.forEach(prompt => {
    // Escapar aspas nos campos de texto e comentários
    const escapedText = prompt.text.replace(/"/g, '""');
    const escapedComments = prompt.comments.join(" | ").replace(/"/g, '""');
    const escapedTags = prompt.tags.join(', ').replace(/"/g, '""');

    csv += `"${escapedText}","${prompt.category}","${prompt.subsection || 'music'}",${prompt.rating},${prompt.score || 0},"${escapedComments}","${escapedTags}","${prompt.createdAt}"\n`;
  });
  
  return csv;
};
