import Navbar from '@/components/studentportal/layout/navbar';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b0515] relative overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[100px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  );
}
