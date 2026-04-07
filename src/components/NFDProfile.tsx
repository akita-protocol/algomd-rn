import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import Svg, { Path } from 'react-native-svg';
import type { NFDProfile as NFDProfileType, ComponentSize } from '../types/algorand';
import { formatAddress, formatRelativeTime } from '../utils/format';
import { CopyButton } from '../ui/CopyButton';
import { SizeContainer } from '../ui/SizeContainer';

function VerifiedIcon({ size = 16, color = '#60a5fa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <Path d="m9 12 2 2 4-4" />
    </Svg>
  );
}

function UserIcon({ size = 24, color = '#71717a' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <Path d="M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
    </Svg>
  );
}

function ExternalLinkIcon({ size = 16, color = '#a1a1aa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M15 3h6v6" />
      <Path d="M10 14 21 3" />
      <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </Svg>
  );
}

interface NFDProfileProps {
  data: NFDProfileType;
  showBio?: boolean;
  showProperties?: boolean;
  compact?: boolean;
  size?: ComponentSize;
  className?: string;
}

export function NFDProfileComponent({
  data: profile,
  showBio = true,
  showProperties = true,
  compact = false,
  size = 'full',
  className,
}: NFDProfileProps) {
  const handleSocialPress = (key: string, value: string) => {
    let url: string;
    if (key === 'website') {
      url = value.startsWith('http') ? value : `https://${value}`;
    } else {
      url = `https://${key}.com/${value.replace('@', '')}`;
    }
    Linking.openURL(url);
  };

  if (compact) {
    return (
      <View className={`flex-row items-center gap-1.5 px-2 py-1 rounded-full bg-zinc-800/60 ${className ?? ''}`}>
        <View className="w-5 h-5 rounded-full overflow-hidden bg-zinc-700 items-center justify-center">
          {profile.avatar ? (
            <Image source={{ uri: profile.avatar }} style={{ width: 20, height: 20 }} contentFit="cover" />
          ) : (
            <UserIcon size={12} />
          )}
        </View>
        {profile.verified && <VerifiedIcon size={12} />}
        <Text className="text-xs font-medium text-white" numberOfLines={1}>{profile.name}</Text>
        <CopyButton value={profile.name} size={12} color="#a1a1aa" />
      </View>
    );
  }

  const isFullscreen = size === 'fullscreen';

  return (
    <SizeContainer size={size} className={className}>
      <View
        className={`rounded-2xl ${isFullscreen ? 'border border-zinc-800' : 'bg-zinc-900/80'}`}
      >
        <View className="p-5">
          {/* Header */}
          <View className="flex-row items-start gap-3 mb-3">
            <View className="w-14 h-14 rounded-full overflow-hidden bg-zinc-800 items-center justify-center">
              {profile.avatar ? (
                <Image source={{ uri: profile.avatar }} style={{ width: 56, height: 56 }} contentFit="cover" />
              ) : (
                <UserIcon size={28} />
              )}
            </View>

            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-1 flex-wrap">
                <Text className="text-base font-bold text-white" numberOfLines={1}>{profile.name}</Text>
                {profile.verified && <VerifiedIcon size={18} />}
              </View>
              <Text className="text-xs font-mono text-zinc-400 mb-2">
                {formatAddress(profile.address)}
              </Text>
              <View className="flex-row gap-1">
                <CopyButton value={profile.name} size={14} color="#a1a1aa" />
                <CopyButton value={profile.address} size={14} color="#a1a1aa" />
              </View>
            </View>
          </View>

          {/* Bio */}
          {showBio && profile.bio && (
            <View className="mb-3">
              <Text className="text-sm text-zinc-300 leading-5">{profile.bio}</Text>
            </View>
          )}

          {/* Verification Badge */}
          <View className="mb-3">
            <View
              className={`self-start flex-row items-center gap-2 px-3 py-1 rounded-full ${
                profile.verified ? 'bg-blue-500/20' : 'bg-zinc-800'
              }`}
            >
              {profile.verified ? (
                <>
                  <VerifiedIcon size={12} />
                  <Text className="text-xs font-medium text-blue-400">Verified NFD</Text>
                </>
              ) : (
                <>
                  <UserIcon size={12} color="#a1a1aa" />
                  <Text className="text-xs font-medium text-zinc-400">Unverified</Text>
                </>
              )}
            </View>
          </View>

          {/* Social Links */}
          {showProperties && Object.keys(profile.properties).length > 0 && (
            <View className="mb-3">
              <Text className="text-sm font-medium text-white mb-2">Social Links</Text>
              <View className="flex-row flex-wrap gap-2">
                {Object.entries(profile.properties).map(([key, value]) => (
                  <Pressable
                    key={key}
                    onPress={() => handleSocialPress(key, value)}
                    className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800"
                  >
                    <ExternalLinkIcon size={14} color="#a1a1aa" />
                    <Text className="text-xs font-medium text-zinc-300 capitalize">{key}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Created Date */}
          <Text className="text-xs text-zinc-600">
            Created {formatRelativeTime(profile.createdAt)}
          </Text>
        </View>
      </View>
    </SizeContainer>
  );
}
