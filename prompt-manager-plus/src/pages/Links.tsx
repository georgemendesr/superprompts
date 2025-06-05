
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LinkForm } from '@/components/links/LinkForm';
import { LinkList } from '@/components/links/LinkList';
import { Link, Plus, List } from 'lucide-react';

export default function Links() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Link className="w-8 h-8" />
            Links Úteis
          </h1>
          <p className="text-muted-foreground">
            Organize seus links favoritos por categoria
          </p>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Meus Links
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <LinkList />
          </TabsContent>

          <TabsContent value="add" className="mt-6">
            <div className="max-w-2xl mx-auto">
              <LinkForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
