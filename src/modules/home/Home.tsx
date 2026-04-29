import { useState } from "react";
import { Outlet } from "react-router";
import PageHeader from "@/components/PageHeader";
import Sidebar from "@/components/Sidebar";
function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
 
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        <PageHeader onMenuToggle={() => setIsSidebarOpen(true)} />

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto"><Outlet /></main>
      </div>
    </div>
  );
}

export default Home;
