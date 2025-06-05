
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ConversionService } from '@/services/conversion/conversionService';
import { ConversionRequest } from '@/types/conversion';
import { toast } from 'sonner';

export const useConversions = () => {
  const queryClient = useQueryClient();

  const {
    data: conversions = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['conversions'],
    queryFn: ConversionService.getConversions,
    refetchInterval: 5000 // Atualiza a cada 5 segundos para mostrar progresso
  });

  const createConversionMutation = useMutation({
    mutationFn: (request: ConversionRequest) => ConversionService.createConversion(request),
    onSuccess: (conversion) => {
      queryClient.invalidateQueries({ queryKey: ['conversions'] });
      toast.success('Conversão iniciada!');
      
      // Simular o processo de conversão
      ConversionService.simulateConversion(conversion.id);
    },
    onError: (error) => {
      console.error('Erro ao criar conversão:', error);
      toast.error('Erro ao iniciar conversão');
    }
  });

  const deleteConversionMutation = useMutation({
    mutationFn: ConversionService.deleteConversion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversions'] });
      toast.success('Conversão removida!');
    },
    onError: (error) => {
      console.error('Erro ao deletar conversão:', error);
      toast.error('Erro ao remover conversão');
    }
  });

  const createConversion = (request: ConversionRequest) => {
    createConversionMutation.mutate(request);
  };

  const deleteConversion = (id: string) => {
    deleteConversionMutation.mutate(id);
  };

  return {
    conversions,
    isLoading,
    error,
    createConversion,
    deleteConversion,
    isCreating: createConversionMutation.isPending,
    isDeleting: deleteConversionMutation.isPending
  };
};
