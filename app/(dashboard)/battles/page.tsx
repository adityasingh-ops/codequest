// app/(dashboard)/battles/page.tsx
import BattlesList from "@/components/battles/BattleList";

export default function BattlesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BattlesList />
    </div>
  );
}