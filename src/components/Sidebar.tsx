import { Link } from "react-router";
import { X } from "lucide-react";
import { useSignout } from "@/services/firebaseAuth";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const signout = useSignout;

  return (
    <aside
      className={`w-64 bg-white border-r flex flex-col fixed md:relative z-50 transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : " -translate-x-full md:translate-x-0"
      }`}
    >
      <div className="p-4 text-xl font-semibold border-b flex items-center justify-between">
        <span>Health SaaS</span>
        <button
          className="md:hidden p-1 hover:bg-gray-100 rounded"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link
          to={"/"}
          className="block px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
        >
          Dashboard
        </Link>
        <Link
          to={"/analytics"}
          className="block px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
        >
          Analytics
        </Link>
        <Link
          to={"/patients"}
          className="block px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
        >
          Patients
        </Link>
      </nav>

      <div className="p-4 border-t">
        <button
          className="w-full px-4 py-2 bg-red-500 text-white rounded-lg"
          onClick={signout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
