import EditEvent from '@/components/organizations/EditEvent';

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditEvent id={id} />;
}