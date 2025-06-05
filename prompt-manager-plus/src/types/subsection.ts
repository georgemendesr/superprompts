
export type SubsectionType = 'music' | 'text' | 'image';

export interface Subsection {
  id: SubsectionType;
  name: string;
  icon: string;
  description: string;
}

export const SUBSECTIONS: Subsection[] = [
  {
    id: 'music',
    name: 'Música',
    icon: 'Music',
    description: 'Prompts para criação musical'
  },
  {
    id: 'text',
    name: 'Texto',
    icon: 'FileText',
    description: 'Prompts para geração de texto'
  },
  {
    id: 'image',
    name: 'Imagem',
    icon: 'Image',
    description: 'Prompts para criação de imagens'
  }
];
