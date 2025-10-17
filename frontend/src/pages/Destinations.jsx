import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

useEffect(() => {
  axios.get("https://apiyatraadda.jaspersoftwaresolutions.com/api/destination")
    .then(res => {
      console.log("API response:", res.data);
      setDestinations(res.data.data || []); 
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError("Failed to load destinations");
      setLoading(false);
    });
}, []);



  const handleNavigation = (country) => {
    navigate("/hotels", { state: { country } });
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen text-gray-600">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;

  return (
    <>

<section className="py-12 px-6 w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">
            Explore our top destinations
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest._id}
              className="relative rounded-lg overflow-hidden shadow-lg group cursor-pointer"
              onClick={() => handleNavigation(dest.country)}
            >
<img
  src={`https://apiyatraadda.jaspersoftwaresolutions.com${dest.cities[0]?.img}`}
  alt={dest.country}
  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
/>


              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <h3 className="absolute bottom-3 left-3 text-white text-lg font-semibold">{dest.country}</h3>
              {dest.cities[0]?.price && (
                <div className="absolute bottom-3 right-3 bg-white rounded px-2 py-1 text-sm text-right shadow">
                  <p className="line-through text-gray-500 text-xs">{dest.cities[0].oldPrice}</p>
                  <p className="text-orange-600 font-bold">{dest.cities[0].newPrice}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </>
  );
}
