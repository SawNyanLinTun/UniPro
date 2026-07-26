
import React from 'react';
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
            stroke="rgba(255,255,255,0.08)"
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
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={1}
            />
          );
        })}

        {/* Alumni polygon */}
        <polygon
          points={polygonPoints(alumniValues, cx, cy, maxR)}
          fill="rgba(124, 58, 237, 0.2)"
          stroke="#7c3aed"
          strokeWidth={2}
        />

        {/* Candidate polygon (or ghost when locked) */}
        {candidateValues && !locked && (
          <polygon
            points={polygonPoints(candidateValues, cx, cy, maxR)}
            fill="rgba(0, 242, 255, 0.18)"
            stroke="#00f2ff"
            strokeWidth={2}
          />
        )}
        {locked && (
          <polygon
            points={polygonPoints(Array(RADAR_AXES.length).fill(45), cx, cy, maxR)}
            fill="rgba(255,255,255,0.04)"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
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
              className="fill-gray-400"
              style={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }}
            >
              {locked ? '••••••' : axis.label}
            </text>
          );
        })}
      </svg>

      {locked && (
        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
          <div className="px-4 py-2 rounded-full bg-resin-bg/80 border border-white/10 font-mono text-[0.6rem] uppercase tracking-widest text-resin-amber">
            Locked — spend 1 token
          </div>
        </div>
      )}
    </div>
  );
};

export default CvRadarChart;
