import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';

interface CopyButtonProps {
  value: string;
  size?: number;
  color?: string;
  className?: string;
  onCopied?: () => void;
}

function CopyIcon({ size = 16, color = '#a1a1aa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <Path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
    </Svg>
  );
}

export function CopyButton({ value, size = 16, color = '#a1a1aa', className, onCopied }: CopyButtonProps) {
  const handleCopy = useCallback(async () => {
    await Clipboard.setStringAsync(value);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCopied?.();
  }, [value, onCopied]);

  return (
    <Pressable
      onPress={handleCopy}
      className={`p-1.5 rounded-lg ${className ?? ''}`}
      hitSlop={8}
    >
      <CopyIcon size={size} color={color} />
    </Pressable>
  );
}
