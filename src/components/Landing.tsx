import { useState } from 'react';
import { CONFIGS, type Config } from '@/data/hands';
import { BeginnerGuide } from '@/components/BeginnerGuide';
import { BookOpen } from 'lucide-react';

interface LandingProps {
  onEnter: (config: Config) => void;
}

interface Option {
  value: number;
  label: string;
}

function getPlayers(): Option[] {
  return [...new Set(CONFIGS.map(c => c.players))]
    .sort()
    .map(v => ({ value: v, label: `${v}-Max` }));
}

function getStacks(players: number): Option[] {
  return [...new Set(CONFIGS.filter(c => c.players === players).map(c => c.stack))]
    .sort((a, b) => a - b)
    .map(v => ({ value: v, label: `${v} BB` }));
}

export function Landing({ onEnter }: LandingProps) {
  const initialPlayers = CONFIGS[0].players;
  const [players, setPlayers] = useState(initialPlayers);
  const [stack, setStack] = useState(() => getStacks(initialPlayers)[0].value);
  const [showGuide, setShowGuide] = useState(false);

  const playerOptions = getPlayers();
  const stackOptions = getStacks(players);

  const handlePlayersChange = (p: number) => {
    setPlayers(p);
    const stacks = getStacks(p);
    if (!stacks.find(s => s.value === stack)) {
      setStack(stacks[0].value);
    }
  };

  const handleEnter = () => {
    const config = CONFIGS.find(c => c.players === players && c.stack === stack);
    if (config) onEnter(config);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center space-y-10">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground tracking-wide uppercase">
            Texas Hold&apos;em · GTO Preflop Ranges
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            OpenRange
          </h1>
        </div>

        <div className="space-y-6">
          {/* Players */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Players</p>
            <div className="flex items-center justify-center gap-1 bg-muted rounded-lg p-1 w-fit mx-auto">
              {playerOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handlePlayersChange(opt.value)}
                  className={`px-5 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                    players === opt.value
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stack */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Stack Depth</p>
            <div className="flex items-center justify-center gap-1 bg-muted rounded-lg p-1 w-fit mx-auto">
              {stackOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStack(opt.value)}
                  className={`px-5 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                    stack === opt.value
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleEnter}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
        >
          View Ranges
        </button>

        {/* Guide toggle */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowGuide(v => !v)}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <BookOpen className="size-3.5" />
            {showGuide ? '收起教程' : '新手教程'}
          </button>
        </div>
      </div>

      {showGuide && (
        <div className="mt-8 w-full">
          <BeginnerGuide />
        </div>
      )}
    </div>
  );
}
