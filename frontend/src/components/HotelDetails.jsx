import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const HotelDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await axios.get(`https://apiyatraadda.jaspersoftwaresolutions.com/api/hotel/one/${id}`);
        setHotel(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading hotel...</div>;
  if (!hotel) return <div className="text-center py-20 text-red-500">Hotel not found.</div>;

  return (
    <>
      <Navbar />
      <div className="font-sans bg-gray-50 min-h-screen">
        <header className="relative w-full h-64 overflow-hidden mb-8">
          <img
            src={hotel.images[0] ? `https://apiyatraadda.jaspersoftwaresolutions.com/uploads/${hotel.images[0]}` : "https://picsum.photos/1200/400"}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <h1 className="text-5xl font-extrabold text-white tracking-widest">{hotel.name}</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8">
          <section className="mb-12">
            <div className="flex flex-col md:flex-row md:gap-8">
              <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                {hotel.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={`https://apiyatraadda.jaspersoftwaresolutions.com/uploads/${img}`}
                    alt={`${hotel.name} ${idx}`}
                    className="w-full h-60 object-cover rounded-lg cursor-pointer"
                    onClick={() => window.open(`https://apiyatraadda.jaspersoftwaresolutions.com/uploads/${img}`, "_blank")}
                  />
                ))}
              </div>

              <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-lg mt-6 md:mt-0">
                <h2 className="text-2xl font-bold mb-2">{hotel.name}</h2>
                <p className="text-gray-600 mb-2">{hotel.location[0]?.city}, {hotel.location[0]?.state}</p>
                <p className="text-gray-700 mb-2">{hotel.description}</p>
                <p>{`₹${hotel.pricePerNight}`} </p>
                <p className="mt-2 text-gray-500 text-sm">Rating: {hotel.rating || "N/A"}</p>
                <p className="mt-2 text-gray-500 text-sm">Available Rooms: {hotel.availableRooms}/{hotel.totalRooms}</p>
                
                <div className="mt-4 text-gray-700">
                  {hotel.contact?.map((c, i) => (
                    <div key={i} className="text-sm">
                      <p>Phone: {c.phone}</p>
                      <p>Email: {c.email}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold mb-1">Facilities:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {hotel.facilities && hotel.facilities[0] && JSON.parse(hotel.facilities[0]).map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                <button className="mt-6 w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition duration-300">
                  Book Now
                </button>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Other Hotels</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className="relative h-60 rounded-lg overflow-hidden shadow-lg cursor-pointer"
                onClick={() => navigate(`/hotel/another-hotel-id`)}
              >
                <img
                  src="https://picsum.photos/400/250?random=11"
                  alt="Other Hotel"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-lg">
                  Other Hotel
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default HotelDetails;
