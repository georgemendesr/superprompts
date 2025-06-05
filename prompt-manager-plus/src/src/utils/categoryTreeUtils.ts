
import type { Category } from "@/types/prompt";
import type { RawCategory, CategoryRecord } from "@/types/category";

// Função otimizada para construir árvore de categorias com complexidade O(n)
export const buildCategoryTree = (
  categories: CategoryRecord[],
  parentId: string | null = null
): Category[] => {
  // Criar maps para acesso O(1) em vez de filter O(n) repetido
  const categoryMap = new Map<string, CategoryRecord>();
  const childrenMap = new Map<string, string[]>();
  
  // Indexar categorias - O(n)
  categories.forEach(category => {
    categoryMap.set(category.id, category);
    
    // Indexar filhos
    const parent = category.parent_id || 'root';
    if (!childrenMap.has(parent)) {
      childrenMap.set(parent, []);
    }
    childrenMap.get(parent)!.push(category.id);
  });
  
  // Função recursiva otimizada
  const buildTree = (currentParentId: string | null = null): Category[] => {
    const key = currentParentId || 'root';
    const childIds = childrenMap.get(key) || [];
    
    return childIds.map(categoryId => {
      const category = categoryMap.get(categoryId)!;
      return {
        id: category.id,
        name: category.name,
        parentId: category.parent_id,
        prompts: [],
        subcategories: buildTree(category.id)
      };
    });
  };
  
  return buildTree(parentId);
};

export const updateTreeWithPrompts = (newTree: Category[], oldCategories: Category[]): Category[] => {
  // Criar map para acesso O(1)
  const oldCategoryMap = new Map<string, Category>();
  
  // Função recursiva para indexar todas as categorias antigas
  const indexCategories = (categories: Category[]) => {
    categories.forEach(category => {
      oldCategoryMap.set(category.id, category);
      if (category.subcategories) {
        indexCategories(category.subcategories);
      }
    });
  };
  
  indexCategories(oldCategories);
  
  // Atualizar árvore com prompts
  const updateTree = (categories: Category[]): Category[] => {
    return categories.map(category => {
      const oldCategory = oldCategoryMap.get(category.id);
      return {
        ...category,
        prompts: oldCategory?.prompts || [],
        subcategories: category.subcategories ? updateTree(category.subcategories) : []
      };
    });
  };
  
  return updateTree(newTree);
};

export const removeCategoryFromTree = (categories: Category[], id: string): Category[] => {
  return categories.filter(category => {
    if (category.id === id) return false;
    if (category.subcategories?.length) {
      category.subcategories = removeCategoryFromTree(category.subcategories, id);
    }
    return true;
  });
};
