export const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const;
export type Rank = typeof RANKS[number];

export type HandType = 'pair' | 'suited' | 'offsuit';

export interface Hand {
  id: string;
  rank1: Rank;
  rank2: Rank;
  type: HandType;
  label: string;
  comboCount: number;
}

const RANK_ORDER: Record<Rank, number> = {
  'A': 0, 'K': 1, 'Q': 2, 'J': 3, 'T': 4,
  '9': 5, '8': 6, '7': 7, '6': 8,
  '5': 9, '4': 10, '3': 11, '2': 12,
};

function rankCompare(a: Rank, b: Rank): number {
  return RANK_ORDER[a] - RANK_ORDER[b];
}

export interface GridHand extends Hand {
  row: number;
  col: number;
}

function generateGrid(): GridHand[][] {
  const grid: GridHand[][] = [];
  for (let r = 0; r < 13; r++) {
    const row: GridHand[] = [];
    for (let c = 0; c < 13; c++) {
      const r1 = RANKS[r];
      const r2 = RANKS[c];
      let type: HandType;
      let label: string;
      let comboCount: number;

      if (r === c) {
        type = 'pair';
        label = `${r1}${r2}`;
        comboCount = 6;
      } else if (r < c) {
        type = 'suited';
        label = `${r1}${r2}s`;
        comboCount = 4;
      } else {
        type = 'offsuit';
        const higher = rankCompare(r1, r2) < 0 ? r1 : r2;
        const lower = higher === r1 ? r2 : r1;
        label = `${higher}${lower}o`;
        comboCount = 12;
      }

      row.push({
        id: label,
        rank1: r1,
        rank2: r2,
        type,
        label,
        comboCount,
        row: r,
        col: c,
      });
    }
    grid.push(row);
  }
  return grid;
}

export const GRID = generateGrid();

export const ALL_HANDS: Hand[] = [];
const seen = new Set<string>();
for (const row of GRID) {
  for (const hand of row) {
    if (!seen.has(hand.id)) {
      seen.add(hand.id);
      ALL_HANDS.push(hand);
    }
  }
}

export const TOTAL_COMBOS = ALL_HANDS.reduce((sum, h) => sum + h.comboCount, 0);

// ── Range parsing ───────────────────────────────────────────────────

function parsePlus(notation: string): string[] {
  const hands: string[] = [];
  if (!notation.endsWith('+')) return [notation];

  const base = notation.slice(0, -1);

  if (base.length === 2 && base[0] === base[1]) {
    const startIdx = RANKS.indexOf(base[0] as Rank);
    for (let i = 0; i <= startIdx; i++) {
      hands.push(RANKS[i] + RANKS[i]);
    }
    return hands;
  }

  if (base.endsWith('s') && base.length === 3) {
    const highRank = base[0];
    const startIdx = RANKS.indexOf(base[1] as Rank);
    const highIdx = RANKS.indexOf(highRank as Rank);
    for (let i = startIdx; i > highIdx; i--) {
      hands.push(`${highRank}${RANKS[i]}s`);
    }
    return hands;
  }

  if (base.endsWith('o') && base.length === 3) {
    const highRank = base[0];
    const startIdx = RANKS.indexOf(base[1] as Rank);
    const highIdx = RANKS.indexOf(highRank as Rank);
    for (let i = startIdx; i > highIdx; i--) {
      hands.push(`${highRank}${RANKS[i]}o`);
    }
    return hands;
  }

  return hands;
}

export function parseRange(range: string): Set<string> {
  const selected = new Set<string>();
  const parts = range.split(',').map(s => s.trim()).filter(Boolean);
  for (const part of parts) {
    for (const h of parsePlus(part)) {
      selected.add(h);
    }
  }
  return selected;
}

export function comboCount(handIds: Set<string>): number {
  let count = 0;
  for (const id of handIds) {
    const hand = ALL_HANDS.find(h => h.id === id);
    if (hand) count += hand.comboCount;
  }
  return count;
}

export function percentage(handIds: Set<string>): number {
  return (comboCount(handIds) / TOTAL_COMBOS) * 100;
}

// ── Configs & ranges ────────────────────────────────────────────────

export type Position = 'UTG' | 'UTG1' | 'LJ' | 'HJ' | 'CO' | 'BTN' | 'SB';

export interface PositionRange {
  key: Position;
  label: string;
  range: string;
}

export interface Config {
  id: string;
  players: number;
  stack: number;
  positions: PositionRange[];
}

