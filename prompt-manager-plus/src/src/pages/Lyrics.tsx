
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LyricForm } from '@/components/lyrics/LyricForm';
import { LyricList } from '@/components/lyrics/LyricList';
import { Music, Plus, List } from 'lucide-react';

export default function Lyrics() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Music className="w-8 h-8" />
            Letras de Músicas
          </h1>
          <p className="text-muted-foreground">
            Gerencie sua coleção de letras de músicas
          </p>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Minhas Letras
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Letra
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <LyricList />
          </TabsContent>

          <TabsContent value="add" className="mt-6">
            <div className="max-w-2xl mx-auto">
              <LyricForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
