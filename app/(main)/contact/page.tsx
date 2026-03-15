import Navbar from '@/components/main/layout/Navbar';
import Footer from '@/components/main/layout/Footer';
import ContactUsComponent from '@/components/main/contactus/contactus';

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#0f0c29]">
      <Navbar />
      <main className="pt-24">
        <ContactUsComponent />
      </main>
      <Footer />
    </div>
  );
}