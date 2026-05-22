interface Seat {
  label: string;
  desc?: string;
  isRFI: boolean; // whether this position is in the RFI range data
}

interface TableDiagramProps {
  seats: Seat[];
  label: string;
}

// Calculates x,y on a scaled ellipse
function ellipsePoint(
  cx: number, cy: number, rx: number, ry: number, angleDeg: number,
): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + rx * Math.cos(rad),
    y: cy + ry * Math.sin(rad),
  };
}

function SeatBadge({ x, y, seat }: { x: number; y: number; seat: Seat }) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={seat.isRFI ? 14 : 12}
        fill={seat.isRFI ? 'var(--color-primary)' : 'var(--color-muted)'}
        stroke="var(--color-border)"
        strokeWidth={1}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-current"
        style={{
          fontSize: '10px',
          fontWeight: 600,
          color: seat.isRFI ? 'var(--color-primary-foreground)' : 'var(--color-muted-foreground)',
        }}
        fill={seat.isRFI ? 'oklch(0.985 0 0)' : 'oklch(0.556 0 0)'}
      >
        {seat.label}
      </text>
    </g>
  );
}

export function TableDiagram({ seats, label }: TableDiagramProps) {
  // Evenly distribute seats around the ellipse from top-left going clockwise
  const cx = 140;
  const cy = 100;
  const rx = 115;
  const ry = 72;
  const n = seats.length;
  // Start from top (270°) and go clockwise
  const startAngle = 270 - (180 / n) * (n - 1) / 2;

  return (
    <div className="my-3">
      <svg
        viewBox="0 0 280 200"
        className="w-full max-w-[280px] h-auto mx-auto"
        role="img"
        aria-label={label}
      >
        {/* Table */}
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx + 8}
          ry={ry + 8}
          fill="var(--color-muted)"
          stroke="var(--color-border)"
          strokeWidth={1.5}
        />
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx - 8}
          ry={ry - 8}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={0.5}
          strokeDasharray="4 3"
        />
        {/* Table label */}
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-muted-foreground"
          style={{ fontSize: '11px' }}
          fill="oklch(0.556 0 0)"
        >
          {label}
        </text>

        {/* Seat badges */}
        {seats.map((seat, i) => {
          const angle = startAngle - (360 / n) * i;
          const { x, y } = ellipsePoint(cx, cy, rx + 28, ry + 20, angle);
          return <SeatBadge key={seat.label} x={x} y={y} seat={seat} />;
        })}
      </svg>
    </div>
  );
}

// Pre-built seat layouts
export const SEATS_6MAX: Seat[] = [
  { label: 'LJ', desc: '枪口位，最紧', isRFI: true },
  { label: 'HJ', desc: '劫持位', isRFI: true },
  { label: 'CO', desc: '关煞位', isRFI: true },
  { label: 'BTN', desc: '庄位，最松', isRFI: true },
  { label: 'SB', desc: '小盲位', isRFI: true },
  { label: 'BB', desc: '大盲位', isRFI: false },
];

export const SEATS_9MAX: Seat[] = [
  { label: 'UTG', desc: '枪口位', isRFI: true },
  { label: 'UTG+1', desc: '枪口+1', isRFI: true },
  { label: 'LJ', desc: 'Lojack', isRFI: true },
  { label: 'HJ', desc: '劫持位', isRFI: true },
  { label: 'CO', desc: '关煞位', isRFI: true },
  { label: 'BTN', desc: '庄位', isRFI: true },
  { label: 'SB', desc: '小盲位', isRFI: true },
  { label: 'BB', desc: '大盲位', isRFI: false },
];
