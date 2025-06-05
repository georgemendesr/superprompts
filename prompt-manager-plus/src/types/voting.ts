
export interface VotingColors {
  background: string;
  border: string;
  text: string;
}

export interface ScoreRange {
  min: number;
  max: number;
  label: string;
  colors: VotingColors;
}

export const SCORE_RANGES: ScoreRange[] = [
  {
    min: 80,
    max: 100,
    label: 'Excelente',
    colors: {
      background: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800'
    }
  },
  {
    min: 60,
    max: 79,
    label: 'Bom',
    colors: {
      background: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800'
    }
  },
  {
    min: 40,
    max: 59,
    label: 'Regular',
    colors: {
      background: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800'
    }
  },
  {
    min: 20,
    max: 39,
    label: 'Ruim',
    colors: {
      background: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-800'
    }
  },
  {
    min: 0,
    max: 19,
    label: 'Muito Ruim',
    colors: {
      background: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800'
    }
  }
];

export function getScoreColors(score: number): VotingColors {
  const range = SCORE_RANGES.find(r => score >= r.min && score <= r.max);
  return range?.colors || SCORE_RANGES[SCORE_RANGES.length - 1].colors;
}

export function getScoreLabel(score: number): string {
  const range = SCORE_RANGES.find(r => score >= r.min && score <= r.max);
  return range?.label || 'Sem avaliação';
}
