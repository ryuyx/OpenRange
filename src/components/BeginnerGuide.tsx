import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const SECTIONS = [
  {
    title: '什么是范围（Range）？',
    content: (
      <p>
        德州扑克中，你的起手牌有 1326 种组合。
        范围就是指你在某个位置决定入池的所有手牌。
        这张表帮你直观地看到：不同位置该玩哪些牌、不该玩哪些牌。
      </p>
    ),
  },
  {
    title: '表格怎么看？',
    content: (
      <div className="space-y-3">
        <p>表格是一个 13×13 的方格，行和列分别代表两张牌的牌面（A 到 2）。</p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li><strong>对角线</strong>是口袋对（AA、KK...22），比如 AA 就是两张 A</li>
          <li><strong>对角线以上</strong>是同花牌（AKs、KQs...），比如 AKs 表示 A 和 K 同花色</li>
          <li><strong>对角线以下</strong>是不同花牌（AKo、KQo...），比如 AKo 表示 A 和 K 不同花色</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          格子的右下角总是高张在前的组合，例如第一行第二列是 AKs（不是 KAs），第二行第一列是 AKo。
        </p>
      </div>
    ),
  },
  {
    title: '颜色是什么意思？',
    content: (
      <div className="space-y-3">
        <p>高亮的格子表示在当前位置应该入池的牌：</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-amber-500" /> 口袋对（如 AA、KK）
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-sky-600" /> 同花牌（如 AKs、QJs）
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-rose-600" /> 不同花牌（如 AKo、QJo）
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          灰色的格子表示在这个位置不建议入池。
        </p>
      </div>
    ),
  },
  {
    title: '位置（Position）是什么？',
    content: (
      <div className="space-y-2">
        <p>6 人桌的位置从右到左依次是：</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            ['LJ (Lojack)', '枪口位，最紧'],
            ['HJ (Hijack)', '劫持位'],
            ['CO (Cutoff)', '关煞位'],
            ['BTN (Button)', '庄位，最松'],
            ['SB (Small Blind)', '小盲位'],
          ].map(([pos, desc]) => (
            <div key={pos} className="flex gap-1.5">
              <span className="font-semibold whitespace-nowrap">{pos}</span>
              <span className="text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          越靠近 BTN（庄位），位置越好，可以玩越多的牌。你可以点击上方的位置标签来切换查看。
        </p>
      </div>
    ),
  },
  {
    title: '组合数（Combos）和百分比怎么看？',
    content: (
      <div className="space-y-2">
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>每个口袋对有 <strong>6 种</strong>组合（如 AA 有 6 种花色组合）</li>
          <li>每种同花牌有 <strong>4 种</strong>组合（如 AKs 有 4 种同花组合）</li>
          <li>每种不同花牌有 <strong>12 种</strong>组合（如 AKo 有 12 种不同花组合）</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          选中范围后，顶部会显示总组合数和占总手牌数的百分比。将鼠标悬停在格子上可以看到每种牌的具体组合数。
        </p>
      </div>
    ),
  },
];

export function BeginnerGuide() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggle = (idx: number) => setExpanded(expanded === idx ? null : idx);

  return (
    <div className="max-w-2xl mx-auto bg-muted/30 rounded-xl border p-5">
      <h2 className="text-sm font-semibold text-foreground mb-3">新手教程</h2>
      <div className="divide-y">
        {SECTIONS.map((section, idx) => (
          <div key={idx}>
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full flex items-center gap-2 py-3 text-left text-sm font-medium text-foreground hover:text-foreground/80 transition-colors cursor-pointer"
            >
              {expanded === idx ? (
                <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
              ) : (
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              )}
              {section.title}
            </button>
            {expanded === idx && (
              <div className="pb-3 text-sm text-foreground/80 leading-relaxed">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
