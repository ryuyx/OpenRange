import { useState } from 'react';
import { type ComputedConfig, type Position } from '@/data/hands';
import { RangeTable } from '@/components/RangeTable';
import { BeginnerGuide } from '@/components/BeginnerGuide';
import { BookOpen } from 'lucide-react';

interface RangeViewerProps {
  config: ComputedConfig;
  onBack: () => void;
}

export function RangeViewer({ config, onBack }: RangeViewerProps) {
  const [activeKey, setActiveKey] = useState<Position>(config.positions[0].key);
  const [showGuide, setShowGuide] = useState(false);
  const active = config.positions.find(p => p.key === activeKey)!;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            &larr; {config.players}-Max {config.stack}BB
          </button>
        </div>
      </div>

      {/* Guide toggle */}
      <div className="max-w-4xl mx-auto px-4 pt-4 flex justify-end">
        <button
          type="button"
          onClick={() => setShowGuide(v => !v)}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <BookOpen className="size-3.5" />
          {showGuide ? '收起教程' : '快速入门'}
        </button>
      </div>
      {showGuide && (
        <div className="px-4 pt-3">
          <BeginnerGuide />
        </div>
      )}

      {/* Content */}
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-5">
          {/* Position Tabs */}
          <div className="flex items-center justify-center gap-1 bg-muted rounded-lg p-1 w-fit mx-auto">
            {config.positions.map(pos => (
              <button
                key={pos.key}
                type="button"
                onClick={() => setActiveKey(pos.key)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  activeKey === pos.key
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {pos.label}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">{active.combos}</span> combos
            </span>
            <span>
              <span className="font-semibold text-foreground">{active.pct.toFixed(1)}%</span> of range
            </span>
          </div>

          {/* Range Table */}
          <RangeTable activeHands={active.hands} />
        </div>
      </div>
    </div>
  );
}
