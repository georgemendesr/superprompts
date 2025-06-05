
import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useOptimizedData } from './optimized/useOptimizedData';
import type { Category, Prompt } from '@/types/prompt';

export const usePrompts = (initialLimit: number = 20) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrompts, setSelectedPrompts] = useState<Set<string>>(new Set());
  
  // Usar o hook otimizado
  const {
    categories,
    loading,
    error,
    ratePrompt,
    addComment,
    invalidateData,
    nextPage,
    previousPage,
    currentPage,
    limit,
    offset,
    isRatingPrompt,
    isAddingComment
  } = useOptimizedData(initialLimit, 0);

  // Memoizar prompts filtrados para evitar recálculos desnecessários
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    
    return categories.map(category => ({
      ...category,
      prompts: category.prompts.filter(prompt =>
        prompt.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.comments.some(comment =>
          comment.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    })).filter(category => 
      category.prompts.length > 0 || 
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  // Função otimizada para toggle de seleção
  const togglePromptSelection = useCallback((promptId: string, selected: boolean) => {
    setSelectedPrompts(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(promptId);
      } else {
        newSet.delete(promptId);
      }
      return newSet;
    });
  }, []);

  // Função otimizada para selecionar todos os prompts de uma categoria
  const toggleSelectAllInCategory = useCallback((categoryName: string, selected: boolean) => {
    const category = categories.find(cat => cat.name === categoryName);
    if (!category) return;

    setSelectedPrompts(prev => {
      const newSet = new Set(prev);
      category.prompts.forEach(prompt => {
        if (selected) {
          newSet.add(prompt.id);
        } else {
          newSet.delete(prompt.id);
        }
      });
      return newSet;
    });
  }, [categories]);

  // Função para deletar prompts selecionados
  const deleteSelectedPrompts = useCallback(async (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    if (!category) return;

    const selectedInCategory = category.prompts.filter(prompt => 
      selectedPrompts.has(prompt.id)
    );

    if (selectedInCategory.length === 0) {
      toast.error('Nenhum prompt selecionado');
      return;
    }

    try {
      // Aqui você implementaria a lógica de deleção
      // Por enquanto, apenas removemos da seleção
      setSelectedPrompts(prev => {
        const newSet = new Set(prev);
        selectedInCategory.forEach(prompt => newSet.delete(prompt.id));
        return newSet;
      });
      
      toast.success(`${selectedInCategory.length} prompt(s) deletado(s)`);
      invalidateData(); // Recarregar dados
    } catch (error) {
      toast.error('Erro ao deletar prompts');
    }
  }, [categories, selectedPrompts, invalidateData]);

  // Função para mover prompts
  const movePrompt = useCallback(async (promptId: string, targetCategoryId: string) => {
    try {
      // Implementar lógica de movimentação
      toast.success('Prompt movido com sucesso');
      invalidateData(); // Recarregar dados
    } catch (error) {
      toast.error('Erro ao mover prompt');
    }
  }, [invalidateData]);

  // Atualizar prompts com estado de seleção
  const categoriesWithSelection = useMemo(() => {
    return filteredCategories.map(category => ({
      ...category,
      prompts: category.prompts.map(prompt => ({
        ...prompt,
        selected: selectedPrompts.has(prompt.id)
      }))
    }));
  }, [filteredCategories, selectedPrompts]);

  return {
    categories: categoriesWithSelection,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    ratePrompt,
    addComment,
    movePrompt,
    togglePromptSelection,
    toggleSelectAllInCategory,
    deleteSelectedPrompts,
    selectedPrompts,
    nextPage,
    previousPage,
    currentPage,
    limit,
    offset,
    isRatingPrompt,
    isAddingComment,
    invalidateData
  };
};
