import { Calendar, MapPin, Users } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Hotels() {
  const [guests, setGuests] = useState(1);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const country = location.state?.country;

  useEffect(() => {
    if (!country) return;

    setLoading(true);

    axios
      .get('https://apiyatraadda.jaspersoftwaresolutions.com/api/hotel/all') 
      .then((res) => {
        const filteredHotels = res.data.filter(
          (hotel) => hotel.location[0]?.country === country
        );
        setHotels(filteredHotels);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [country]);

  if (loading)
    return <div className="text-center py-20 text-gray-600">Loading Hotels...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-8">
          Hotels in {country}
        </h1>

        {hotels.length === 0 ? (
          <p className="text-center">No hotels found in {country}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {hotels.map((hotel) => (
              <div
                key={hotel._id}
                className="relative h-56 rounded-lg overflow-hidden shadow-lg group cursor-pointer border border-gray-200"
                onClick={() => navigate(`/roomdetails/${hotel._id}`)}
              >
                <img
                  src={
                    hotel.images[0]
                      ? `https://apiyatraadda.jaspersoftwaresolutions.com/uploads/${hotel.images[0]}`
                      : 'https://picsum.photos/400/250'
                  }
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute left-4 bottom-4">
                  <h3 className="text-white text-2xl font-bold">{hotel.name}</h3>
                  <p className="text-white text-sm">
                    {hotel.location[0]?.city}, {hotel.location[0]?.state}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
