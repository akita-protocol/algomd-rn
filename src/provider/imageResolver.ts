/**
 * Default image URL resolver using Akita CDN proxy.
 * Transforms IPFS and HTTP(S) URLs into optimized CDN URLs.
 */
export function defaultResolveImageUrl(src: string, width: number, quality = 75): string {
  if (!src.startsWith('ipfs://') && !src.startsWith('https://') && !src.startsWith('http://'))
    return src
  const format = src.includes('.gif') ? 'gif' : 'jpeg'
  const params = [`${width}x`, `q${quality}`, format]
  const resolved = src.replace('ipfs://', 'https://ipfs.akita.community/ipfs/')
  return `https://imageproxy.akita.community/${params.join(',')}/${resolved}`
}
