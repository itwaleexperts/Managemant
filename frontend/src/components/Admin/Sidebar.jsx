import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,

  BarChart3,
  LogOut,

  GitPullRequest,
  BookAlert,
  RouteOff,
  RoseIcon,
  Satellite,
  Building2,
} from "lucide-react";
import { FaHandPointUp } from "react-icons/fa";

export default function Sidebar({ view, setView, closeSidebar }) {
  const [settings, setSettings] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    { key: "booking", label: "Bookings", icon: <GitPullRequest size={18} /> },
    { key: "rooms", label: "Rooms", icon: <RouteOff size={18} /> },
    { key: "revenue", label: "Revenue", icon: <BarChart3 size={18} /> },
    { key: "hotel", label: "Hotel", icon: <Building2 size={18} /> },




  ];



  const handleLogout = async () => {
    try {
      await fetch("https://apiyatraadda.jaspersoftwaresolutions.com/api/admin/logout", {
        method: "GET",
        credentials: "include",
      });
      localStorage.removeItem("adminToken");
      navigate("/admin");
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to logout. Try again.");
    }
  };

  return (
    <aside className="sticky top-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200 flex flex-col">


      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setView(item.key);
              closeSidebar?.();
            }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg w-full text-left font-medium transition-all
              ${view === item.key
                ? "bg-blue-600 text-white shadow-md"
                : "hover:bg-gray-700/60 hover:text-white"
              }`}
          >
            <div
              className={`p-1.5 rounded-md transition-colors ${view === item.key ? "bg-white/20" : "bg-gray-700/40"
                }`}
            >
              {item.icon}
            </div>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm font-medium"
        >
          <LogOut size={16} />
          Logout
        </button>

      </div>
    </aside>
  );
}
