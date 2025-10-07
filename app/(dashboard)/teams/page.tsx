// app/(dashboard)/teams/page.tsx
import TeamsList from '@/components/teams/TeamsList';

export default function TeamsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <TeamsList />
    </div>
  );
}