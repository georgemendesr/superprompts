
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Music, User, Search, Edit, Trash2, Eye } from 'lucide-react';
import { useLyrics } from '@/hooks/useLyrics';
import { Lyric } from '@/types/lyric';

interface LyricItemProps {
  lyric: Lyric;
  onEdit: (lyric: Lyric) => void;
  onDelete: (id: string) => void;
}

const LyricItem: React.FC<LyricItemProps> = ({ lyric, onEdit, onDelete }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  
  const previewContent = lyric.content.length > 150 
    ? lyric.content.substring(0, 150) + '...'
    : lyric.content;

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Music className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-lg truncate">{lyric.title}</h3>
            </div>
            
            {lyric.artist && (
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-muted-foreground">{lyric.artist}</span>
              </div>
            )}
            
            <div className="mb-3">
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {showFullContent ? lyric.content : previewContent}
              </p>
              {lyric.content.length > 150 && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setShowFullContent(!showFullContent)}
                  className="p-0 h-auto text-blue-600"
                >
                  {showFullContent ? 'Ver menos' : 'Ver mais'}
                </Button>
              )}
            </div>
            
            {lyric.tags && lyric.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {lyric.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              Adicionado em {new Date(lyric.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    {lyric.title}
                    {lyric.artist && <span className="text-muted-foreground">- {lyric.artist}</span>}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    value={lyric.content}
                    readOnly
                    rows={15}
                    className="resize-none"
                  />
                  {lyric.tags && lyric.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {lyric.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(lyric)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(lyric.id)}
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

export const LyricList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { lyrics, isLoading, deleteLyric } = useLyrics(searchTerm);

  const handleEdit = (lyric: Lyric) => {
    // TODO: Implementar edição
    console.log('Editar letra:', lyric);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2" />
            Carregando letras...
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
            <Search className="w-5 h-5" />
            Buscar Letras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Buscar por título, artista ou conteúdo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </CardContent>
      </Card>

      {lyrics.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm ? 'Nenhuma letra encontrada para sua busca.' : 'Nenhuma letra cadastrada ainda.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {lyrics.length} letra{lyrics.length !== 1 ? 's' : ''} encontrada{lyrics.length !== 1 ? 's' : ''}
            </h3>
          </div>
          
          {lyrics.map((lyric) => (
            <LyricItem
              key={lyric.id}
              lyric={lyric}
              onEdit={handleEdit}
              onDelete={deleteLyric}
            />
          ))}
        </div>
      )}
    </div>
  );
};
