
import { useState, useEffect } from 'react';
import { SUBSECTIONS, SubsectionType } from '@/types/subsection';

export const useSubsections = () => {
  const [activeSubsection, setActiveSubsection] = useState<SubsectionType>('music');

  const getSubsectionInfo = (id: SubsectionType) => {
    return SUBSECTIONS.find(s => s.id === id) || SUBSECTIONS[0];
  };

  const switchSubsection = (subsection: SubsectionType) => {
    setActiveSubsection(subsection);
  };

  return {
    subsections: SUBSECTIONS,
    activeSubsection,
    setActiveSubsection: switchSubsection,
    getSubsectionInfo
  };
};
