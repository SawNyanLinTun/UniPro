import React from 'react';
import { Lock } from 'lucide-react';
import { RADAR_AXES } from '../constants/scholarshipLedger';
import type { CvRadarScores } from '../types';

interface CvRadarChartProps {
  alumni: CvRadarScores;
  candidate?: CvRadarScores | null;
  locked?: boolean;
  size?: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angleRad: number) {
  return {
    x: cx + r * Math.sin(angleRad),
    y: cy - r * Math.cos(angleRad),
  };
}

function polygonPoints(scores: number[], cx: number, cy: number, maxR: number): string {
  const n = scores.length;
  return scores
    .map((value, i) => {
      const angle = (i / n) * Math.PI * 2;
      const r = (Math.max(0, Math.min(100, value)) / 100) * maxR;
      const { x, y } = polarToCartesian(cx, cy, r, angle);
      return `${x},${y}`;
    })
    .join(' ');
}

const CvRadarChart: React.FC<CvRadarChartProps> = ({
  alumni,
  candidate = null,
  locked = false,
  size = 320,
}) => {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.32;
  const levels = [0.25, 0.5, 0.75, 1];

  const alumniValues = RADAR_AXES.map(a => alumni[a.key]);
  const candidateValues = candidate ? RADAR_AXES.map(a => candidate[a.key]) : null;

  return (
    <div className={`relative inline-block ${locked ? 'select-none' : ''}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Grid rings */}
        {levels.map(level => (
          <polygon
            key={level}
            points={polygonPoints(Array(RADAR_AXES.length).fill(level * 100), cx, cy, maxR)}
            fill="none"
            stroke="var(--color-border-strong)"
            strokeWidth={1}
          />
        ))}

        {/* Axes */}
        {RADAR_AXES.map((_, i) => {
          const angle = (i / RADAR_AXES.length) * Math.PI * 2;
          const end = polarToCartesian(cx, cy, maxR, angle);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="var(--color-border-strong)"
              strokeWidth={1}
            />
          );
        })}

        {/* Alumni polygon */}
        <polygon
          points={polygonPoints(alumniValues, cx, cy, maxR)}
          fill="var(--color-primary-muted)"
          stroke="var(--color-primary)"
          strokeWidth={2}
          style={{ fillOpacity: 0.3 }}
        />

        {/* Candidate polygon (or ghost when locked) */}
        {candidateValues && !locked && (
          <polygon
            points={polygonPoints(candidateValues, cx, cy, maxR)}
            fill="var(--color-primary-muted)"
            stroke="var(--color-primary)"
            strokeWidth={2}
            style={{ fillOpacity: 0.5 }}
          />
        )}
        {locked && (
          <polygon
            points={polygonPoints(Array(RADAR_AXES.length).fill(45), cx, cy, maxR)}
            fill="var(--color-surface-elevated)"
            stroke="var(--color-border-strong)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            style={{ fillOpacity: 0.5 }}
          />
        )}

        {/* Labels */}
        {RADAR_AXES.map((axis, i) => {
          const angle = (i / RADAR_AXES.length) * Math.PI * 2;
          const labelPos = polarToCartesian(cx, cy, maxR + 28, angle);
          return (
            <text
              key={axis.key}
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--color-text-muted)"
              style={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }}
            >
              {locked ? '••••••' : axis.label}
            </text>
          );
        })}
      </svg>

      {locked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-4 py-2 rounded-full bg-surface border border-border flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-widest text-accent">
            <Lock size={12} /> 1 token to unlock
          </div>
        </div>
      )}
    </div>
  );
};

export default CvRadarChart;
