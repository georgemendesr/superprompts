
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLyrics, addLyric, updateLyric, deleteLyric } from '@/services/lyric/lyricService';
import { Lyric } from '@/types/lyric';
import { toast } from 'sonner';

export const useLyrics = (searchTerm?: string) => {
  const queryClient = useQueryClient();

  const {
    data: lyrics = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['lyrics', searchTerm],
    queryFn: () => fetchLyrics(searchTerm),
    select: (data) => data?.data || [],
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const createLyricMutation = useMutation({
    mutationFn: (lyric: Omit<Lyric, 'id' | 'created_at'>) => addLyric(lyric),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lyrics'] });
      toast.success('Letra adicionada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar letra:', error);
      toast.error('Erro ao adicionar letra');
    }
  });

  const updateLyricMutation = useMutation({
    mutationFn: ({ id, lyric }: { id: string; lyric: Partial<Omit<Lyric, 'id' | 'created_at'>> }) =>
      updateLyric(id, lyric),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lyrics'] });
      toast.success('Letra atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar letra:', error);
      toast.error('Erro ao atualizar letra');
    }
  });

  const deleteLyricMutation = useMutation({
    mutationFn: deleteLyric,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lyrics'] });
      toast.success('Letra removida com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao deletar letra:', error);
      toast.error('Erro ao remover letra');
    }
  });

  const createLyric = (lyric: Omit<Lyric, 'id' | 'created_at'>) => {
    createLyricMutation.mutate(lyric);
  };

  const updateLyricData = (id: string, lyric: Partial<Omit<Lyric, 'id' | 'created_at'>>) => {
    updateLyricMutation.mutate({ id, lyric });
  };

  const deleteLyricData = (id: string) => {
    deleteLyricMutation.mutate(id);
  };

  return {
    lyrics,
    isLoading,
    error,
    createLyric,
    updateLyric: updateLyricData,
    deleteLyric: deleteLyricData,
    isCreating: createLyricMutation.isPending,
    isUpdating: updateLyricMutation.isPending,
    isDeleting: deleteLyricMutation.isPending
  };
};
