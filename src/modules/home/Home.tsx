import { Link } from "react-router";
import { useSignout } from "@/services/firebaseAuth";
function Home({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-4 text-xl font-semibold border-b">Health SaaS</div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to={"/"}
            className="block px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            Dashboard
          </Link>
          <Link
            to={"/analytics"}
            className="block px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            Analytics
          </Link>
          <Link
            to={"/patients"}
            className="block px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            Patients
          </Link>
        </nav>

        <div className="p-4 border-t">
          <button
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg"
            onClick={useSignout}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold">Dashboard</h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Hello, User</span>
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default Home;
