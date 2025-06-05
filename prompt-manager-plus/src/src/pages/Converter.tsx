
import React from 'react';
import { ConverterForm } from '@/components/converter/ConverterForm';
import { ConversionList } from '@/components/converter/ConversionList';

export default function Converter() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Conversor de Vídeos</h1>
          <p className="text-muted-foreground">
            Converta vídeos do YouTube, Instagram e outras plataformas para MP3 ou MP4
          </p>
        </div>

        <ConverterForm />
        
        <ConversionList />
      </div>
    </div>
  );
}
