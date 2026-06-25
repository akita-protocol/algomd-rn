import React from "react";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import Svg, { Path } from "react-native-svg";
import type {
  Collection as CollectionType,
  ComponentSize,
} from "../types/algorand";
import { SizeContainer } from "../ui/SizeContainer";

function PhotoIcon({
  size = 24,
  color = "#71717a",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="m15 8-6 6" />
      <Path d="M9 8h.01" />
      <Path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
      <Path d="m3 16 5-5c.928-.893 2.072-.893 3 0l5 5" />
    </Svg>
  );
}

export interface CollectionComponentProps {
  data: CollectionType;
  compact?: boolean;
  size?: ComponentSize;
  className?: string;
  imageUrl?: string;
  onPress?: (collection: CollectionType) => void;
}

export function CollectionComponent({
  data: collection,
  compact = false,
  size = "full",
  className,
  imageUrl,
  onPress,
}: CollectionComponentProps) {
  const source = imageUrl || collection.avatarUrl;
  const content = compact ? (
    <View className="flex-row items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-2 py-1">
      <CollectionAvatar source={source} compact />
      <Text
        className="max-w-40 text-xs font-bold text-zinc-100"
        numberOfLines={1}
      >
        {collection.name}
      </Text>
    </View>
  ) : (
    <View className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
      <View className="flex-row gap-4 p-4">
        <CollectionAvatar source={source} />
        <View className="min-w-0 flex-1">
          <View className="mb-1 flex-row flex-wrap items-center gap-2">
            <Text
              className="flex-shrink text-base font-bold text-white"
              numberOfLines={1}
            >
              {collection.name}
            </Text>
            {collection.explicit && (
              <View className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5">
                <Text className="text-[11px] font-bold uppercase text-red-300">
                  Explicit
                </Text>
              </View>
            )}
          </View>
          {collection.description ? (
            <Text
              className="mb-3 text-sm leading-5 text-zinc-300"
              numberOfLines={3}
            >
              {collection.description}
            </Text>
          ) : null}
          <View className="flex-row flex-wrap gap-2">
            {collection.network ? (
              <MetaPill label={collection.network} />
            ) : null}
            {collection.prefixes?.slice(0, 2).map((prefix) => (
              <MetaPill key={prefix} label={prefix} />
            ))}
            {collection.artists?.slice(0, 2).map((artist) => (
              <MetaPill key={artist} label={artist} />
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SizeContainer size={size} className={className}>
      {onPress ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => onPress(collection)}
        >
          {content}
        </Pressable>
      ) : (
        content
      )}
    </SizeContainer>
  );
}

function CollectionAvatar({
  source,
  compact,
}: {
  source?: string;
  compact?: boolean;
}) {
  const sizeClass = compact ? "h-6 w-6 rounded-lg" : "h-20 w-20 rounded-2xl";
  return (
    <View
      className={`${sizeClass} shrink-0 items-center justify-center overflow-hidden border border-zinc-800 bg-zinc-900`}
    >
      {source ? (
        <Image
          source={{ uri: source }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      ) : (
        <PhotoIcon size={compact ? 14 : 24} />
      )}
    </View>
  );
}

function MetaPill({ label }: { label: string }) {
  return (
    <View className="rounded-full border border-zinc-800 bg-zinc-900 px-2 py-1">
      <Text className="text-xs font-medium text-zinc-300">{label}</Text>
    </View>
  );
}
