import { FeatureGrid } from "@/components/featuregrid";
import { WorldMapDemo } from "@/components/worldmapdemo";

export default function Home() {
  return (
    <div className="flex flex-col items-center h-screen mx-auto">
      <WorldMapDemo />
      <FeatureGrid />
    </div>
  );
}
