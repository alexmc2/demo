// components/blocks/location/LocationMap.tsx
"use client";

import { useMemo } from "react";
import { stegaClean } from "next-sanity";

import SectionContainer from "@/components/ui/section-container";
import type { ColorVariant, SectionPadding } from "@/sanity.types";

const GOOGLE_MAPS_EMBED_BASE = "https://maps.google.com/maps";

export type LocationMapBlock = {
  _type: "location-map";
  _key: string;
  padding?: SectionPadding | null;
  colorVariant?: ColorVariant | null;
  locationLabel?: string | null;
  locationName?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  mapZoom?: number | null;
};

type LocationMapProps = LocationMapBlock;

const cleanString = (value?: string | null) =>
  value ? stegaClean(value) : undefined;

export default function LocationMap({
  padding,
  colorVariant,
  locationLabel,
  locationName,
  address,
  latitude,
  longitude,
  mapZoom,
}: LocationMapProps) {
  const cleanedColor = colorVariant ? stegaClean(colorVariant) : undefined;
  const cleanedLabel = cleanString(locationLabel) ?? "Our location";
  const locationNameQuery = cleanString(locationName);
  const cleanedLocationName = locationNameQuery ?? "Location";
  const cleanedAddress = cleanString(address);

  const mapSrc = useMemo(() => {
    const queryTarget = (() => {
      if (typeof latitude === "number" && typeof longitude === "number") {
        return `${latitude},${longitude}`;
      }

      if (cleanedAddress) {
        return cleanedAddress;
      }

      if (locationNameQuery) {
        return locationNameQuery;
      }

      return null;
    })();

    if (!queryTarget) {
      return null;
    }

    const params = new URLSearchParams({ q: queryTarget, output: "embed" });

    if (typeof mapZoom === "number" && Number.isFinite(mapZoom)) {
      params.set("z", String(mapZoom));
    }

    return `${GOOGLE_MAPS_EMBED_BASE}?${params.toString()}`;
  }, [latitude, longitude, mapZoom, cleanedAddress, locationNameQuery]);

  const hasMap = Boolean(mapSrc);

  return (
    <SectionContainer color={cleanedColor} padding={padding}>
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg border bg-background shadow-sm">
          {hasMap ? (
            <iframe
              title={cleanedLocationName || "Map"}
              src={mapSrc ?? undefined}
              width="100%"
              height="320"
              loading="lazy"
              allowFullScreen
              className="h-[320px] w-full rounded-t-lg"
            />
          ) : (
            <div className="flex h-[320px] w-full items-center justify-center rounded-t-lg bg-muted text-center text-sm text-muted-foreground">
              Add location coordinates or an address to display an embedded map.
            </div>
          )}
          <div className="space-y-3 p-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {cleanedLabel}
            </div>
            <div className="text-lg font-semibold text-foreground">{cleanedLocationName}</div>
            {cleanedAddress && (
              <p className="text-base whitespace-pre-line text-muted-foreground/90">
                {cleanedAddress}
              </p>
            )}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
