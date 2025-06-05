
export type Prompt = {
  id: string;
  text: string;
  category: string;
  category_id: string;
  rating: number; // Pontuação de votos
  comments: string[];
  tags: string[];
  createdAt: Date;
  created_at: string;
  selected?: boolean;
  isEditing?: boolean;
  backgroundColor?: string;
  background_color?: string;
  score?: number; // Nova propriedade para pontuação de votos
  subsection?: string; // Nova propriedade para subseção (music, text, image)
  rank?: number; // Nova propriedade para posição no ranking
};

export type Category = {
  id: string;
  name: string;
  prompts: Prompt[];
  parentId?: string;
  subcategories?: Category[];
};

export type MusicStructure = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  effect: string;
};

export type WorkspaceItem = {
  id: string;
  text: string;
  createdAt: Date;
};
