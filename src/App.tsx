import { useState } from 'react';
import { type Config, COMPUTED_CONFIGS } from '@/data/hands';
import { Landing } from '@/components/Landing';
import { RangeViewer } from '@/components/RangeViewer';

function App() {
  const [config, setConfig] = useState<Config | null>(null);

  if (!config) {
    return <Landing onEnter={c => setConfig(c)} />;
  }

  const computed = COMPUTED_CONFIGS[config.id];
  return <RangeViewer config={computed} onBack={() => setConfig(null)} />;
}

export default App;
