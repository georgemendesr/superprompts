
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPrompts, createPromptWithSubsection, updatePromptScore } from '@/services/prompt/promptService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const usePromptsWithSubsections = (
  categoryId?: string, 
  subsection?: string,
  page: number = 1, 
  limit: number = 20
) => {
  const queryClient = useQueryClient();

  const {
    data: prompts = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['prompts-subsections', categoryId, subsection, page, limit],
    queryFn: async () => {
      const offset = (page - 1) * limit;
      const { data, error } = await fetchPrompts(limit, offset, subsection, categoryId);
      
      if (error) {
        console.error('Erro ao buscar prompts:', error);
        throw error;
      }
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });

  const createPromptMutation = useMutation({
    mutationFn: async ({ text, categoryId, subsection, tags, backgroundColor }: {
      text: string;
      categoryId: string;
      subsection?: string;
      tags?: string[];
      backgroundColor?: string;
    }) => {
      const { data, error } = await createPromptWithSubsection(
        text,
        categoryId,
        subsection || 'music',
        tags,
        backgroundColor
      );

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts-subsections'] });
      toast.success('Prompt criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar prompt:', error);
      toast.error('Erro ao criar prompt');
    }
  });

  const updatePromptMutation = useMutation({
    mutationFn: async ({ id, text, tags, backgroundColor, score, subsection }: {
      id: string;
      text?: string;
      tags?: string[];
      backgroundColor?: string;
      score?: number;
      subsection?: string;
    }) => {
      const updateData: any = {};
      if (text !== undefined) updateData.text = text.trim();
      if (tags !== undefined) updateData.tags = tags;
      if (backgroundColor !== undefined) updateData.background_color = backgroundColor;
      if (score !== undefined) updateData.score = Math.max(0, Math.min(100, score));
      if (subsection !== undefined) updateData.subsection = subsection;

      const { data, error } = await supabase
        .from('prompts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts-subsections'] });
      toast.success('Prompt atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar prompt:', error);
      toast.error('Erro ao atualizar prompt');
    }
  });

  const deletePromptMutation = useMutation({
    mutationFn: async (id: string) => {
      // Primeiro deletar comentários
      const { error: commentsError } = await supabase
        .from('comments')
        .delete()
        .eq('prompt_id', id);

      if (commentsError) throw commentsError;

      // Depois deletar o prompt
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts-subsections'] });
      toast.success('Prompt deletado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao deletar prompt:', error);
      toast.error('Erro ao deletar prompt');
    }
  });

  const createPrompt = (data: {
    text: string;
    categoryId: string;
    subsection?: string;
    tags?: string[];
    backgroundColor?: string;
  }) => {
    createPromptMutation.mutate(data);
  };

  const updatePrompt = (data: {
    id: string;
    text?: string;
    tags?: string[];
    backgroundColor?: string;
    score?: number;
    subsection?: string;
  }) => {
    updatePromptMutation.mutate(data);
  };

  const deletePrompt = (id: string) => {
    deletePromptMutation.mutate(id);
  };

  return {
    prompts,
    isLoading,
    error,
    refetch,
    createPrompt,
    updatePrompt,
    deletePrompt,
    isCreating: createPromptMutation.isPending,
    isUpdating: updatePromptMutation.isPending,
    isDeleting: deletePromptMutation.isPending
  };
};
