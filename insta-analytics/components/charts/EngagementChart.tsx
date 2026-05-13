"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatNumber } from "@/lib/format";

interface Point {
  date: string;
  reach: number;
  impressions: number;
}

export function EngagementChart({
  data,
}: {
  data: { date: Date; reach: number; impressions: number }[];
}) {
  const series: Point[] = data.map((d) => ({
    date: d.date.toISOString(),
    reach: d.reach,
    impressions: d.impressions,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart
        data={series}
        margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
      >
        <defs>
          <linearGradient id="reachFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="impFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          stroke="#71717a"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(d: string) =>
            format(new Date(d), "d MMM", { locale: fr })
          }
          minTickGap={32}
        />
        <YAxis
          stroke="#71717a"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => formatNumber(v)}
          width={48}
        />
        <Tooltip
          contentStyle={{
            background: "#111113",
            border: "1px solid #27272a",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelFormatter={(d) =>
            format(new Date(d as string), "EEE d MMM yyyy", { locale: fr })
          }
          formatter={(v: number, name: string) => [
            formatNumber(v),
            name === "reach" ? "Reach" : "Impressions",
          ]}
        />
        <Area
          type="monotone"
          dataKey="impressions"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#impFill)"
        />
        <Area
          type="monotone"
          dataKey="reach"
          stroke="#a855f7"
          strokeWidth={2}
          fill="url(#reachFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
