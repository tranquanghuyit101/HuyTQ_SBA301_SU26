import { useTheme } from '../../context/ThemeContext';

export default function ThemedButton({ children, onClick, variant = 'primary' }) {
  const { colors } = useTheme();
  const isPrimary = variant === 'primary';
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        border: isPrimary ? 'none' : `1px solid ${colors.primary}`,
        backgroundColor: isPrimary ? colors.primary : 'transparent',
        color: isPrimary ? colors.primaryText : colors.primary,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
