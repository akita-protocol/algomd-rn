import React from 'react';
import { View } from 'react-native';
import type { ComponentSize } from '../types/algorand';

const SIZE_MAP: Record<ComponentSize, string> = {
  sm: 'w-full max-w-xs',
  md: 'w-full max-w-sm',
  lg: 'w-full max-w-lg',
  full: 'w-full',
  fullscreen: 'w-full',
};

interface SizeContainerProps {
  size: ComponentSize;
  className?: string;
  children: React.ReactNode;
}

export function SizeContainer({ size, className, children }: SizeContainerProps) {
  return (
    <View className={`${SIZE_MAP[size]} ${className ?? ''}`}>
      {children}
    </View>
  );
}
