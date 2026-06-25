import React, { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { Image } from "expo-image";
import Svg, { Path } from "react-native-svg";
import { useASAData } from "../hooks/useAlgomdData";
import type { ASA, ComponentSize, DualStakeActionParams, DualStakePool as DualStakePoolData } from "../types/algorand";
import { formatAssetAmount, formatRelativeTime } from "../utils/format";
import { ErrorState } from "../ui/DataStates";
import { SizeContainer } from "../ui/SizeContainer";

const ALGO_ASSET: ASA = {
  id: 0,
  name: "Algo",
  unitName: "ALGO",
  total: 10_000_000_000_000_000,
  decimals: 6,
  defaultFrozen: false,
  creator: "",
  createdAt: new Date(0),
  verified: true,
};

export interface DualStakePoolProps {
  data?: DualStakePoolData;
  appId?: number | string;
  walletAppId?: number | string;
  rewardAssetId?: number | string;
  dualStakeAssetId?: number | string;
  title?: string;
  description?: string;
  status?: DualStakePoolData["status"];
  defaultAmount?: string;
  rekeyBack?: boolean;
  size?: ComponentSize;
  className?: string;
  disabled?: boolean;
  onStake?: (params: DualStakeActionParams) => Promise<void> | void;
  onExchange?: (params: DualStakeActionParams) => Promise<void> | void;
}

function ArrowRightIcon({ color = "#a1a1aa" }: { color?: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12h14" />
      <Path d="m12 5 7 7-7 7" />
    </Svg>
  );
}

export function DualStakePoolComponent({
  data,
  appId,
  walletAppId,
  rewardAssetId,
  dualStakeAssetId,
  title,
  description,
  status,
  defaultAmount = "",
  rekeyBack = true,
  size = "full",
  className,
  disabled,
  onStake,
  onExchange,
}: DualStakePoolProps) {
  const [amount, setAmount] = useState(defaultAmount);
  const [pending, setPending] = useState<"stake" | "exchange" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rewardQuery = useASAData(data?.rewardAsset || rewardAssetId == null ? undefined : rewardAssetId);
  const dualStakeQuery = useASAData(data?.dualStakeAsset || dualStakeAssetId == null ? undefined : dualStakeAssetId);

  const stakeAsset = data?.stakeAsset ?? ALGO_ASSET;
  const rewardAsset = data?.rewardAsset ?? rewardQuery.data;
  const dualStakeAsset = data?.dualStakeAsset ?? dualStakeQuery.data;
  const normalizedAppId = Number(data?.appId ?? appId);
  const normalizedWallet = walletAppId == null ? undefined : Number(walletAppId);
  const amountMicroAlgos = useMemo(() => parseAlgoAmount(amount), [amount]);
  const canSubmit = !disabled && normalizedWallet != null && Number.isFinite(normalizedAppId) && amountMicroAlgos > BigInt(0);

  async function submit(action: "stake" | "exchange") {
    const handler = action === "stake" ? onStake : onExchange;
    if (!handler || !canSubmit || normalizedWallet == null) return;
    setPending(action);
    setError(null);
    try {
      await handler({
        action,
        wallet: normalizedWallet,
        appId: normalizedAppId,
        amount: amountMicroAlgos,
        rekeyBack,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed");
    } finally {
      setPending(null);
    }
  }

  if (!data && appId == null) {
    return <ErrorState name="DualStakePool" message="Either data or appId is required" />;
  }

  return (
    <SizeContainer size={size} className={className}>
      <View className="rounded-2xl border border-zinc-800 bg-zinc-950/95">
        <View className="p-5">
          <View className="mb-4 flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text className="text-base font-bold text-white" numberOfLines={1}>
                {data?.title ?? title ?? `Dual Stake #${normalizedAppId}`}
              </Text>
              <Text className="mt-1 text-xs text-zinc-500" numberOfLines={2}>
                {data?.description ?? description ?? "Stake ALGO with the paired reward ASA."}
              </Text>
            </View>
            <View className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1">
              <Text className="text-[11px] font-semibold uppercase text-emerald-300">
                {data?.status ?? status ?? "active"}
              </Text>
            </View>
          </View>

          <View className="mb-4 flex-row items-center gap-2">
            <TokenPill asset={stakeAsset} />
            <ArrowRightIcon />
            <TokenPill asset={rewardAsset} loading={rewardQuery.isLoading} fallback={rewardAssetId ? `#${rewardAssetId}` : "Reward ASA"} />
            {dualStakeAsset && (
              <>
                <ArrowRightIcon />
                <TokenPill asset={dualStakeAsset} />
              </>
            )}
          </View>

          <View className="mb-4 gap-2">
            <Metric label="Pool app" value={`#${normalizedAppId}`} />
            {data?.totalStaked != null && <Metric label="Total staked" value={`${formatAssetAmount(data.totalStaked, stakeAsset.decimals)} ${stakeAsset.unitName}`} />}
            {data?.userStaked != null && <Metric label="Your stake" value={`${formatAssetAmount(data.userStaked, stakeAsset.decimals)} ${stakeAsset.unitName}`} />}
            {data?.endsAt && <Metric label="Ends" value={formatRelativeTime(data.endsAt)} />}
          </View>

          <Text className="mb-1 text-xs font-medium text-zinc-400">Amount</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor="#52525b"
            editable={!pending}
            className="mb-3 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-base font-semibold text-white"
          />

          {error && <Text className="mb-3 text-xs text-red-300">{error}</Text>}

          <View className="flex-row gap-2">
            <ActionButton label="Stake" loading={pending === "stake"} disabled={!canSubmit || !onStake || !!pending} onPress={() => submit("stake")} />
            <ActionButton label="Exchange" loading={pending === "exchange"} disabled={!canSubmit || !onExchange || !!pending} onPress={() => submit("exchange")} />
          </View>

          {normalizedWallet == null && (
            <Text className="mt-3 text-xs text-zinc-500">Connect an ARC58 wallet app to enable staking.</Text>
          )}
        </View>
      </View>
    </SizeContainer>
  );
}

export const DualStakePool = DualStakePoolComponent;

function TokenPill({ asset, loading, fallback }: { asset?: ASA; loading?: boolean; fallback?: string }) {
  return (
    <View className="min-w-0 flex-1 flex-row items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/70 p-2">
      <View className="h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-zinc-800">
        {loading ? (
          <ActivityIndicator size="small" color="#a1a1aa" />
        ) : asset?.imageUrl ? (
          <Image source={{ uri: asset.imageUrl }} style={{ width: 32, height: 32 }} contentFit="cover" />
        ) : (
          <Text className="text-[11px] font-bold text-zinc-400">{(asset?.unitName ?? fallback ?? "?").slice(0, 3)}</Text>
        )}
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-xs font-bold text-white" numberOfLines={1}>{asset?.unitName || fallback || "Asset"}</Text>
        <Text className="text-[11px] text-zinc-500" numberOfLines={1}>{asset?.name ?? "Loading asset"}</Text>
      </View>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between rounded-lg bg-zinc-900/70 px-3 py-2">
      <Text className="text-xs text-zinc-500">{label}</Text>
      <Text className="max-w-[180px] text-right text-xs font-semibold text-zinc-200" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function ActionButton({ label, loading, disabled, onPress }: { label: string; loading?: boolean; disabled?: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-1 flex-row items-center justify-center rounded-xl px-3 py-3 ${disabled ? "bg-zinc-800" : "bg-white"}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={disabled ? "#a1a1aa" : "#09090b"} />
      ) : (
        <Text className={`text-sm font-bold ${disabled ? "text-zinc-500" : "text-zinc-950"}`}>{label}</Text>
      )}
    </Pressable>
  );
}

function parseAlgoAmount(value: string): bigint {
  const trimmed = value.trim();
  if (!/^\d*(\.\d{0,6})?$/.test(trimmed) || trimmed === "" || trimmed === ".") return BigInt(0);
  const [whole = "0", fraction = ""] = trimmed.split(".");
  return BigInt(whole || "0") * BigInt(1_000_000) + BigInt(fraction.padEnd(6, "0").slice(0, 6) || "0");
}
