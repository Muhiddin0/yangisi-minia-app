const WIDTH = 300;
const HEIGHT = 100;
const PADDING = 6;

/** Lightweight SVG line/area chart for the dashboard's weekly views. */
export function ViewsChart({
  data,
  labels,
}: {
  data: number[];
  labels: string[];
}) {
  const step = WIDTH / Math.max(data.length - 1, 1);
  const points = data.map((value, index) => {
    const x = index * step;
    const y = HEIGHT - PADDING - value * (HEIGHT - PADDING * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const line = points.join(" ");
  const area = `0,${HEIGHT} ${line} ${WIDTH},${HEIGHT}`;

  return (
    <div className="flex flex-col gap-md">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="h-40 w-full"
        role="img"
        aria-label="Weekly views chart"
      >
        <polygon points={area} className="fill-primary/5" />
        <polyline
          points={line}
          className="fill-none stroke-primary"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="flex justify-between text-label-sm text-on-surface-variant">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}
