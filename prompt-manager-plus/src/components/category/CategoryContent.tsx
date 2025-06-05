
import React, { memo, useMemo } from "react";
import { CategorySearch } from "./CategorySearch";
import { CategoryActions } from "@/components/CategoryActions";
import { PromptCard } from "@/components/PromptCard";
import type { Category, Prompt } from "@/types/prompt";

interface CategoryContentProps {
  category: Category;
  level: number;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  categories: Category[];
  onRatePrompt: (id: string, increment: boolean) => void;
  onAddComment: (id: string, comment: string) => void;
  onMovePrompt: (promptId: string, targetCategoryId: string) => void;
  onTogglePromptSelection: (id: string, selected: boolean) => void;
  onToggleSelectAll: (categoryName: string, selected: boolean) => void;
  onDeleteSelectedPrompts: (categoryName: string) => void;
}

// Componente otimizado com React.memo e useMemo para cálculos pesados
export const CategoryContent = memo(({
  category,
  level,
  searchTerm,
  setSearchTerm,
  categories,
  onRatePrompt,
  onAddComment,
  onMovePrompt,
  onTogglePromptSelection,
  onToggleSelectAll,
  onDeleteSelectedPrompts,
}: CategoryContentProps) => {
  // Memoizar o cálculo de prompts filtrados e ordenados
  const orderedPrompts = useMemo(() => {
    // Primeiro aplicamos a busca
    const filteredPrompts = category.prompts.filter(prompt => 
      prompt.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.comments.some(comment => 
        comment.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Ordenamos os prompts por pontuação, do maior para o menor
    return [...filteredPrompts]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      // Atribuímos o ranking a cada prompt após a ordenação
      .map((prompt, index) => ({
        ...prompt,
        rank: index + 1
      }));
  }, [category.prompts, searchTerm]);

  return (
    <div className="space-y-6">
      {level === 0 && (
        <CategorySearch 
          value={searchTerm} 
          onChange={(value) => setSearchTerm(value)} 
        />
      )}

      <CategoryActions
        prompts={category.prompts}
        onSelectAll={(checked) => onToggleSelectAll(category.name, checked)}
        onDelete={() => onDeleteSelectedPrompts(category.name)}
        onMove={(targetCategoryId) => {
          const selectedPrompts = category.prompts.filter(p => p.selected);
          selectedPrompts.forEach(prompt => onMovePrompt(prompt.id, targetCategoryId));
        }}
        categories={categories}
        currentCategoryId={category.id}
      />

      <div className="grid gap-6">
        {orderedPrompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onRate={onRatePrompt}
            onAddComment={onAddComment}
            onSelect={onTogglePromptSelection}
            selected={prompt.selected || false}
            categories={categories}
            searchTerm={searchTerm}
          />
        ))}
      </div>

      {orderedPrompts.length === 0 && (!category.subcategories || category.subcategories.length === 0) && (
        <div className="text-center py-8 text-gray-500 bg-gray-50/50 rounded-lg backdrop-blur-sm">
          {searchTerm ? "Nenhum prompt encontrado" : "Nenhum prompt nesta categoria ainda"}
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Comparação customizada para otimizar re-renderizações
  return (
    prevProps.category.id === nextProps.category.id &&
    prevProps.level === nextProps.level &&
    prevProps.searchTerm === nextProps.searchTerm &&
    JSON.stringify(prevProps.category.prompts) === JSON.stringify(nextProps.category.prompts)
  );
});

CategoryContent.displayName = 'CategoryContent';
