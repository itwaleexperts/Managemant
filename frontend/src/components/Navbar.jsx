import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import axios from "axios";
import Login from "./Login";
import SignUp from "./SignUp";
import DestinationsMenu from "../pages/DestinationsMenu";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [destinationsOpen, setDestinationsOpen] = useState(false); 
  const [user, setUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [desktopDestinationsOpen, setDesktopDestinationsOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  const destinationsRef = useRef(null);
  const navigate = useNavigate();

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1]; 
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error('Error decoding JWT:', err);
      return null;
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("userToken");

    if (savedUser) {
      const decodedUser = decodeJWT(savedUser);
      if (decodedUser) {
        setUser({
          id: decodedUser.id,
          name: decodedUser.name,
          email: decodedUser.email,
          avatar: decodedUser.avatar || "/us.jpeg",
        });
      } else {
        console.error("Invalid token, clearing localStorage");
        localStorage.removeItem("userToken");
      }

     
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (destinationsRef.current && !destinationsRef.current.contains(event.target)) {
        setDesktopDestinationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSettings = async () => {
    try {
      setSettingsLoading(true);
      const res = await fetch("https://apiyatraadda.jaspersoftwaresolutions.com/api/setting", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
        console.log("Settings fetched:", data.data);
      } else {
        console.error("Failed to fetch settings:", data.message);
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleLoginSuccess = (data) => {
    if (data.token) {
      localStorage.setItem("userToken", data.token);
      const decodedUser = decodeJWT(data.token);
      if (decodedUser) {
        setUser({
          id: decodedUser.id,
          name: decodedUser.name,
          email: decodedUser.email,
          avatar: decodedUser.avatar || "/us.jpeg",
        });
      }
     
    } else if (data.name && data.email) {
      setUser(data); 
      localStorage.setItem("userToken", JSON.stringify(data));
    }
    setIsLoginModalOpen(false);
    setShowUserDropdown(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("userToken");
    setShowUserDropdown(false);
    setMobileMenuOpen(false);
  };

  const getImageURL = (img, fallback) => {
    if (!img) return fallback;
    if (img.startsWith("http")) return img;
    return `https://apiyatraadda.jaspersoftwaresolutions.com${img.startsWith("/") ? img : `/uploads/${img}`}`;
  };

  const BusinessSignupModal = ({ isOpen, onClose, loading }) => {
    const [form, setForm] = useState({ name: "", email: "", phone: "" });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!form.name || !form.email || !form.phone) return alert("Fill all fields");

      try {
        setLoading(true);
        const response = await axios.post("https://apiyatraadda.jaspersoftwaresolutions.com/api/send-business-mail", {
          ...form,
          token: "A1E1FEBF8C6F5",
        });
        alert(response.data.success ? "Request sent!" : response.data.message);
        onClose();
      } catch (err) {
        console.error(err);
        alert("Error during signup");
      } finally {
        setLoading(false);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
        <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
          <h2 className="text-2xl font-bold mb-4 text-center">Sign Up for Business</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {["name", "email", "phone"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter your ${field}`}
                />
              </div>
            ))}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const navLinks = [
    { name: "Deals", path: "/deals" },
    { name: "Explore", path: "/explore" },
    { name: "Help", path: "/faq" },
  ];

  return (
    <header className="bg-white text-blue-500 relative z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {settingsLoading ? (
          <div className="h-10 w-10 animate-pulse bg-gray-300 rounded"></div>
        ) : (
          <img
            src={getImageURL(settings?.logo, "/fallback-logo.png")}
            alt="Logo"
            className="h-10 w-auto cursor-pointer"
            onClick={() => navigate("/")}
            onError={(e) => (e.target.src = "/fallback-logo.png")}
          />
        )}

        <nav className="hidden md:flex gap-6 items-center relative">
          <div className="relative" ref={destinationsRef}>
            <button
              onClick={() => setDesktopDestinationsOpen(!desktopDestinationsOpen)}
              className="flex items-center gap-1 hover:text-orange-400 font-bold"
            >
              Destinations <ChevronDown size={16} />
            </button>
            {desktopDestinationsOpen && (
              <div className="absolute left-0 transform -translate-x-1/2 mt-2 z-50 ">
                <DestinationsMenu />
              </div>
            )}
          </div>

          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="hover:text-orange-400 font-bold">
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4 relative">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-400"
              >
                <img
                  src={user.avatar || "/us.jpeg"}
                  alt="avatar"
                  className="h-6 w-6 rounded-full"
                  onError={(e) => (e.target.src = "/us.jpeg")}
                />
                <span>{user.name}</span>
              </button>
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-md shadow-lg z-50">
                  <ul className="divide-y">
                    {["My Account", "Manage Booking", "Payment Options"].map((item) => (
                      <li
                        key={item}
                        onClick={() => navigate("/account")}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {item}
                      </li>
                    ))}
                    <li
                      onClick={handleLogout}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                    >
                      Log out
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-gray-500"
              >
                Login
              </button>
              <button
                onClick={() => setIsSignupModalOpen(true)}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-gray-500"
              >
                SignUp
              </button>
              <button
                onClick={() => setIsBusinessModalOpen(true)}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-gray-500"
              >
                Business
              </button>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

    {mobileMenuOpen && (
  <div className="md:hidden bg-white text-blue-500 flex flex-col gap-3 p-4 rounded-lg shadow-md">
    {/* Nav Links */}
    {navLinks.map((link) => (
      <Link
        key={link.name}
        to={link.path}
        className="px-2 py-1 hover:text-orange-400 transition-colors"
        onClick={() => setMobileMenuOpen(false)}
      >
        {link.name}
      </Link>
    ))}

    {/* User Section */}
    {user ? (
      <Link
        to="/account"  // यहाँ वो route डालें जहाँ आपका profile/account page है
        className="flex items-center gap-2 mt-2 px-2 py-1 hover:text-orange-400 transition-colors"
        onClick={() => setMobileMenuOpen(false)}
      >
        <span>My Profile</span>
      </Link>
    ) : (
      <div className="flex flex-col gap-2 mt-2">
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="text-left px-2 py-1 hover:text-orange-400 transition-colors"
        >
          Login
        </button>
        <button
          onClick={() => setIsSignupModalOpen(true)}
          className="text-left px-2 py-1 hover:text-orange-400 transition-colors"
        >
          SignUp
        </button>
        <button
          onClick={() => setIsBusinessModalOpen(true)}
          className="text-left px-2 py-1 hover:text-orange-400 transition-colors"
        >
          Business
        </button>
      </div>
    )}
  </div>
)}


      <Login
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <SignUp
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      />
      <BusinessSignupModal
        isOpen={isBusinessModalOpen}
        onClose={() => setIsBusinessModalOpen(false)}
        loading={loading}
      />
    </header>
  );
}