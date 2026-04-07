import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

interface LoadingSkeletonProps {
  name: string;
}

export function LoadingSkeleton({ name }: LoadingSkeletonProps) {
  return (
    <View
      className="rounded-xl items-center justify-center bg-zinc-900/80"
      style={{ padding: 20, minHeight: 80, borderWidth: 1, borderColor: '#27272a' }}
    >
      <ActivityIndicator size="small" color="#a1a1aa" />
      <Text className="mt-2 text-xs text-zinc-500">
        Loading {name}...
      </Text>
    </View>
  );
}

interface ErrorStateProps {
  name: string;
  message: string;
}

export function ErrorState({ name, message }: ErrorStateProps) {
  return (
    <View
      className="rounded-xl bg-zinc-900/80"
      style={{ padding: 16, minHeight: 60, borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)' }}
    >
      <Text className="text-xs font-semibold text-red-400">
        Failed to load {name}
      </Text>
      <Text className="text-xs text-zinc-500 mt-1">
        {message}
      </Text>
    </View>
  );
}
