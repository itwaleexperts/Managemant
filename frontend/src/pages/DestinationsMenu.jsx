import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DestinationsMenu() {
  const [destinations, setDestinations] = useState({});
  const [activeCountry, setActiveCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const navigate=useNavigate();
  useEffect(() => {
    axios
      .get("https://apiyatraadda.jaspersoftwaresolutions.com/api/destination")
      .then((res) => {
        console.log("🌍 API Response:", res.data);
        const apiData = res.data?.data || [];

        const structured = apiData.reduce((acc, item) => {
          acc[item.country] = item.cities || [];
          return acc;
        }, {});

        setDestinations(structured);
        setActiveCountry(apiData[0]?.country || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(" Error fetching destinations:", err);
        setError("Failed to load destinations");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="absolute left-50 top-full w-[800px] bg-white shadow-lg rounded-md z-50 flex items-center justify-center h-[450px]">
        <p className="text-gray-500">Loading destinations...</p>
      </div>
    );

  if (error)
    return (
      <div className="absolute left-50 top-full w-[800px] bg-white shadow-lg rounded-md z-50 flex items-center justify-center h-[450px]">
        <p className="text-red-500">{error}</p>
      </div>
    );

  if (!Object.keys(destinations).length)
    return (
      <div className="absolute left-50 top-full w-[800px] bg-white shadow-lg rounded-md z-50 flex items-center justify-center h-[450px]">
        <p className="text-gray-500">No destinations available.</p>
      </div>
    );

  return (
    <div className="absolute left-50 top-full w-[600px] bg-white shadow-lg rounded-md z-50">
      <div className="flex h-[450px]">
        <div className="w-1/3 border-r overflow-y-auto">
          <h3 className="px-4 py-3 font-semibold">All destinations</h3>
          <ul>
            {Object.keys(destinations).map((country) => (
              <li key={country}>
                <button
                  onMouseEnter={() => setActiveCountry(country)}
                  className={`w-full flex items-center justify-between px-4 py-2 text-left 
                    text-black hover:text-orange-600 hover:bg-orange-50 
                    ${activeCountry === country
                      ? "bg-orange-100 border-l-4 border-orange-500 font-medium text-orange-600"
                      : ""
                    }`}
                >
                  {country}
                  <ChevronRight size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-1/2 p-7 overflow-y-auto">
          <h3 className="font-semibold text-orange-600 flex items-center gap-2 mb-3">
            🏨 Hotels
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {destinations[activeCountry]?.map((city) => (
              <div
                key={city.name}
                className="relative rounded-md overflow-hidden cursor-pointer group"
              >
                <img
                  src={`https://apiyatraadda.jaspersoftwaresolutions.com${city.img}`} 
            onClick={() => navigate(`/hotels/${city.name}`)} 

                  alt={city.name}
                  className="h-28 w-full object-cover group-hover:scale-105 transition"
                />
                <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-sm font-medium px-2 py-1">
                  {city.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
