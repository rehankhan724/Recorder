const light = {
    primary: '#4F46E5', // Indigo
    primaryDark: '#3730A3',
    secondary: '#64748B', // Slate
    accent: '#F59E0B', // Gold
    highlight: '#10B981', // Emerald
    white: '#FFFFFF',
    black: '#0F172A',
    gray: '#94A3B8',
    lightGray: '#F1F5F9',
    bg: '#F8FAFC',
    danger: '#EF4444',
    text: '#1E293B',
    placeholder: '#94A3B8',
    card: '#FFFFFF',
    border: '#E2E8F0',
};

const dark = {
    primary: '#6366F1', // Brighter Indigo for dark mode
    primaryDark: '#4F46E5',
    secondary: '#94A3B8',
    accent: '#FBBF24', // Brighter Gold
    highlight: '#34D399', // Brighter Emerald
    white: '#FFFFFF',
    black: '#0F172A',
    gray: '#475569',
    lightGray: '#1E293B',
    bg: '#020617', // Deep Midnight Blue
    danger: '#F87171',
    text: '#F1F5F9',
    placeholder: '#475569',
    card: '#0F172A',
    border: '#1E293B',
};

export default { light, dark };
// Export light as default for backward compatibility if needed
export const colors = light;
