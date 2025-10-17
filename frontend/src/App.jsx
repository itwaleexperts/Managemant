import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CurrentOffers from "./pages/Deals";
import ExplorePage from "./pages/ExplorePage";
import CareersPage from "./pages/CareersPage";
import AboutUs from "./pages/About";
import Sustainability from "./pages/Pledge";
import PressPage from "./pages/Press";
import HistoryMainContent from "./pages/HistoryMainContent";
import ModernSlaveryStatementUI from "./pages/StatementUI";
import WhistleblowingPolicyUI from "./pages/WhistleblowingPolicyUI";
import AffiliatesUI from "./pages/AffiliatesUI";
import SupplierCodeOfConductUI from "./pages/ConductUI";
import LocationsUI from "./pages/LocationsUI";
import UKTravelGuideUI from "./pages/UKTravelGuideUI";
import LondonTravelGuideUI from "./pages/LondonTrevalUI";
import EuropeTravelGuideUI from "./pages/Europ";
import AccessibilityStatementUI from "./pages/AccessibilityStatementUI";
import ClubBedzzzUI from "./pages/ClubBedzzzUI";
import StudentDiscountUI from "./pages/StudentDiscount";
import CorporateBookings from "./pages/Corporate";
import EasyHotelApp from "./pages/easyHotel";
import DigitalKey from "./pages/DigitalKey";
import Faq from "./pages/Faq";
import ContactUs from "./pages/Contact";
import GroupDeals from "./pages/GroupDeals";
import Login from "./components/Login";
import CookiePolicy from "./pages/CookiePolicy.";
import PrivacyPolicy from "./pages/PrivacyPolicy ";
import SiteMap from "./pages/SiteMap";
import TermsAndCondition from "./pages/Terms";
import BookingPage from "./components/Booking";
import HotelDetails from "./components/HotelDetails";
import Hotels from "./pages/Hotels";
import RoomDetails from "./components/RoomCard";
import AdminPanel from "./components/Admin/AdminPanel"

import SuperPanel from "./components/Super-Admin/SuperPanel";
import SignUP from "./components/SignUp";
import AdminLogin from "./components/Admin/AdminLogin";
import AccountDashboard from "./components/UserProfile";
import BookingConfirmationPage from "./components/ConformationPage";
import HotelsPage from "./pages/HotelsPage";
import ViewBooking from "./components/Admin/ViewBooking";
import ViewBookingDetails from "./components/viewBookingDetails";
import SearchResults from "./components/SearchResults";
import ScrollToTop from "./components/ScrollToTop";
import SuperAdminLogin from "./components/Super-Admin/SuperAdminLogin";


function App() {
  return (
    <Router>
        <ScrollToTop />
   
      <Routes>
        <Route path="/admin/dashboard" element={<AdminPanel />} />
        <Route path="/admin" element={<AdminLogin />} />

        <Route path="/super-admin" element={<SuperAdminLogin />} />
        <Route path="/super-admin/dashboard" element={<SuperPanel />} />

        <Route path="/" element={<Home />} />
        <Route path="/deals" element={<CurrentOffers />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/pledge" element={<Sustainability />} />
        <Route path="/press" element={<PressPage />} />
        <Route path="/easy" element={<HistoryMainContent />} />
        <Route path="/modern" element={<ModernSlaveryStatementUI />} />
        <Route path="/whistle" element={<WhistleblowingPolicyUI />} />
        <Route path="/affiliates" element={<AffiliatesUI />} />
        <Route path="/supplier" element={<SupplierCodeOfConductUI />} />
        <Route path="/develop" element={<LocationsUI />} />
        <Route path="/uk" element={<UKTravelGuideUI />} />
        <Route path="/europe" element={<EuropeTravelGuideUI />} />

        <Route path="/london" element={<LondonTravelGuideUI />} />
        <Route path="/access" element={<AccessibilityStatementUI />} />
        <Route path="/club" element={<ClubBedzzzUI />} />
        <Route path="/dis" element={<StudentDiscountUI />} />
        <Route path="/corporate" element={<CorporateBookings />} />
        <Route path="/easyhotel" element={<EasyHotelApp />} />
        <Route path="/key" element={<DigitalKey />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/group" element={<GroupDeals />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUP />} />
        <Route path="/cookie" element={<CookiePolicy />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/sitemap" element={<SiteMap />} />
        <Route path="/terms" element={<TermsAndCondition />} />
        <Route path="/booking/:hotelId/:roomId" element={<BookingPage />} />
        <Route path="/hoteldetails" element={<HotelDetails />} />
        <Route path="/hotels" element={<Hotels />} />
<Route path="/roomdetails/:hotelId" element={<RoomDetails />} />
<Route path="/account" element={<AccountDashboard />} />
<Route path="/booking/confirm/:bookingId" element={<BookingConfirmationPage />} />
<Route path="/hotels/:cityName" element={<HotelsPage />} />
<Route path="/viewbooking/:id" element={<ViewBooking />} />
<Route path="/viewbookingdetails/:id" element={<ViewBookingDetails />} />
        <Route path="/roomdetails/search" element={<SearchResults />} /> 



         



      </Routes>
   
    </Router>
  );
}

export default App;
