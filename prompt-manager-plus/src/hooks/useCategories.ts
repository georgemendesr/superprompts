
import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useCategoryFetcher } from './category/useCategoryFetcher';
import { addCategoryToDb, updateCategoryInDb } from '@/services/categoryService';
import { useForceDeleteCategory } from './useForceDeleteCategory';
import type { Category } from '@/types/prompt';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { loading, loadError, loadCategories } = useCategoryFetcher();
  const { forceDeleteCategory } = useForceDeleteCategory();

  // Memoizar categorias para evitar recálculos
  const memoizedCategories = useMemo(() => categories, [categories]);

  // Função otimizada para carregar categorias
  const fetchCategories = useCallback(async (limit: number = 50, offset: number = 0) => {
    try {
      const result = await loadCategories(limit, offset);
      if (result) {
        setCategories(result);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      toast.error('Erro ao carregar categorias');
    }
  }, [loadCategories]);

  // Função para adicionar categoria
  const addCategory = useCallback(async (name: string, parentId?: string) => {
    try {
      const { data, error } = await addCategoryToDb(name, parentId);
      
      if (error) {
        toast.error('Erro ao adicionar categoria');
        return false;
      }

      toast.success('Categoria adicionada com sucesso');
      await fetchCategories(); // Recarregar categorias
      return true;
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      toast.error('Erro ao adicionar categoria');
      return false;
    }
  }, [fetchCategories]);

  // Função para editar categoria
  const editCategory = useCallback(async (id: string, newName: string, newParentId?: string) => {
    try {
      const { error } = await updateCategoryInDb(id, newName, newParentId || null);
      
      if (error) {
        toast.error('Erro ao editar categoria');
        return false;
      }

      toast.success('Categoria editada com sucesso');
      await fetchCategories(); // Recarregar categorias
      return true;
    } catch (error) {
      console.error('Erro ao editar categoria:', error);
      toast.error('Erro ao editar categoria');
      return false;
    }
  }, [fetchCategories]);

  // Função para deletar categoria
  const deleteCategory = useCallback(async (id: string) => {
    try {
      const success = await forceDeleteCategory(id);
      
      if (success) {
        toast.success('Categoria deletada com sucesso');
        await fetchCategories(); // Recarregar categorias
        return true;
      } else {
        toast.error('Erro ao deletar categoria');
        return false;
      }
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      toast.error('Erro ao deletar categoria');
      return false;
    }
  }, [forceDeleteCategory, fetchCategories]);

  return {
    categories: memoizedCategories,
    loading,
    error: loadError,
    fetchCategories,
    addCategory,
    editCategory,
    deleteCategory
  };
};
