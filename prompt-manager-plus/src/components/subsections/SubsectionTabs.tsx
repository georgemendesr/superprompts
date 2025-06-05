
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Music, FileText, Image } from 'lucide-react';
import { SUBSECTIONS, SubsectionType } from '@/types/subsection';

interface SubsectionTabsProps {
  activeSubsection: SubsectionType;
  onSubsectionChange: (subsection: SubsectionType) => void;
  children: React.ReactNode;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Music':
      return <Music className="w-4 h-4" />;
    case 'FileText':
      return <FileText className="w-4 h-4" />;
    case 'Image':
      return <Image className="w-4 h-4" />;
    default:
      return <Music className="w-4 h-4" />;
  }
};

export const SubsectionTabs: React.FC<SubsectionTabsProps> = ({
  activeSubsection,
  onSubsectionChange,
  children
}) => {
  return (
    <div className="w-full">
      <Tabs value={activeSubsection} onValueChange={(value) => onSubsectionChange(value as SubsectionType)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          {SUBSECTIONS.map((subsection) => (
            <TabsTrigger
              key={subsection.id}
              value={subsection.id}
              className="flex items-center gap-2"
            >
              {getIcon(subsection.icon)}
              <span>{subsection.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {SUBSECTIONS.map((subsection) => (
          <TabsContent key={subsection.id} value={subsection.id} className="mt-0">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                {getIcon(subsection.icon)}
                <h2 className="text-xl font-semibold">{subsection.name}</h2>
                <Badge variant="outline">{subsection.description}</Badge>
              </div>
            </div>
            {children}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
