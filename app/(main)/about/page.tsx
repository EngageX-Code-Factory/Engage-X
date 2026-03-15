import Navbar from '@/components/main/layout/Navbar';
import Footer from '@/components/main/layout/Footer';
import AboutUsComponent from '@/components/main/aboutus/aboutus';

export default function About() {
  return (
    <div className="min-h-screen bg-[#0f0c29]">
      <Navbar />
      <main className="pt-24">
        <AboutUsComponent />
      </main>
      <Footer />
    </div>
  );
}