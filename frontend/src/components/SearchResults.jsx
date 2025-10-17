import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function SearchResults() {
  const [hotels, setHotels] = useState([]);
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const destination = query.get("destination");
  const checkIn = query.get("checkIn");
  const checkOut = query.get("checkOut");
  const guests = query.get("guests");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await axios.get(
          `https://apiyatraadda.jaspersoftwaresolutions.com/api/hotel/search-by-destination?destination=${destination}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
        );
        setHotels(res.data);
      } catch (err) {
        console.error("Failed to fetch hotels:", err)
      }
    }
    fetchHotels();
  }, [destination, checkIn, checkOut, guests]);

  return (
    <>
    <Navbar/>
<div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Hotels in {destination ? destination : "selected location"}
      </h1>

      {hotels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hotels.map((hotel) => (
            <Link
              key={hotel._id}
              to={`/roomdetails/${hotel._id}`}
              className="border rounded-lg shadow-md p-4 hover:shadow-lg transition bg-white"
            >
              <img
                src={`https://apiyatraadda.jaspersoftwaresolutions.com/uploads/${hotel.images?.[0]}`}
                alt={hotel.name}
                className="rounded-lg h-48 w-full object-cover mb-4"
              />
              <h3 className="font-semibold text-xl">{hotel.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{hotel.destination}</p>
              <p className="text-gray-700 font-medium mt-2">
                From ₹{hotel.pricePerNight} / night
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center mt-10">
          No hotels found for this search.
        </p>
      )}
    </div>
    <Footer/>
    
    </>
  );
}  
