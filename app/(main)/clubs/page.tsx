import Navbar from '@/components/main/layout/Navbar';
import Footer from '@/components/main/layout/Footer';
import ClubsComponent from '@/components/main/clubs/Clubs';

export default function ClubsPage() {
  return (
    <div className="min-h-screen bg-[#0f0c29]">
      <Navbar />
      <main className="pt-24">
        <ClubsComponent />
      </main>
      <Footer />
    </div>
  );
}