import { ThemeProvider, useTheme } from '../context/ThemeContext';
import ThemeNavbar from '../components/theme/ThemeNavbar';
import ThemedCard from '../components/theme/ThemedCard';
import ThemedButton from '../components/theme/ThemedButton';
import ThemedInput from '../components/theme/ThemedInput';

function ThemePageContent() {
  const { colors } = useTheme();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      color: colors.text,
      padding: '2rem',
    }}>
      <ThemeNavbar />
      <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
        <ThemedCard title="Button demo">
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <ThemedButton>Primary</ThemedButton>
            <ThemedButton variant="outline">Outline</ThemedButton>
          </div>
        </ThemedCard>

        <ThemedCard title="Input demo">
          <ThemedInput placeholder="Nhập dữ liệu..." />
        </ThemedCard>

        <ThemedCard title="Thông tin theme">
          <p style={{ color: colors.textMuted }}>This demo shows theme-aware cards, buttons, and inputs.</p>
        </ThemedCard>
      </div>
    </div>
  );
}

export default function Ex04ThemePage() {
  return (
    <ThemeProvider>
      <ThemePageContent />
    </ThemeProvider>
  );
}
