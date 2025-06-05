
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, Globe, Tag } from 'lucide-react';
import { useLinks } from '@/hooks/useLinks';

const LINK_CATEGORIES = [
  'geral',
  'desenvolvimento',
  'design',
  'música',
  'educação',
  'ferramentas',
  'entretenimento',
  'notícias',
  'social',
  'trabalho'
];

export const LinkForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('geral');
  
  const { createLink, isCreating } = useLinks();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      return;
    }

    // Validar se é uma URL válida
    try {
      new URL(url);
    } catch {
      return;
    }

    createLink({
      title: title.trim() || undefined,
      url: url.trim(),
      description: description.trim() || undefined,
      category
    });

    // Limpar formulário
    setTitle('');
    setUrl('');
    setDescription('');
    setCategory('geral');
  };

  const isValidUrl = (urlString: string) => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="w-5 h-5" />
          Novo Link
        </CardTitle>
        <CardDescription>
          Adicione um novo link útil à sua coleção
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              URL *
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://exemplo.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              Título
            </Label>
            <Input
              id="title"
              placeholder="Nome do site ou recurso"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Categoria
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LINK_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Descrição
            </Label>
            <Textarea
              id="description"
              placeholder="Descreva o que é este link e para que serve..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!url.trim() || !isValidUrl(url) || isCreating}
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Salvando...
              </>
            ) : (
              <>
                <Link className="w-4 h-4 mr-2" />
                Salvar Link
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
