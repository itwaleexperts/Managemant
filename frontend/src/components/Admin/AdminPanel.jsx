import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Bookings from "./Booking";
import Rooms from "./Rooms";
import Revenue from "./Reports";
import Hotels from "./HotelPage";

export default function AdminPanel() {
  const [view, setView] = useState("booking");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pages = {
    booking: <Bookings />,
    rooms: <Rooms />,
    revenue: <Revenue />,
    hotel: <Hotels />,
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-gradient-to-b from-gray-900 to-gray-800 shadow-lg transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
      >
        <Sidebar
          view={view}
          setView={setView}
          closeSidebar={() => setSidebarOpen(false)}
        />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-col flex-1 md:pl-64">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {pages[view] || <div className="text-center">Select a section</div>}
          </div>
        </main>
      </div>
    </div>
  );
}
