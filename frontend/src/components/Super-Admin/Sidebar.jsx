import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  LogOut,
  GitPullRequest,
  RouteOff,
  Building2,
  BookAIcon,
  ChevronDown,
  ChevronRight,
  Users2,
  GiftIcon,
  DiamondPlusIcon,
  CompassIcon,
  Settings,
} from "lucide-react";
import { FaFileExport } from "react-icons/fa";

export default function Sidebar({ view, setView, closeSidebar }) {
  const [settings, setSettings] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    { key: "booking", label: "Bookings", icon: <GitPullRequest size={18} /> },
    { key: "rooms", label: "Rooms", icon: <RouteOff size={18} /> },
    { key: "revenue", label: "Revenue", icon: <BarChart3 size={18} /> },
    { key: "hotel", label: "Hotel", icon: <Building2 size={18} /> },
    { key: "admins", label: "Manage Admins", icon: <Users2 size={18} /> },
    { key: "offers", label: "Current Offers ", icon: <GiftIcon size={18} /> },
    { key: "destination", label: "All Destinations ", icon: <DiamondPlusIcon size={18} /> },
    { key: "explore", label: "Explore Page ", icon: <CompassIcon size={18} /> },
    { key: "settings", label: "Settings", icon: <Settings size={18} /> },


    {
      key: "pages",
      label: "Pages",
      icon: <BookAIcon size={18} />,
      children: [
        { key: "about", label: "About Page" },
        { key: "accessbility", label: "Accessibility" },
        { key: "affilitis", label: "Affiliates" },
        { key: "careers", label: "Careers" },
        { key: "clubedzz", label: "ClubBedzzz Admin" },
        { key: "contact", label: "Contact Page" },
        { key: "cookie", label: "Cookie Policy" },
        { key: "corporate", label: "Corporate Booking" },
        { key: "develop", label: "Locations Page" },
        { key: "digital", label: "Digital Key" },
        { key: "esayhotel", label: "Easy Hotel App" },
        { key: "europe", label: "Europe Travel Guide" },
        { key: "faq", label: "FAQ Page" },
        { key: "groupdeals", label: "Group Deals" },
        { key: "history", label: "History Lessons" },
        { key: "london", label: "London Guides" },
        { key: "pledge", label: "Sustainability / Pledge" },
        { key: "press", label: "Press Page" },
        { key: "privacy", label: "Privacy Policy" },
        { key: "sitemap", label: "Sitemap" },
        { key: "statement", label: "Modern Slavery Statement" },
        { key: "discount", label: "Student Discounts" },
        { key: "supplier", label: "Supplier Code of Conduct" },
        { key: "terms", label: "Terms & Conditions" },
        { key: "uk", label: "UK Guide" },
        { key: "whistle", label: "Whistleblowing Policy" },


      ],
    },
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
          <div key={item.key}>
            <button
              onClick={() => {
                if (item.children) {
                  setOpenDropdown(openDropdown === item.key ? null : item.key);
                } else {
                  setView(item.key);
                  closeSidebar?.();
                }
              }}
              className={`flex items-center justify-between px-4 py-2.5 rounded-lg w-full text-left font-medium transition-all
                ${view === item.key
                  ? "bg-blue-600 text-white shadow-md"
                  : "hover:bg-gray-700/60 hover:text-white"
                }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-1.5 rounded-md transition-colors ${view === item.key ? "bg-white/20" : "bg-gray-700/40"
                    }`}
                >
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </div>

              {item.children && (
                <span className="ml-2">
                  {openDropdown === item.key ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </span>
              )}
            </button>

            {item.children && openDropdown === item.key && (
              <div className="ml-10 mt-1 space-y-1">
                {item.children.map((sub) => (
                  <button
                    key={sub.key}
                    onClick={() => {
                      setView(sub.key);
                      closeSidebar?.();
                    }}
                    className={`block w-full text-left text-sm px-3 py-1.5 rounded-md transition
                      ${view === sub.key
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-700/40"
                      }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>
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
