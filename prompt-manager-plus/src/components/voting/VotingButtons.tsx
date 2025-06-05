
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, Trophy } from 'lucide-react';
import { useVoting } from '@/hooks/useVoting';
import { getScoreColors, getScoreLabel } from '@/types/voting';

interface VotingButtonsProps {
  promptId: string;
  currentScore?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const VotingButtons: React.FC<VotingButtonsProps> = ({
  promptId,
  currentScore = 0,
  size = 'md',
  showLabel = true
}) => {
  const { voteUp, voteDown, isVoting } = useVoting();
  const colors = getScoreColors(currentScore);
  const label = getScoreLabel(currentScore);

  const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default';
  const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size={buttonSize}
          onClick={() => voteUp(promptId)}
          disabled={isVoting}
          className="hover:bg-green-50 hover:border-green-200"
        >
          <ChevronUp className={iconSize} />
        </Button>
        
        <div className="flex flex-col items-center gap-1">
          <Badge 
            variant="outline" 
            className={`${colors.background} ${colors.border} ${colors.text} font-semibold`}
          >
            {currentScore}
          </Badge>
          {showLabel && (
            <span className={`text-xs ${colors.text}`}>
              {label}
            </span>
          )}
        </div>

        <Button
          variant="outline"
          size={buttonSize}
          onClick={() => voteDown(promptId)}
          disabled={isVoting}
          className="hover:bg-red-50 hover:border-red-200"
        >
          <ChevronDown className={iconSize} />
        </Button>
      </div>

      {currentScore >= 80 && (
        <Trophy className="w-4 h-4 text-yellow-500" />
      )}
    </div>
  );
};
