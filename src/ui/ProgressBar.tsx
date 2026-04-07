import React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
} from 'react-native-reanimated';

interface ProgressBarProps {
  /** A value between 0 and 100. */
  percentage: number;
  /** Height of the bar in Tailwind. Defaults to h-2. */
  heightClass?: string;
  /** Track background class. */
  trackClass?: string;
  /** Fill background class. */
  fillClass?: string;
  className?: string;
}

export function ProgressBar({
  percentage,
  heightClass = 'h-2',
  trackClass = 'bg-zinc-700',
  fillClass = 'bg-purple-500',
  className,
}: ProgressBarProps) {
  const clampedPct = useDerivedValue(() => Math.max(0, Math.min(100, percentage)));

  const fillStyle = useAnimatedStyle(() => ({
    width: `${withTiming(clampedPct.value, { duration: 500 })}%`,
  }));

  return (
    <View className={`w-full rounded-full overflow-hidden ${trackClass} ${heightClass} ${className ?? ''}`}>
      <Animated.View
        className={`${heightClass} rounded-full ${fillClass}`}
        style={fillStyle}
      />
    </View>
  );
}
