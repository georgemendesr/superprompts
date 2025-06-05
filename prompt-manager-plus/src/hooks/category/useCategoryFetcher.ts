
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { fetchAllDataOptimized, buildOptimizedCategoryTree } from "@/services/optimized/optimizedDataService";
import type { Category } from "@/types/prompt";

export const useCategoryFetcher = () => {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const loadCategories = useCallback(async (limit: number = 50, offset: number = 0) => {
    try {
      setLoading(true);
      setLoadError(null);
      console.log('Iniciando carregamento de dados otimizado...');
      
      // Usar o serviço otimizado que faz uma única query consolidada
      const { categories, promptsWithComments } = await fetchAllDataOptimized(limit, offset);

      console.log('Dados carregados com sucesso:', {
        categories: categories.length,
        prompts: promptsWithComments.length
      });

      // Construir árvore otimizada
      const categoriesWithPrompts = buildOptimizedCategoryTree(categories, promptsWithComments);
      
      if (!initialized) {
        toast.success('Dados carregados com sucesso!');
        setInitialized(true);
      }
      
      setLoading(false);
      return categoriesWithPrompts;
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      setLoadError(error?.message || 'Erro de conexão com o banco de dados');
      
      // Only show toast on first error
      if (!initialized) {
        toast.error('Erro ao conectar com o banco de dados');
      }
      
      setLoading(false);
      return null;
    }
  }, [initialized]);

  return {
    loading,
    loadError,
    loadCategories
  };
};
