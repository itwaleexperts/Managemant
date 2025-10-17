import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLogin from "./Login";
import AdminSignup from "./SignUp";
import AdminPanel from "./AdminPanel";

const AdminRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        const res = await axios.get("https://apiyatraadda.jaspersoftwaresolutions.com/api/admin/verify-token", {
          withCredentials: true,
        });
        setIsLoggedIn(res.data.success);
      } catch (err) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    verifyLogin();
  }, []);

  if (loading) return <div className="text-center mt-20">Checking admin login...</div>;
  if (isLoggedIn) return <AdminPanel />;

  return showSignup ? (
    <AdminSignup onSuccess={() => setIsLoggedIn(true)} />
  ) : (
    <AdminLogin
      onSuccess={() => setIsLoggedIn(true)}
      switchToSignup={() => setShowSignup(true)}
    />
  );
};

export default AdminRoute;
