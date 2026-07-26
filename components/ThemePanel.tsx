import React, { useEffect, useRef } from 'react';
import { Check, Moon, Sun, Palette } from 'lucide-react';
import { useTheme, ThemePreset, AccentColor } from './ThemeProvider';

interface ThemePanelProps {
  onClose?: () => void;
}

const ThemePanel: React.FC<ThemePanelProps> = ({ onClose }) => {
  const { preset, accent, setPreset, setAccent, presets, accents } = useTheme();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose?.();
      }
    };
    if (onClose) {
      document.addEventListener('mousedown', onClick);
      return () => document.removeEventListener('mousedown', onClick);
    }
  }, [onClose]);

  const handlePresetChange = (newPreset: ThemePreset) => {
    document.documentElement.classList.add('theme-transition');
    setPreset(newPreset);
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 350);
  };

  const handleAccentChange = (newAccent: AccentColor) => {
    document.documentElement.classList.add('theme-transition');
    setAccent(newAccent);
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 350);
  };

  return (
    <div ref={panelRef} className="bg-surface border border-border rounded-2xl p-5 shadow-lg max-w-sm w-full">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-primary-muted flex items-center justify-center">
          <Palette size={16} className="text-primary" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-text text-sm">Appearance</h3>
          <p className="text-xs text-text-muted">Customize the look</p>
        </div>
      </div>

      {/* Presets */}
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Theme</p>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePresetChange(p.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                preset === p.id
                  ? 'border-primary bg-primary-muted'
                  : 'border-border bg-surface-elevated hover:border-border-strong'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg border border-border ${p.preview} flex items-center justify-center`}>
                {preset === p.id && (
                  <Check size={14} className={p.id === 'light' ? 'text-text' : 'text-white'} />
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${preset === p.id ? 'text-primary' : 'text-text'}`}>{p.label}</p>
                <p className="text-[0.65rem] text-text-muted">{p.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Accents */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Accent color</p>
        <div className="flex flex-wrap gap-2">
          {accents.map((a) => (
            <button
              key={a.id}
              onClick={() => handleAccentChange(a.id)}
              className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                accent === a.id ? 'border-text scale-110' : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: a.hex }}
              aria-label={`Select ${a.label} accent`}
              title={a.label}
            >
              {accent === a.id && <Check size={14} className="text-white" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemePanel;
