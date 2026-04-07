import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { Poll as PollType, ComponentSize } from '../types/algorand';
import { formatRelativeTime } from '../utils/format';
import { SizeContainer } from '../ui/SizeContainer';
import { StatusBadge } from '../ui/StatusBadge';
import { ProgressBar } from '../ui/ProgressBar';

function VoteIcon({ size = 16, color = '#a1a1aa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m9 12 2 2 4-4" />
      <Path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" />
      <Path d="M22 19H2" />
    </Svg>
  );
}

function UsersIcon({ size = 12, color = '#a1a1aa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <Path d="M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
      <Path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  );
}

function TrendingUpIcon({ size = 12, color = '#34d399' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m22 7-8.5 8.5-5-5L2 17" />
      <Path d="M16 7h6v6" />
    </Svg>
  );
}

function ClockIcon({ size = 12, color = '#71717a' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" />
      <Path d="M12 6v6l4 2" />
    </Svg>
  );
}

function CalendarIcon({ size = 12, color = '#71717a' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M8 2v4" />
      <Path d="M16 2v4" />
      <Path d="M3 10h18" />
      <Path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
    </Svg>
  );
}

interface PollProps {
  data: PollType;
  showVoteButton?: boolean;
  compact?: boolean;
  size?: ComponentSize;
  className?: string;
  onVote?: (pollId: string, optionId: string) => void;
}

export function PollComponent({
  data: poll,
  showVoteButton = true,
  compact = false,
  size = 'full',
  className,
  onVote,
}: PollProps) {
  const isExpired = poll.expiresAt ? new Date() > poll.expiresAt : false;
  const canVote = poll.status === 'active' && !isExpired;
  const hasGating = poll.gating !== undefined;
  const totalPower = poll.options.reduce((sum, opt) => sum + opt.votingPower, 0);

  const isFullscreen = size === 'fullscreen';

  return (
    <SizeContainer size={size} className={className}>
      <View
        className={`rounded-2xl ${isFullscreen ? 'border border-zinc-800' : 'bg-zinc-900/80'}`}
      >
        <View className={compact ? 'p-2' : 'p-5'}>
          {/* Header */}
          <View className={compact ? 'mb-1' : 'mb-3'}>
            <View className="flex-row items-center gap-2 flex-wrap mb-1">
              <VoteIcon size={16} color={poll.status === 'active' ? '#34d399' : '#71717a'} />
              <Text className="text-sm font-medium text-zinc-400">Poll</Text>
              <StatusBadge
                label={poll.status.charAt(0).toUpperCase() + poll.status.slice(1)}
                variant={poll.status === 'active' ? 'success' : 'neutral'}
              />
              {hasGating && <StatusBadge label="Gated" variant="primary" />}
              {isExpired && <StatusBadge label="Expired" variant="error" />}
            </View>

            <Text className={`font-semibold text-white ${compact ? 'text-xs mb-0.5' : 'text-base mb-2'}`}>
              {poll.question}
            </Text>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="flex-row items-center gap-1">
                  <UsersIcon size={12} color="#71717a" />
                  <Text className="text-xs text-zinc-400">{poll.totalVotes} votes</Text>
                </View>
                {!compact && (
                  <View className="flex-row items-center gap-1">
                    <TrendingUpIcon size={12} color="#71717a" />
                    <Text className="text-xs text-zinc-400">{totalPower.toLocaleString()} power</Text>
                  </View>
                )}
              </View>
              {poll.expiresAt && (
                <View className="flex-row items-center gap-1">
                  <ClockIcon size={12} color="#71717a" />
                  <Text className="text-xs text-zinc-400">
                    {canVote ? 'Ends' : 'Ended'} {formatRelativeTime(poll.expiresAt)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Gating Info */}
          {hasGating && poll.gating && !compact && (
            <View className="mb-3 bg-purple-500/5 rounded-xl px-3 py-2.5">
              <Text className="text-xs font-medium text-purple-300 mb-1">Voting Requirements</Text>
              <Text className="text-xs text-purple-200">
                {poll.gating.type === 'asset-holding' && 'Requires holding specified assets to participate'}
                {poll.gating.type === 'nfd-verified' && 'Requires verified NFD to participate'}
              </Text>
            </View>
          )}

          {/* Options */}
          <View className={compact ? 'gap-1' : 'gap-2'}>
            {poll.options.map((option, index) => {
              const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
              const powerPercentage =
                totalPower > 0 ? (option.votingPower / totalPower) * 100 : 0;

              return (
                <Pressable
                  key={option.id}
                  onPress={() => canVote && showVoteButton && onVote?.(poll.id, option.id)}
                  disabled={!canVote || !showVoteButton}
                  className={`rounded-lg border overflow-hidden ${
                    canVote && showVoteButton
                      ? 'border-zinc-800 active:border-purple-500'
                      : 'border-zinc-800'
                  }`}
                >
                  {/* Background fill */}
                  <View className="absolute inset-0 bg-purple-500/10" style={{ width: `${percentage}%` }} />

                  <View className={compact ? 'p-2' : 'p-3'}>
                    <View className="flex-row items-center justify-between mb-1">
                      <View className="flex-row items-center gap-2 flex-1 mr-2">
                        <Text
                          className={`font-medium text-white ${compact ? 'text-xs' : 'text-sm'}`}
                          numberOfLines={1}
                        >
                          {option.text}
                        </Text>
                        {index === 0 && poll.status === 'active' && (
                          <View className="flex-row items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-500/20">
                            <TrendingUpIcon size={10} color="#34d399" />
                            <Text className="text-xs font-medium text-green-400">Leading</Text>
                          </View>
                        )}
                      </View>
                      <View className="items-end">
                        <Text className={`font-bold text-white ${compact ? 'text-xs' : 'text-sm'}`}>
                          {percentage.toFixed(1)}%
                        </Text>
                        {!compact && (
                          <Text className="text-xs text-zinc-400">{option.votes} votes</Text>
                        )}
                      </View>
                    </View>

                    {!compact && (
                      <View>
                        <ProgressBar
                          percentage={percentage}
                          heightClass="h-1.5"
                          trackClass="bg-zinc-800"
                          fillClass="bg-purple-500"
                        />
                        <Text className="text-xs text-zinc-600 mt-1">
                          Voting Power: {option.votingPower.toLocaleString()} ({powerPercentage.toFixed(1)}%)
                        </Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Vote CTA */}
          {showVoteButton && canVote && !compact && (
            <View className="mt-3 bg-purple-500/5 rounded-xl px-3 py-2.5 items-center">
              <View className="flex-row items-center gap-2">
                <VoteIcon size={16} color="#c084fc" />
                <Text className="text-sm font-medium text-purple-300">Tap any option above to vote</Text>
              </View>
            </View>
          )}

          {/* Footer */}
          {!compact && (
            <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-zinc-800">
              <View className="flex-row items-center gap-1.5">
                <CalendarIcon />
                <Text className="text-xs text-zinc-600">Created {formatRelativeTime(poll.createdAt)}</Text>
              </View>
              <Text className="text-xs text-zinc-600">by {poll.creator.slice(0, 8)}...</Text>
            </View>
          )}
        </View>
      </View>
    </SizeContainer>
  );
}
