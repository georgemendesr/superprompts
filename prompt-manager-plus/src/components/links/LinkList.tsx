
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, Edit, Trash2, Filter, Globe } from 'lucide-react';
import { useLinks } from '@/hooks/useLinks';
import { Link } from '@/types/link';

interface LinkItemProps {
  link: Link;
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
}

const LinkItem: React.FC<LinkItemProps> = ({ link, onEdit, onDelete }) => {
  const handleOpenLink = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-lg truncate">
                {link.title || getDomain(link.url)}
              </h3>
              {link.category && (
                <Badge variant="outline" className="text-xs">
                  {link.category}
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-blue-600 hover:underline cursor-pointer mb-2 truncate"
               onClick={handleOpenLink}>
              {link.url}
            </p>
            
            {link.description && (
              <p className="text-sm text-gray-700 mb-2">
                {link.description}
              </p>
            )}
            
            <p className="text-xs text-muted-foreground">
              Adicionado em {new Date(link.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenLink}
              className="hover:bg-blue-50"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(link)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(link.id)}
              className="hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const LinkList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { links, categories, isLoading, deleteLink } = useLinks(selectedCategory);

  const handleEdit = (link: Link) => {
    // TODO: Implementar edição
    console.log('Editar link:', link);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2" />
            Carregando links...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtrar por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {links.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {selectedCategory === 'all' 
                ? 'Nenhum link cadastrado ainda.' 
                : `Nenhum link encontrado na categoria "${selectedCategory}".`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {links.length} link{links.length !== 1 ? 's' : ''} encontrado{links.length !== 1 ? 's' : ''}
            </h3>
          </div>
          
          {links.map((link) => (
            <LinkItem
              key={link.id}
              link={link}
              onEdit={handleEdit}
              onDelete={deleteLink}
            />
          ))}
        </div>
      )}
    </div>
  );
};
