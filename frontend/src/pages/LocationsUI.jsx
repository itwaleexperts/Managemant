import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const HotelCard = ({ imageUrl, name, location, price, type = "open" }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden text-center">
    <img
      src={imageUrl}
      alt={name}
      className="w-full h-40 object-cover"
    />
    <div className="p-4">
      <h3 className="font-bold text-lg text-gray-800">{name}</h3>
      <p className="text-sm text-gray-600 mb-2">{location}</p>
      {type === "open" ? (
        <button className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition duration-150">
          From {price}
        </button>
      ) : (
        <span className="text-sm text-gray-500 italic">Under Development</span>
      )}
    </div>
  </div>
);

const LocationsUI = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get("https://apiyatraadda.jaspersoftwaresolutions.com/api/develop/get");
      if (res.data.success && res.data.data.length > 0) {
        setData(res.data.data[0]); 
      } else {
        setError("No data found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);


  if (loading)
    return (
      <div className="text-center py-20 text-gray-600">Loading...</div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-500">{error}</div>
    );

  const {
    heroImage,
    heroTitle,
    heroDescription,
    overviewText,
    stats = [],
    openHotels = [],
    underDevelopmentHotels = [],
    boardOfDirectors = {},
    smallTextSections = [],
    shareholderSection = {},
  } = data || {};

  return (
    <>
      <Navbar />

      <div
        className="relative w-full h-64 md:h-96 flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-white px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold">{heroTitle}</h1>
          <p className="mt-2 md:mt-4 text-sm md:text-lg">{heroDescription}</p>
        </div>
      </div>

      <div className="min-h-screen bg-white font-sans text-gray-700">
        <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
          <p className="text-center text-gray-600 mb-12">{overviewText}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-12">
            {stats.map((stat) => (
              <div key={stat._id} className="bg-gray-100 p-6 rounded-lg shadow-sm">
                <p className="text-orange-500 text-4xl font-extrabold">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">OPEN HOTELS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {openHotels.map((hotel) => (
              <HotelCard
                key={hotel._id}
                imageUrl={hotel.imageUrl}
                name={hotel.name}
                location={hotel.location}
                price={hotel.price}
                type="open"
              />
            ))}
          </div>

          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            HOTELS UNDER DEVELOPMENT
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {underDevelopmentHotels.map((hotel) => (
              <HotelCard
                key={hotel._id}
                imageUrl={hotel.imageUrl || "https://picsum.photos/300/200"}
                name={hotel.name}
                location={hotel.location}
                type="development"
              />
            ))}
          </div>

          {boardOfDirectors && (
            <div className="bg-gray-50 p-8 rounded-lg shadow-md text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">{boardOfDirectors.title}</h2>
              <p className="leading-relaxed text-gray-600">{boardOfDirectors.description}</p>
              <button className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition duration-150">
                {boardOfDirectors.buttonText}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600 mt-12 pt-8 border-t border-gray-200">
            {smallTextSections.map((txt, index) => (
              <p key={index}>{txt}</p>
            ))}
          </div>

          {shareholderSection && (
            <div className="bg-gray-50 p-8 rounded-lg shadow-md text-center max-w-3xl mx-auto space-y-4 mt-12">
              <h2 className="text-2xl font-bold text-gray-800">{shareholderSection.title}</h2>
              <p className="leading-relaxed text-gray-600">{shareholderSection.description}</p>
              <button className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition duration-150">
                {shareholderSection.buttonText}
              </button>
            </div>
          )}
        </div>

        <div className="bg-orange-500 py-10 mt-12">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h3 className="text-white text-xl font-bold">
              Find your next easyHotel destination.
            </h3>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default LocationsUI;
