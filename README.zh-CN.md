# OpenRange

GTO 德州扑克起手范围参考工具。展示 6 人桌 100BB 标准开局范围（RFI），按位置切换查看。

范围数据基于 GTO Wizard NL500 求解结果。

## 功能

- 13×13 手牌网格，按口袋对/同花/非同花颜色区分
- 5 个位置（LJ/HJ/CO/BTN/SB）GTO 开局范围切换
- 实时显示 combo 数和范围占比
- 悬浮查看每类手牌的组合数

## 技术栈

React 19 · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build   # → dist/
```
