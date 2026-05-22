import { GRID, RANKS, type GridHand } from '@/data/hands';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface RangeTableProps {
  activeHands: Set<string>;
}

function cellColor(hand: GridHand, inRange: boolean): string {
  if (!inRange) {
    return 'bg-muted/50 text-muted-foreground/40';
  }
  switch (hand.type) {
    case 'pair':
      return 'bg-amber-500 text-white shadow-sm';
    case 'suited':
      return 'bg-sky-600 text-white shadow-sm';
    case 'offsuit':
      return 'bg-rose-600 text-white shadow-sm';
  }
}

export function RangeTable({ activeHands }: RangeTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse mx-auto select-none">
        <thead>
          <tr>
            <th className="w-11 h-11 text-center text-sm font-medium text-muted-foreground sticky left-0 bg-background z-10" />
            {RANKS.map(rank => (
              <th
                key={rank}
                className="w-11 h-11 text-center text-sm font-medium text-muted-foreground"
              >
                {rank}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {GRID.map((row, rowIdx) => (
            <tr key={RANKS[rowIdx]}>
              <td className="w-11 h-11 text-center text-sm font-medium text-muted-foreground sticky left-0 bg-background">
                {RANKS[rowIdx]}
              </td>
              {row.map(hand => {
                const inRange = activeHands.has(hand.id);
                return (
                  <td key={`${hand.row}-${hand.col}`} className="p-0.5">
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <span
                            className={cn(
                              'w-10 h-10 rounded-md text-xs font-semibold inline-flex items-center justify-center',
                              cellColor(hand, inRange),
                            )}
                          >
                            {hand.label}
                          </span>
                        }
                      />
                      <TooltipContent side="top">
                        <p>
                          {hand.label}
                          <span className="opacity-60 ml-1">
                            ({hand.comboCount} combos)
                          </span>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
