import { useId, type ReactNode } from 'react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartMessage, ChartTooltip, axisTick, gridProps, seriesColor, spanOf, timeTickFormatter, yAxisWidth } from './common.tsx';

export interface Series {
  key: string;
  label: string;
  color?: string;
}

export interface TimeSeriesChartProps {
  data: ({ time: number } & Record<string, number | null>)[];
  series: Series[];
  kind?: 'area' | 'line';
  height?: number;
  yDomain?: [number | 'auto', number | 'auto'];
  formatValue?: (v: number) => string;
  empty?: ReactNode;
}

export function TimeSeriesChart({
  data,
  series,
  kind = 'area',
  height = 200,
  yDomain,
  formatValue = (v) => v.toLocaleString(),
  empty = 'No data in this range.',
}: TimeSeriesChartProps) {
  const gradientId = useId().replace(/:/g, '');
  if (data.length === 0) return <ChartMessage height={height}>{empty}</ChartMessage>;
  const fmtTime = timeTickFormatter(spanOf(data));
  const colors = series.map((s, i) => s.color ?? seriesColor(i));
  const peak = Math.max(
    typeof yDomain?.[1] === 'number' ? yDomain[1] : 0,
    ...data.flatMap((row) => series.map((s) => Math.abs(row[s.key] ?? 0))),
  );
  const common = { data, margin: { top: 8, right: 20, bottom: 0, left: 0 } };
  const axes = (
    <>
      <CartesianGrid {...gridProps} />
      <XAxis
        dataKey="time"
        type="number"
        scale="time"
        domain={['dataMin', 'dataMax']}
        tickFormatter={fmtTime}
        tick={axisTick}
        tickLine={false}
        axisLine={false}
        minTickGap={48}
      />
      <YAxis
        tick={axisTick}
        tickLine={false}
        axisLine={false}
        width={yAxisWidth(peak, formatValue)}
        tickFormatter={formatValue}
        domain={yDomain ?? ['auto', 'auto']}
      />
      <Tooltip
        content={<ChartTooltip formatValue={formatValue} />}
        cursor={{ stroke: 'var(--color-line-strong)' }}
        isAnimationActive={false}
      />
    </>
  );
  return (
    <ResponsiveContainer width="100%" height={height}>
      {kind === 'line' ? (
        <LineChart {...common}>
          {axes}
          {series.map((s, i) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={colors[i]}
              strokeWidth={1.75}
              dot={false}
              isAnimationActive={false}
              connectNulls
            />
          ))}
        </LineChart>
      ) : (
        <AreaChart {...common}>
          <defs>
            {series.map((s, i) => (
              <linearGradient key={s.key} id={`${gradientId}-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors[i]} stopOpacity={0.28} />
                <stop offset="100%" stopColor={colors[i]} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          {axes}
          {series.map((s, i) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={colors[i]}
              strokeWidth={1.75}
              fill={`url(#${gradientId}-${i})`}
              isAnimationActive={false}
              connectNulls
            />
          ))}
        </AreaChart>
      )}
    </ResponsiveContainer>
  );
}
