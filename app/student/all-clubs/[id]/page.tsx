import ClubDetails from '@/components/studentportal/allclubs/clubdetails';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default function ClubDetailsPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white/50">Loading Club Details...</div>}>
      <ClubDetailsWrapper params={params} />
    </Suspense>
  );
}

async function ClubDetailsWrapper({ params }: Props) {
  const { id } = await params;
  return <ClubDetails clubId={parseInt(id)} />;
}
