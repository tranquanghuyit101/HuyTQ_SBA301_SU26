import { THEME_LABELS, THEME_MODES } from '../../data/themeConfig';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeNavbar() {
  const { mode, resolvedTheme, colors, changeMode } = useTheme();

  return (
    <div style={{ padding: '1rem', backgroundColor: colors.surface, color: colors.text, borderBottom: `1px solid ${colors.border}` }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {THEME_MODES.map((themeMode) => (
          <button
            key={themeMode}
            type="button"
            onClick={() => changeMode(themeMode)}
            style={{
              padding: '0.5rem 1rem',
              border: mode === themeMode ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
              backgroundColor: mode === themeMode ? colors.primary : 'transparent',
              color: mode === themeMode ? colors.primaryText : colors.text,
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            {THEME_LABELS[themeMode]}
          </button>
        ))}
      </div>
      <p style={{ marginTop: '0.75rem', color: colors.textMuted }}>
        Resolved theme: <strong>{resolvedTheme}</strong>
      </p>
    </div>
  );
}
