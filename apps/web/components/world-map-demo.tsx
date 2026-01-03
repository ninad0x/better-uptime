"use client";
import WorldMap from "@/components/world-map";
import { HeroText } from "./herotext";

export function WorldMapDemo() {
  return (
    <div className="max-w-7xl mx-auto dark:bg-black bg-white w-full relative">

    <HeroText />

    <div className="opacity-70 mask-b-from-50% mask-b-to-65%">
      <WorldMap
              dots={[
              // {
              //     start: { lat: 64.2008, lng: -149.4937, }, // Alaska (Fairbanks)
              //     end: { lat: 34.0522, lng: -118.2437, }, // Los Angeles
              // },
              {
                  start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
                  end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
              },
              {
                  start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
                  end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
              },
              // {
              //     start: { lat: 51.5074, lng: -0.1278 }, // London
              //     end: { lat: 28.6139, lng: 77.209 }, // New Delhi
              // },
              {
                  start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                  end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
              },
              {
                  start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                  end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
              },
              ]}

              lineColor="#0ea5e9"
          />
      </div>
  </div>
  );
}
