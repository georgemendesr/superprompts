
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLinks, addLink, updateLink, deleteLink, fetchLinkCategories } from '@/services/link/linkService';
import { Link } from '@/types/link';
import { toast } from 'sonner';

export const useLinks = (category?: string) => {
  const queryClient = useQueryClient();

  const {
    data: links = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['links', category],
    queryFn: () => fetchLinks(category),
    select: (data) => data?.data || [],
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const {
    data: categories = [],
    isLoading: categoriesLoading
  } = useQuery({
    queryKey: ['link-categories'],
    queryFn: fetchLinkCategories,
    select: (data) => data?.data || [],
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  const createLinkMutation = useMutation({
    mutationFn: (link: Omit<Link, 'id' | 'created_at'>) => addLink(link),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['link-categories'] });
      toast.success('Link adicionado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar link:', error);
      toast.error('Erro ao adicionar link');
    }
  });

  const updateLinkMutation = useMutation({
    mutationFn: ({ id, link }: { id: string; link: Partial<Omit<Link, 'id' | 'created_at'>> }) =>
      updateLink(id, link),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['link-categories'] });
      toast.success('Link atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar link:', error);
      toast.error('Erro ao atualizar link');
    }
  });

  const deleteLinkMutation = useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['link-categories'] });
      toast.success('Link removido com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao deletar link:', error);
      toast.error('Erro ao remover link');
    }
  });

  const createLink = (link: Omit<Link, 'id' | 'created_at'>) => {
    createLinkMutation.mutate(link);
  };

  const updateLinkData = (id: string, link: Partial<Omit<Link, 'id' | 'created_at'>>) => {
    updateLinkMutation.mutate({ id, link });
  };

  const deleteLinkData = (id: string) => {
    deleteLinkMutation.mutate(id);
  };

  return {
    links,
    categories,
    isLoading,
    categoriesLoading,
    error,
    createLink,
    updateLink: updateLinkData,
    deleteLink: deleteLinkData,
    isCreating: createLinkMutation.isPending,
    isUpdating: updateLinkMutation.isPending,
    isDeleting: deleteLinkMutation.isPending
  };
};
