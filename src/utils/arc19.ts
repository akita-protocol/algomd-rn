/**
 * ARC-19 template-ipfs:// URL resolution.
 *
 * Resolves ARC-19 template URLs to standard IPFS URLs by computing the CID
 * from the asset's reserve address.
 *
 * @see https://arc.algorand.foundation/ARCs/arc-0019
 */

import algosdk from 'algosdk'

// RFC 4648 base32 lowercase alphabet (no padding)
const BASE32 = 'abcdefghijklmnopqrstuvwxyz234567'

function base32Encode(bytes: Uint8Array): string {
  let result = ''
  let buffer = 0
  let bitsLeft = 0
  for (const byte of bytes) {
    buffer = (buffer << 8) | byte
    bitsLeft += 8
    while (bitsLeft >= 5) {
      bitsLeft -= 5
      result += BASE32[(buffer >> bitsLeft) & 0x1f]
    }
  }
  if (bitsLeft > 0) {
    result += BASE32[(buffer << (5 - bitsLeft)) & 0x1f]
  }
  return result
}

const MULTICODEC: Record<string, number> = {
  raw: 0x55,
  'dag-pb': 0x70,
}

const MULTIHASH: Record<string, number> = {
  'sha2-256': 0x12,
}

/**
 * Resolves an ARC-19 `template-ipfs://` URL to a standard `ipfs://` URL
 * by deriving the CID from the asset's reserve address.
 *
 * Supports CIDv1 (base32lower with 'b' prefix). CIDv0 is not supported.
 *
 * @example
 * resolveArc19Url('template-ipfs://{ipfscid:1:raw:reserve:sha2-256}', 'Y76M...')
 * // => 'ipfs://bafkrei...'
 */
export function resolveArc19Url(
  templateUrl: string,
  reserveAddress: string,
): string | undefined {
  const match = templateUrl.match(
    /^template-ipfs:\/\/\{ipfscid:(\d+):([^:]+):([^:]+):([^}]+)\}(.*)/,
  )
  if (!match) return undefined

  const [, versionStr, codec, field, hash, pathSuffix] = match

  // Only 'reserve' field is currently supported
  if (field !== 'reserve' || !reserveAddress) return undefined

  const version = parseInt(versionStr)
  const codecByte = MULTICODEC[codec]
  const hashByte = MULTIHASH[hash]
  if (codecByte === undefined || hashByte === undefined) return undefined

  // Decode the reserve address to get the 32-byte public key (our content hash)
  const decoded = algosdk.decodeAddress(reserveAddress)
  const publicKey = decoded.publicKey

  if (version === 1) {
    // CIDv1: version(1) + codec + multihash(hashFn + hashLen + hash)
    const cidBytes = new Uint8Array(4 + publicKey.length)
    cidBytes[0] = 0x01
    cidBytes[1] = codecByte
    cidBytes[2] = hashByte
    cidBytes[3] = 0x20 // 32 bytes
    cidBytes.set(publicKey, 4)
    return `ipfs://b${base32Encode(cidBytes)}${pathSuffix || ''}`
  }

  // CIDv0 (base58btc / "Qm...") not supported
  return undefined
}

/**
 * Resolves an asset URL to a direct IPFS or HTTP URL.
 * Handles ARC-19 template URLs, plain IPFS URLs, and HTTP(S) URLs.
 * Returns undefined for JSON metadata files and unresolvable URLs.
 */
export function resolveAssetUrl(
  url: string | undefined,
  reserveAddress: string | undefined,
): string | undefined {
  if (!url) return undefined

  // Skip JSON metadata files (ARC-3 metadata, not images)
  if (url.endsWith('.json')) return undefined

  // ARC-19 template resolution
  if (url.startsWith('template-ipfs://')) {
    return reserveAddress ? resolveArc19Url(url, reserveAddress) : undefined
  }

  // Direct IPFS, HTTP(S), or file:// URLs pass through
  if (
    url.startsWith('ipfs://') ||
    url.startsWith('https://') ||
    url.startsWith('http://') ||
    url.startsWith('file://')
  ) {
    return url
  }

  return undefined
}
