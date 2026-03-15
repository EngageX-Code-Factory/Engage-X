import ClubDetails from '@/components/studentportal/allclubs/clubdetails';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ClubDetailsPage({ params }: Props) {
  const { id } = await params;
  return <ClubDetails clubId={parseInt(id)} />;
}
