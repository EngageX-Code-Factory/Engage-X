import Navbar from '@/components/main/layout/Navbar';
import Hero from '@/components/main/home/Hero';
import Footer from '@/components/main/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}
