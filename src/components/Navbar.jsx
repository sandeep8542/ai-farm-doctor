import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const navLinkClass = (path) =>
    `transition px-3 py-1.5 rounded-lg ${
      location.pathname === path
        ? "bg-white/10 text-white"
        : "hover:text-green-200"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#245a45] text-white shadow-md">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <FaLeaf className="text-green-300 text-lg" />
          </div>

          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight leading-tight">
              AI Farm Doctor
            </h1>
            <p className="text-xs text-green-100/90 leading-tight">
              Your Smart Farming Assistant
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-3 md:gap-4 text-sm font-medium flex-wrap justify-end">
          <Link to="/dashboard" className={navLinkClass("/dashboard")}>
            Dashboard
          </Link>
          <Link to="/crop" className={navLinkClass("/crop")}>
            Crop Advice
          </Link>
          <Link to="/weather" className={navLinkClass("/weather")}>
            Weather & Soil
          </Link>
          <Link to="/voice" className={navLinkClass("/voice")}>
            Voice Query
          </Link>
          <Link to="/history" className={navLinkClass("/history")}>
            History
          </Link>

          <Link to="/profile" className={navLinkClass("/profile")}>
  Profile
</Link> 
          <button
            onClick={handleLogout}
            className="transition px-3 py-1.5 rounded-lg hover:text-red-200"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}