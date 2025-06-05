
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { VotingService } from '@/services/voting/votingService';
import { toast } from 'sonner';

export const useVoting = () => {
  const queryClient = useQueryClient();

  const voteUpMutation = useMutation({
    mutationFn: VotingService.voteUp,
    onSuccess: (newScore, promptId) => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      toast.success(`Prompt avaliado! Score: ${newScore}`);
    },
    onError: (error) => {
      console.error('Erro ao votar:', error);
      toast.error('Erro ao avaliar prompt');
    }
  });

  const voteDownMutation = useMutation({
    mutationFn: VotingService.voteDown,
    onSuccess: (newScore, promptId) => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      toast.success(`Prompt avaliado! Score: ${newScore}`);
    },
    onError: (error) => {
      console.error('Erro ao votar:', error);
      toast.error('Erro ao avaliar prompt');
    }
  });

  const voteUp = (promptId: string) => {
    voteUpMutation.mutate(promptId);
  };

  const voteDown = (promptId: string) => {
    voteDownMutation.mutate(promptId);
  };

  return {
    voteUp,
    voteDown,
    isVoting: voteUpMutation.isPending || voteDownMutation.isPending
  };
};
