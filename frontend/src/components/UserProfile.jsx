import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const API = axios.create({ baseURL: "https://apiyatraadda.jaspersoftwaresolutions.com/api/user" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const CalendarIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const CardIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M3 10h18M7 15h1m4 0h1M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"
    />
  </svg>
);

const BookingCard = ({ booking }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const checkOutDate = new Date(booking.checkOutDate);
  const now = new Date();
  const status = (booking.status || (checkOutDate <= now ? 'Completed' : 'Confirmed')).toLowerCase();

  let statusColor = 'bg-blue-100 text-blue-800';
  if (status === 'cancelled') {
    statusColor = 'bg-red-100 text-red-800';
  } else if (status === 'completed') {
    statusColor = 'bg-green-100 text-green-800';
  }

  const hotelName = booking.hotelId?.name || booking.hotelId?.title || 'Hotel Not Found';
  const roomType = booking.roomId?.type || booking.roomId?.roomType || 'Room Details Missing';
  const totalPrice = booking.totalPrice || 0;

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm mb-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{hotelName}</h3>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p><strong>Room:</strong> {roomType}</p>
        <p>
          <strong>Check-in:</strong> {formatDate(booking.checkInDate)}
        </p>
        <p>
          <strong>Check-out:</strong> {formatDate(booking.checkOutDate)}
        </p>
        <p><strong>Total Price:</strong> ₹{totalPrice.toFixed(2)}</p>
      </div>
      <div className="mt-3 text-right">
        <button className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          onClick={() => navigate(`/viewbookingdetails/${booking.bookingId}`)}

        >
          View Details
        </button>
      </div>
    </div>
  );
};

