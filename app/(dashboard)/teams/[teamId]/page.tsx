// app/(dashboard)/teams/[teamId]/page.tsx
import { use } from 'react';
import TeamDetail from '@/components/teams/TeamDetail';
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function TeamDetailPage({ 
  params 
}: { 
  params: Promise<{ teamId: string }> 
}) {
  const { teamId } = await params;
  
  // Get authenticated user
  const supabase = await createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  // Redirect if not authenticated
  if (!user || error) {
    redirect('/');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <TeamDetail teamId={teamId} currentUserId={user.id} />
    </div>
  );
}