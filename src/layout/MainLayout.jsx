import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#eef2f1] text-gray-800">
      <Navbar />
      <main className="w-full">
        <div className="max-w-[1400px] mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}