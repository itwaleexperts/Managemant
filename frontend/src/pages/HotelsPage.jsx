import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPin, Star } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HotelsPage() {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://apiyatraadda.jaspersoftwaresolutions.com/api/hotel?city=${cityName}`)
      .then((res) => {
        setHotels(res.data.data || []);
        console.log(res.data.data);
        
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [cityName]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-600 text-lg">
        Loading hotels...
      </div>
    );

  if (!hotels.length)
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-gray-600 text-lg">
        <p>No hotels found for <span className="font-semibold">{cityName}</span></p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          Go Back
        </button>
      </div>
    );

  return (
   <>
   
   <Navbar/>
 <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Hotels in <span className="text-orange-600">{cityName}</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {hotels.map((hotel) => (
          <div
            key={hotel._id}
            className="bg-white rounded-2xl shadow-md overflow-hidden transform transition duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
            onClick={() => navigate(`/roomdetails/${hotel._id}`)}
          >
            <div className="relative">
              <img
                src={`https://apiyatraadda.jaspersoftwaresolutions.com/uploads/${hotel.images?.[0]}`}
                alt={hotel.name}
                className="h-52 w-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-orange-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                {hotel.location?.[0]?.city}
              </div>
            </div>

            <div className="p-4 flex flex-col justify-between h-[170px]">
              <div>
                <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                  {hotel.name}
                </h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {hotel.description || "A cozy stay with premium comfort"}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <p className="text-orange-600 font-bold text-base">
                  ₹{hotel.pricePerNight}/night
                </p>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <span className="text-gray-700 text-sm">{hotel.rating}</span>
                </div>
              </div>

              <div className="mt-2 flex items-center text-gray-500 text-xs">
                <MapPin size={14} className="mr-1" />
<p className="text-gray-500">{hotel.location?.[0]?.address || "Unknown location"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
   <Footer/>
   
   </>
  );
}
