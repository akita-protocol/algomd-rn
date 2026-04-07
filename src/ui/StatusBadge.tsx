import React from 'react';
import { View, Text } from 'react-native';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary';

const VARIANT_CLASSES: Record<BadgeVariant, { container: string; text: string }> = {
  success: {
    container: 'bg-green-500/20',
    text: 'text-green-400',
  },
  warning: {
    container: 'bg-yellow-500/20',
    text: 'text-yellow-400',
  },
  error: {
    container: 'bg-red-500/20',
    text: 'text-red-400',
  },
  info: {
    container: 'bg-blue-500/20',
    text: 'text-blue-400',
  },
  neutral: {
    container: 'bg-zinc-500/20',
    text: 'text-zinc-400',
  },
  primary: {
    container: 'bg-purple-500/20',
    text: 'text-purple-400',
  },
};

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  className?: string;
}

export function StatusBadge({ label, variant = 'neutral', icon, className }: StatusBadgeProps) {
  const styles = VARIANT_CLASSES[variant];

  return (
    <View
      className={`flex-row items-center gap-1 px-2 py-0.5 rounded-full ${styles.container} ${className ?? ''}`}
    >
      {icon}
      <Text className={`text-xs font-medium ${styles.text}`}>{label}</Text>
    </View>
  );
}