export const CONFIGS: Config[] = [
  {
    id: '6max-50bb',
    players: 6,
    stack: 50,
    positions: [
      { key: 'LJ', label: 'LJ', range: '88+, A2s+, KTs+, QTs+, JTs, T9s, AJo+, KQo' },
      { key: 'HJ', label: 'HJ', range: '66+, A2s+, K9s+, Q9s+, J9s+, T9s, ATo+, KJo+' },
      { key: 'CO', label: 'CO', range: '44+, A2s+, K5s+, Q7s+, J7s+, T7s+, 97s+, 87s, A9o+, KTo+, QTo+, JTo' },
      { key: 'BTN', label: 'BTN', range: '22+, A2s+, K2s+, Q3s+, J5s+, T6s+, 96s+, 86s+, 76s, 65s, A2o+, K6o+, Q8o+, J8o+, T8o+, 98o' },
      { key: 'SB', label: 'SB', range: '22+, A2s+, K2s+, Q5s+, J6s+, T7s+, 97s+, 87s, 76s, A2o+, K7o+, Q9o+, J9o+, T9o' },
    ],
  },
  {
    id: '6max-100bb',
    players: 6,
    stack: 100,
    positions: [
      { key: 'LJ', label: 'LJ', range: '66+, A2s+, K9s+, Q9s+, J9s+, T9s, 98s, 87s, 76s, 65s, AJo+, KQo' },
      { key: 'HJ', label: 'HJ', range: '55+, A2s+, K7s+, Q8s+, J8s+, T8s+, 98s, 87s, 76s, 65s, 54s, ATo+, KJo+, QJo' },
      { key: 'CO', label: 'CO', range: '44+, A2s+, K4s+, Q6s+, J7s+, T7s+, 97s+, 87s, 76s, 65s, 54s, 43s, A9o+, KTo+, QTo+, JTo' },
      { key: 'BTN', label: 'BTN', range: '22+, A2s+, K2s+, Q2s+, J4s+, T5s+, 95s+, 85s+, 75s+, 64s+, 54s, 43s, 32s, A2o+, K5o+, Q7o+, J7o+, T7o+, 97o+, 87o' },
      { key: 'SB', label: 'SB', range: '22+, A2s+, K2s+, Q3s+, J5s+, T6s+, 96s+, 86s+, 75s+, 64s+, 54s, A2o+, K6o+, Q8o+, J8o+, T8o+, 98o' },
    ],
  },
  {
    id: '6max-150bb',
    players: 6,
    stack: 150,
    positions: [
      { key: 'LJ', label: 'LJ', range: '55+, A2s+, K8s+, Q8s+, J8s+, T8s+, 98s, 87s, 76s, 65s, 54s, AJo+, KQo' },
      { key: 'HJ', label: 'HJ', range: '44+, A2s+, K6s+, Q7s+, J7s+, T7s+, 97s+, 87s, 76s, 65s, 54s, ATo+, KJo+, QJo' },
      { key: 'CO', label: 'CO', range: '33+, A2s+, K4s+, Q5s+, J6s+, T6s+, 96s+, 86s+, 76s, 65s, 54s, A8o+, KTo+, QTo+, JTo' },
      { key: 'BTN', label: 'BTN', range: '22+, A2s+, K2s+, Q2s+, J3s+, T4s+, 94s+, 84s+, 74s+, 64s+, 54s, 43s, 32s, A2o+, K4o+, Q6o+, J7o+, T7o+, 97o+, 87o' },
      { key: 'SB', label: 'SB', range: '22+, A2s+, K2s+, Q2s+, J4s+, T5s+, 95s+, 85s+, 75s+, 64s+, 54s, 43s, A2o+, K5o+, Q7o+, J7o+, T7o+, 97o+, 87o' },
    ],
  },
  {
    id: '9max-100bb',
    players: 9,
    stack: 100,
    positions: [
      { key: 'UTG', label: 'UTG', range: '77+, A2s+, K9s+, Q9s+, J9s+, T9s, AJo+, KQo' },
      { key: 'UTG1', label: 'UTG+1', range: '66+, A2s+, K9s+, Q9s+, J9s+, T9s, 98s, 87s, AJo+, KQo' },
      { key: 'LJ', label: 'LJ', range: '55+, A2s+, K8s+, Q8s+, J8s+, T8s+, 98s, 87s, 76s, ATo+, KJo+, QJo' },
      { key: 'HJ', label: 'HJ', range: '44+, A2s+, K6s+, Q7s+, J7s+, T7s+, 97s+, 87s, 76s, 65s, A9o+, KTo+, QTo+, JTo' },
      { key: 'CO', label: 'CO', range: '33+, A2s+, K4s+, Q5s+, J6s+, T6s+, 96s+, 86s+, 75s+, 65s, 54s, A5o+, K9o+, Q9o+, J9o+, T9o' },
      { key: 'BTN', label: 'BTN', range: '22+, A2s+, K2s+, Q2s+, J3s+, T4s+, 94s+, 84s+, 74s+, 64s+, 54s, A2o+, K4o+, Q6o+, J7o+, T7o+, 97o+, 87o' },
      { key: 'SB', label: 'SB', range: '22+, A2s+, K2s+, Q2s+, J4s+, T5s+, 95s+, 85s+, 75s+, 64s+, 54s, A2o+, K5o+, Q7o+, J7o+, T7o+, 97o+, 87o' },
    ],
  },
];

export interface ComputedPosition extends PositionRange {
  hands: Set<string>;
  combos: number;
  pct: number;
}

export interface ComputedConfig extends Config {
  positions: ComputedPosition[];
}

export const COMPUTED_CONFIGS: Record<string, ComputedConfig> = {};

for (const config of CONFIGS) {
  COMPUTED_CONFIGS[config.id] = {
    ...config,
    positions: config.positions.map(p => {
      const hands = parseRange(p.range);
      return {
        ...p,
        hands,
        combos: comboCount(hands),
        pct: percentage(hands),
      };
    }),
  };
}
