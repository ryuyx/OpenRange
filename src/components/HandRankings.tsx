interface Card {
  rank: string;
  suit: '♠' | '♥' | '♦' | '♣';
}

const isRed = (suit: string) => suit === '♥' || suit === '♦';

const RANKINGS: {
  nameZh: string;
  nameEn: string;
  cards: Card[];
  desc: string;
}[] = [
  {
    nameZh: '皇家同花顺',
    nameEn: 'Royal Flush',
    cards: [
      { rank: 'A', suit: '♠' }, { rank: 'K', suit: '♠' }, { rank: 'Q', suit: '♠' },
      { rank: 'J', suit: '♠' }, { rank: '10', suit: '♠' },
    ],
    desc: '同花色的 A、K、Q、J、10，德州扑克中最大的牌型',
  },
  {
    nameZh: '同花顺',
    nameEn: 'Straight Flush',
    cards: [
      { rank: '9', suit: '♥' }, { rank: '8', suit: '♥' }, { rank: '7', suit: '♥' },
      { rank: '6', suit: '♥' }, { rank: '5', suit: '♥' },
    ],
    desc: '同一花色且连续的五张牌。皇家同花顺是特殊的同花顺',
  },
  {
    nameZh: '四条',
    nameEn: 'Four of a Kind',
    cards: [
      { rank: 'A', suit: '♠' }, { rank: 'A', suit: '♥' }, { rank: 'A', suit: '♦' },
      { rank: 'A', suit: '♣' }, { rank: 'K', suit: '♠' },
    ],
    desc: '四张相同点数的牌加一张散牌。四条之间比较四条点数',
  },
  {
    nameZh: '葫芦',
    nameEn: 'Full House',
    cards: [
      { rank: 'K', suit: '♠' }, { rank: 'K', suit: '♥' }, { rank: 'K', suit: '♦' },
      { rank: 'Q', suit: '♠' }, { rank: 'Q', suit: '♥' },
    ],
    desc: '三条加一对。先比较三条点数，再比较对子点数',
  },
  {
    nameZh: '同花',
    nameEn: 'Flush',
    cards: [
      { rank: 'A', suit: '♣' }, { rank: 'J', suit: '♣' }, { rank: '8', suit: '♣' },
      { rank: '5', suit: '♣' }, { rank: '3', suit: '♣' },
    ],
    desc: '五张同一花色的牌（不连续）。从最大张开始逐一比较',
  },
  {
    nameZh: '顺子',
    nameEn: 'Straight',
    cards: [
      { rank: 'J', suit: '♠' }, { rank: '10', suit: '♥' }, { rank: '9', suit: '♦' },
      { rank: '8', suit: '♣' }, { rank: '7', suit: '♠' },
    ],
    desc: '五张连续点数的牌（不同花色）。A 可作为大顺或小顺',
  },
  {
    nameZh: '三条',
    nameEn: 'Three of a Kind',
    cards: [
      { rank: 'Q', suit: '♠' }, { rank: 'Q', suit: '♥' }, { rank: 'Q', suit: '♦' },
      { rank: 'A', suit: '♠' }, { rank: 'K', suit: '♥' },
    ],
    desc: '三张相同点数的牌加两张散牌。先比较三条点数',
  },
  {
    nameZh: '两对',
    nameEn: 'Two Pair',
    cards: [
      { rank: 'A', suit: '♠' }, { rank: 'A', suit: '♥' }, { rank: 'K', suit: '♦' },
      { rank: 'K', suit: '♠' }, { rank: 'Q', suit: '♣' },
    ],
    desc: '两个对子加一张散牌。先比较大对子，再比小对子',
  },
  {
    nameZh: '一对',
    nameEn: 'One Pair',
    cards: [
      { rank: 'J', suit: '♠' }, { rank: 'J', suit: '♥' }, { rank: 'A', suit: '♦' },
      { rank: 'K', suit: '♣' }, { rank: '9', suit: '♠' },
    ],
    desc: '一对相同点数的牌加三张散牌。先比对子，再依次比散牌',
  },
  {
    nameZh: '高牌',
    nameEn: 'High Card',
    cards: [
      { rank: 'A', suit: '♠' }, { rank: 'K', suit: '♣' }, { rank: '9', suit: '♥' },
      { rank: '7', suit: '♦' }, { rank: '5', suit: '♣' },
    ],
    desc: '没有任何组合，从最大单张开始逐一比较。A 是最大单张',
  },
];

function PlayingCard({ rank, suit }: Card) {
  const red = isRed(suit);
  return (
    <div
      className={`
        relative w-11 h-16 rounded-md bg-white border-2 shadow-md flex-shrink-0
        hover:-translate-y-2 hover:rotate-0 transition-all duration-200 ease-out
        ${red ? 'border-red-400/60 shadow-red-200/50' : 'border-slate-300/60 shadow-slate-300/50'}
      `}
    >
      {/* Top-left rank */}
      <div className={`absolute top-0.5 left-1 leading-none font-bold text-sm ${red ? 'text-red-500' : 'text-slate-800'}`}>
        {rank}
      </div>
      {/* Center suit */}
      <div className={`absolute inset-0 flex items-center justify-center text-xl ${red ? 'text-red-500' : 'text-slate-800'}`}>
        {suit}
      </div>
      {/* Bottom-right rank */}
      <div className={`absolute bottom-0.5 right-1 leading-none font-bold text-sm rotate-180 ${red ? 'text-red-500' : 'text-slate-800'}`}>
        {rank}
      </div>
    </div>
  );
}

interface HandRankingsProps {
  onBack: () => void;
}

export function HandRankings({ onBack }: HandRankingsProps) {
  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="max-w-2xl mx-auto space-y-8">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          &larr; 返回首页
        </button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            牌力排行
          </h1>
          <p className="text-sm text-muted-foreground">
            Texas Hold&apos;em 十大牌型，从强到弱
          </p>
        </div>

        <div className="space-y-3">
          {RANKINGS.map((item, idx) => (
            <div
              key={item.nameEn}
              className="bg-muted/30 border rounded-xl px-4 py-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Rank badge */}
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-muted-foreground">
                    {idx + 1}
                  </span>
                </div>

                {/* Text + cards */}
                <div className="min-w-0 flex-1 space-y-3">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-foreground">{item.nameZh}</span>
                      <span className="text-xs text-muted-foreground">{item.nameEn}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>

                  {/* Cards fan */}
                  <div className="flex items-center justify-center gap-1 py-1">
                    {item.cards.map((card, ci) => (
                      <div
                        key={ci}
                        style={{ transform: `rotate(${(ci - 2) * 3}deg)` }}
                      >
                        <PlayingCard rank={card.rank} suit={card.suit} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