const FormInputField = ({
  label,
  name,
  value,
  onChange,
  required,
  type = "text",
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      required={required}
      className="block w-full lg:max-w-lg border border-gray-300 rounded-sm shadow-sm p-3 text-base focus:ring-0 focus:border-orange-500 transition-colors"
    />
  </div>
);

export default function AccountDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("My account");
  const [activeDetailsTab, setActiveDetailsTab] = useState("details");
  const [activeBookingTab, setActiveBookingTab] = useState("upcoming");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    receiveEmails: false,
  });

  const filteredBookings = useMemo(() => {
    if (!userData?.bookings?.length) return [];

    const now = new Date();

    return userData.bookings
      .map(booking => ({
        ...booking,
        checkInDate: new Date(booking.checkInDate),
        checkOutDate: new Date(booking.checkOutDate),
        status: booking.status?.toLowerCase() || "pending"
      }))
      .filter(booking => {
        if (isNaN(booking.checkInDate) || isNaN(booking.checkOutDate)) return false;

        switch (activeBookingTab) {
          case "upcoming":
            return booking.status !== "cancelled" && booking.checkOutDate > now;
          case "completed":
            return booking.status !== "cancelled" && booking.checkOutDate <= now;
          case "cancelled":
            return booking.status === "cancelled";
          default:
            return false;
        }
      });
  }, [userData, activeBookingTab]);


  useEffect(() => {
    const fetchUserData = async () => {
      if (!localStorage.getItem("userToken")) {
        navigate("/login");
        return;
      }

      try {
        const res = await API.get("/single");
        const user = res.data;

        let firstName = "";
        let lastName = "";
        if (user.name) {
          const nameParts = user.name.trim().split(/\s+/);
          firstName = nameParts[0] || "";
          lastName = nameParts.slice(1).join(' ') || "";
        }

        setUserData(user);

        setFormData({
          firstName: firstName,
          lastName: lastName,
          phone: user.phone || "",
          email: user.email || "",
          receiveEmails: user.receiveEmails || false,
        });

      } catch (err) {
        console.error("Error fetching user:", err);
        if (err.response && err.response.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatePayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        receiveEmails: formData.receiveEmails,
      };


      const res = await API.put("/update", updatePayload);
      alert(" Profile updated successfully!");

      setUserData(res.data);

    } catch (err) {
      console.error("Update failed:", err);
      alert(" Failed to update profile. Try again.");
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("userToken");
      navigate("/login");
    }
  };

  const Sidebar = () => {
    const items = [
      { name: "My account", icon: "👤" },
      { name: "Manage booking", icon: "💼" },
      { name: "Payment options", icon: "💳" },
      { name: "Log out", icon: "🚪" },
    ];

    return (
      <div className="w-full lg:w-64 border-b lg:border-r border-gray-200 bg-gray-50 lg:bg-white overflow-x-auto whitespace-nowrap">
        <ul className="flex flex-row lg:flex-col p-2 lg:pt-6 lg:p-0">
          {items.map((item) => {
            const isActive = item.name === activePage;
            return (
              <li
                key={item.name}
                onClick={() =>
                  item.name === "Log out"
                    ? handleLogout()
                    : setActivePage(item.name)
                }
                className={`py-2 px-4 lg:py-3 lg:pl-6 text-sm cursor-pointer inline-block lg:block flex-shrink-0
flex items-center gap-2 lg:gap-3 transition-colors
 ${isActive
                    ? "text-orange-600 border-b-2 lg:border-r-4 lg:border-b-0 border-orange-600 font-semibold bg-orange-50"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto min-h-screen flex items-center justify-center">
          <p className="text-xl text-gray-500">Loading your dashboard...</p>
        </div>
        <Footer />
      </>
    );
  }

  const PageContent = () => {
    if (activePage === "My account" && !userData) {
      return (
        <div className="flex-1 pt-6 p-4 lg:px-10 text-gray-500">
          Error: Could not load user data.
        </div>
      );
    }

    switch (activePage) {
      case "My account":
        return (
          <div className="flex-1 pt-6 p-4 lg:px-10">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">
              My Account
            </h1>

            <div className="border-b border-gray-200 mb-8 overflow-x-auto whitespace-nowrap">
              {["details", "password"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveDetailsTab(tab)}
                  className={`pb-3 mr-4 lg:mr-8 text-base inline-block ${activeDetailsTab === tab
                    ? "text-orange-600 border-b-2 border-orange-600 font-semibold"
                    : "text-gray-600 hover:text-gray-800"
                    }`}
                >
                  {tab === "details" ? "Personal Details" : "Password"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative pb-20">
              {activeDetailsTab === "details" && (
                <>
                  <FormInputField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <FormInputField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                  <FormInputField
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <FormInputField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  <div className="flex items-start pt-4">
                    <input
                      id="receiveEmails"
                      name="receiveEmails"
                      type="checkbox"
                      checked={formData.receiveEmails}
                      onChange={handleChange}
                      className="h-4 w-4 text-orange-600 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="receiveEmails"
                      className="ml-3 text-sm text-gray-600"
                    >
                      I agree to receive marketing emails from our company.
                    </label>
                  </div>
                </>
              )}
              {activeDetailsTab === "password" && (
                <p className="text-gray-500">Password change form goes here...</p>
              )}


              <div className="absolute bottom-0 right-0 left-0 p-4 border-t bg-white text-right">
                <button
                  type="submit"
                  className="bg-orange-600 text-white px-6 py-2 rounded-sm font-semibold uppercase text-sm hover:bg-orange-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        );

      case "Manage booking":
        return (
          <div className="flex-1 pt-6 p-4 lg:px-10">
            <h1 className="text-3xl text-gray-800 mb-6">Manage Booking</h1>
            <div className="border-b border-gray-200 mb-12 overflow-x-auto whitespace-nowrap">
              {["Upcoming", "Completed", "Cancelled"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveBookingTab(tab.toLowerCase())}
                  className={`pb-3 mr-4 lg:mr-8 text-base inline-block ${activeBookingTab === tab.toLowerCase()
                    ? "text-orange-600 border-b-2 border-orange-600 font-semibold"
                    : "text-gray-600 hover:text-gray-800"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="min-h-[300px]">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => (
                  <BookingCard key={booking._id || index} booking={booking} />
                ))
              ) : (
                <div className="text-center mt-20">
                  <CalendarIcon className="mx-auto h-20 w-20 text-gray-400" />
                  <p className="text-lg text-gray-600 pt-10">
                    You have no {activeBookingTab} bookings.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case "Payment options":
        return (
          <div className="flex-1 pt-6 p-4 lg:px-10 text-center mt-20">
            <CardIcon className="mx-auto h-20 w-20 text-gray-400" />
            <p className="text-lg text-gray-800 pt-4 font-semibold">
              No saved cards found.
            </p>
          </div>
        );

      default:
        return (
          <div className="flex-1 pt-6 p-4 lg:px-10">
            <h2 className="text-lg text-gray-700">Page not found.</h2>
          </div>
        );
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-screen bg-white shadow-md border-t-8 border-orange-600">
        <Sidebar />
        <PageContent />
      </div>
      <Footer />
    </>
  );
}