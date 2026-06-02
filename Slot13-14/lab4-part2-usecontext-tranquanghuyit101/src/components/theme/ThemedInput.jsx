import { useTheme } from '../../context/ThemeContext';

export default function ThemedInput({ placeholder }) {
  const { colors } = useTheme();
  return (
    <input
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.background,
        color: colors.text,
      }}
    />
  );
}
