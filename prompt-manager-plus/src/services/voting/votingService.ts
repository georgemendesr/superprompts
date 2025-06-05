
import { supabase } from '@/integrations/supabase/client';

export class VotingService {
  static async voteUp(promptId: string): Promise<number> {
    try {
      // Primeiro, buscar o score atual
      const { data: currentPrompt, error: fetchError } = await supabase
        .from('prompts')
        .select('score')
        .eq('id', promptId)
        .single();

      if (fetchError) throw fetchError;

      const currentScore = currentPrompt?.score || 0;
      const newScore = Math.min(currentScore + 1, 100); // Máximo 100

      const { data, error } = await supabase
        .from('prompts')
        .update({ score: newScore })
        .eq('id', promptId)
        .select('score')
        .single();

      if (error) throw error;
      return data.score;
    } catch (error) {
      console.error('Erro ao votar positivamente:', error);
      throw error;
    }
  }

  static async voteDown(promptId: string): Promise<number> {
    try {
      // Primeiro, buscar o score atual
      const { data: currentPrompt, error: fetchError } = await supabase
        .from('prompts')
        .select('score')
        .eq('id', promptId)
        .single();

      if (fetchError) throw fetchError;

      const currentScore = currentPrompt?.score || 0;
      const newScore = Math.max(currentScore - 1, 0); // Mínimo 0

      const { data, error } = await supabase
        .from('prompts')
        .update({ score: newScore })
        .eq('id', promptId)
        .select('score')
        .single();

      if (error) throw error;
      return data.score;
    } catch (error) {
      console.error('Erro ao votar negativamente:', error);
      throw error;
    }
  }

  static async getTopPrompts(subsection?: string, limit: number = 10) {
    try {
      let query = supabase
        .from('prompts')
        .select(`
          *,
          categories (
            id,
            name,
            parent_id
          )
        `)
        .order('score', { ascending: false })
        .limit(limit);

      if (subsection) {
        query = query.eq('subsection', subsection);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar top prompts:', error);
      throw error;
    }
  }
}
