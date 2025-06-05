
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Link, Music, Video } from 'lucide-react';
import { useConversions } from '@/hooks/useConversions';
import { ConversionRequest } from '@/types/conversion';

export const ConverterForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState<'mp3' | 'mp4'>('mp3');
  const { createConversion, isCreating } = useConversions();

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

    const request: ConversionRequest = {
      url: url.trim(),
      format
    };

    createConversion(request);
    setUrl('');
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Download className="w-6 h-6" />
          Conversor de Vídeos
        </CardTitle>
        <CardDescription>
          Converta vídeos do YouTube, Instagram e outras plataformas para MP3 ou MP4
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              URL do Vídeo
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Suporta YouTube, Instagram, TikTok e outras plataformas
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="format" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Formato de Saída
            </Label>
            <Select value={format} onValueChange={(value: 'mp3' | 'mp4') => setFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mp3">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4" />
                    MP3 (Áudio)
                  </div>
                </SelectItem>
                <SelectItem value="mp4">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    MP4 (Vídeo)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!url.trim() || !isValidUrl(url) || isCreating}
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Converter {format.toUpperCase()}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
