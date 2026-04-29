import { useLocation } from "react-router";
import { Menu } from "lucide-react";

interface PageHeaderProps {
  onMenuToggle: () => void;
}

function PageHeader({ onMenuToggle }: PageHeaderProps) {
  const location = useLocation();

  const getPageName = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    if (path === "/analytics") return "Analytics";
    if (path === "/patients") return "Patients";
    if (path.startsWith("/patients/")) return "Patient Details";
    return "Dashboard";
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 hover:bg-gray-100 rounded"
          onClick={onMenuToggle}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-semibold">{getPageName()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Hello, User</span>
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
      </div>
    </header>
  );
}

export default PageHeader;
