import type { ReactNode } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartMessage, ChartTooltip, Legend, axisTick, gridProps, seriesColor, spanOf, timeTickFormatter } from './common.tsx';
import type { Series } from './TimeSeriesChart.tsx';

export interface StackedBarChartProps {
  data: ({ time: number } & Record<string, number>)[];
  series: Series[];
  stepMs?: number;
  height?: number;
  legend?: boolean;
  empty?: ReactNode;
}

export function StackedBarChart({
  data,
  series,
  stepMs = 0,
  height = 140,
  legend = true,
  empty = 'No data in this range.',
}: StackedBarChartProps) {
  if (data.length === 0) return <ChartMessage height={height}>{empty}</ChartMessage>;
  const fmtTime = timeTickFormatter(spanOf(data), stepMs);
  const colors = series.map((s, i) => s.color ?? seriesColor(i));
  return (
    <div className="flex flex-col gap-2">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 4, right: 20, bottom: 0, left: 0 }} barCategoryGap={1}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="time" tickFormatter={fmtTime} tick={axisTick} tickLine={false} axisLine={false} minTickGap={48} />
          <YAxis tick={axisTick} tickLine={false} axisLine={false} width={44} allowDecimals={false} />
          <Tooltip
            content={<ChartTooltip hideZero formatValue={(v) => v.toLocaleString()} />}
            cursor={{ fill: 'var(--color-hover)' }}
            isAnimationActive={false}
          />
          {series.map((s, i) => (
            <Bar key={s.key} dataKey={s.key} name={s.label} stackId="stack" fill={colors[i]} isAnimationActive={false} />
          ))}
        </BarChart>
      </ResponsiveContainer>
      {legend && series.length > 1 && <Legend items={series.map((s, i) => ({ key: s.key, label: s.label, color: colors[i]! }))} />}
    </div>
  );
}
