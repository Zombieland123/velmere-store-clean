"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  resolveVelmereAssetLogo,
  type VelmereAssetLogoInput,
} from "@/lib/market-integrity/asset-logo-resolver";

export default function AssetLogo({
  className = "",
  compact = false,
  ...input
}: VelmereAssetLogoInput & { className?: string; compact?: boolean }) {
  const resolution = useMemo(
    () => resolveVelmereAssetLogo(input),
    [input.assetClass, input.id, input.imageUrl, input.name, input.symbol, input.venue],
  );
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const src = resolution.imageCandidates[candidateIndex];

  useEffect(() => {
    setCandidateIndex(0);
    setLoaded(false);
  }, [resolution.symbol, resolution.imageCandidates.join("|")]);

  return (
    <span
      className={`velmere-asset-logo velmere-asset-logo-${resolution.tone} ${compact ? "velmere-asset-logo-compact" : ""} relative overflow-hidden ${className}`}
      role="img"
      aria-label={`${resolution.label} logo`}
      data-logo-source={src ? (candidateIndex === 0 ? "provider" : "fallback") : "badge"}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes={compact ? "24px" : "48px"}
          loading="lazy"
          unoptimized
          className={loaded ? "is-loaded" : ""}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false);
            setCandidateIndex((current) => current + 1);
          }}
        />
      ) : null}
      <span aria-hidden="true">{resolution.glyph}</span>
    </span>
  );
}
