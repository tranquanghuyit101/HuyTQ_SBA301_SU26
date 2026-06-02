import { useTheme } from '../../context/ThemeContext';

export default function ThemedCard({ title, children }) {
  const { colors } = useTheme();
  return (
    <div style={{
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      color: colors.text,
      borderRadius: '12px',
      padding: '1rem',
      boxShadow: `0 2px 8px rgba(0,0,0,0.08)`,
      minWidth: '250px',
    }}>
      {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
      {children}
    </div>
  );
}
