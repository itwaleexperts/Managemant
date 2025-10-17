import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Bookings from "./AllBookings";
import Rooms from "./AllRooms";
import Revenue from "./AllRevenues";
import Hotels from "./AllHotels";
import AdminAbout from "./Pages/AboutUs";
import AdminAccessibility from "./Pages/Accessbility";
import AffiliateAdmin from "./Pages/Affilitis";
import CareersPage from "./Pages/Careers";
import ClubBedzzzAdmin from "./Pages/Clubedzz";
import AdminContact from "./Pages/Contact";
import AdminCookiePolicy from "./Pages/Cookie";
import WhistleblowingAdmin from "./Pages/WhistleBlowing";
import GuideAdmin from "./Pages/UK";
import TermsAdmin from "./Pages/Terms";
import SupplierAdmin from "./Pages/Supplier";
import AdminStudentDiscount from "./Pages/StudentDiscount";
import AdminModernSlavery from "./Pages/Statement";
import AdminSitemap from "./Pages/Sitemap";
import AdminPrivacyPolicy from "./Pages/Privacy";
import AdminPress from "./Pages/Press";
import AdminSustainability from "./Pages/Pledge";
import AdminLondonGuides from "./Pages/London";
import AdminHistoryLessons from "./Pages/History";
import AdminGroupDeals from "./Pages/GroupDeals";
import AdminFaq from "./Pages/Faq";
import AdminEuropeTravelGuide from "./Pages/Europe";
import AdminEasyHotelApp from "./Pages/EsayHotel";
import AdminDigitalKey from "./Pages/Digital";
import AdminLocationsPage from "./Pages/Development";
import AdminCorporateBooking from "./Pages/Corporate";
import ManageAdmins from "./ManageAdmins";
import CurrentOffers from "../../pages/Deals";
import OfferAdmin from "./Offers";
import AdminDestinations from "./DestinationPage";
import AdminExplore from "./ExplorePage";
import SettingsPage from "./Settings";

export default function SuperPanel() {
  const [view, setView] = useState("booking");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pages = {
    booking: <Bookings />,
    rooms: <Rooms />,
    revenue: <Revenue />,
    hotel: <Hotels />,
    admins: <ManageAdmins />,
offers: <OfferAdmin />,
destination: <AdminDestinations />,
explore: <AdminExplore />,
settings : <SettingsPage />,


    about: <AdminAbout />,
    accessbility: <AdminAccessibility />,
    affilitis: <AffiliateAdmin />,
    careers: <CareersPage />,
    clubedzz: <ClubBedzzzAdmin />,
    contact: <AdminContact />,
    cookie: <AdminCookiePolicy />,
    corporate: <AdminCorporateBooking />,
    develop: <AdminLocationsPage />,
    digital: <AdminDigitalKey />,
    esayhotel: <AdminEasyHotelApp />,
    europe: <AdminEuropeTravelGuide />,
    faq: <AdminFaq />,
    groupdeals: <AdminGroupDeals />,
    history: <AdminHistoryLessons />,
    london: <AdminLondonGuides />,
    pledge: <AdminSustainability />,
    press: <AdminPress />,
    privacy: <AdminPrivacyPolicy />,
    sitemap: <AdminSitemap />,
    statement: <AdminModernSlavery />,
    discount: <AdminStudentDiscount />,
    supplier: <SupplierAdmin />,
    terms: <TermsAdmin />,
    uk: <GuideAdmin />,
    whistle: <WhistleblowingAdmin />,

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
