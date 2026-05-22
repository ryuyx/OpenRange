import { useState } from 'react';
import { type Config, COMPUTED_CONFIGS } from '@/data/hands';
import { Landing } from '@/components/Landing';
import { RangeViewer } from '@/components/RangeViewer';
import { HandRankings } from '@/components/HandRankings';

function App() {
  const [page, setPage] = useState<'landing' | 'rankings' | 'viewer'>('landing');
  const [config, setConfig] = useState<Config | null>(null);

  if (page === 'rankings') {
    return <HandRankings onBack={() => setPage('landing')} />;
  }

  if (!config) {
    return (
      <Landing
        onEnter={c => { setConfig(c); setPage('viewer'); }}
        onRankings={() => setPage('rankings')}
      />
    );
  }

  const computed = COMPUTED_CONFIGS[config.id];
  return (
    <RangeViewer
      config={computed}
      onBack={() => { setConfig(null); setPage('landing'); }}
    />
  );
}

export default App;
