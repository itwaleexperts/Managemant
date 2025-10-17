import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";


const getBackendUrl = (path) => {
  if (path && path.startsWith('/uploads/')) {
    return `https://apiyatraadda.jaspersoftwaresolutions.com${path}`;
  }
  return path; 
};

export default function ExplorePage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const staticData = [
    {
      name: "France",
      banner: "https://picsum.photos/1200/400?random=1",
      cities: [
        { name: "Paris", img: "https://picsum.photos/400/250?random=2" },
        { name: "Nice", img: "https://picsum.photos/400/250?random=3" },
      ],
    },
    {
      name: "Spain",
      banner: "https://picsum.photos/1200/400?random=6",
      cities: [
        { name: "Madrid", img: "https://picsum.photos/400/250?random=7" },
        { name: "Barcelona", img: "https://picsum.photos/400/250?random=8" },
      ],
    },
  ];

  useEffect(() => {
    axios.get("https://apiyatraadda.jaspersoftwaresolutions.com/api/explore")
      .then(res => {
        const data = res.data.data;
        setCountries(data?.length ? data : staticData);
      })
      .catch(err => {
        console.error("Error fetching explore data:", err);
        setCountries(staticData);
      })
      .finally(() => setLoading(false));
  }, []);

  const firstCountry = countries.length > 0 ? countries[0] : null;

  const dynamicBannerImage = getBackendUrl(firstCountry?.banner) || "https://picsum.photos/1600/500?random=20";
  const dynamicBannerText = firstCountry ? `Explore ${firstCountry.name} & More` : "Explore New Destinations 🌍";

  if (loading)
    return (
      <div className="text-center py-20 text-gray-600">Loading Explore Page...</div>
    );

  return (
    <>
      <Navbar />

      <div className="w-full min-h-screen bg-gray-50">

        <div className="relative w-full h-[300px] sm:h-[400px] mt-12">
          <img
            src={dynamicBannerImage}
            alt="Explore Banner"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://picsum.photos/1600/500?random=20"; }}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white text-center p-4">
              {dynamicBannerText}
            </h1>

          </div>
        </div>

        {countries.map((country, idx) => (
          <div key={country._id || idx} className="my-16 bg-white shadow-lg p-6 rounded-xl mx-auto max-w-7xl">

            <div className="mb-8 border-b pb-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-purple-700 mb-6">
                Discover {country.name}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {country.cities.map((city, i) => (
                  <div
                    key={city._id || i}
                    className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
                    <img
                      src={getBackendUrl(city.img)}
                      alt={city.name}
                      className="h-40 w-full object-cover"
                    />
                    <div className="p-4 text-center">
                      <h3 className="font-bold text-lg text-gray-800">{city.name}</h3>
                      <button className="mt-2 text-sm text-orange-600 hover:text-orange-800 font-medium transition duration-200">
                        View Hotels in {city.name}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative w-full h-[220px] my-8">
              <img
                src={getBackendUrl(country.banner)}
                alt={country.name}
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                <h2 className="text-3xl sm:text-4xl text-white font-extrabold p-4 text-center">
                  Find the best Hotels in {country.name}
                </h2>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">Popular Cities to Stay</h3>
              <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={20}
                slidesPerView={1}
                grabCursor
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 },
                }}
                className="pb-10"
              >
                {country.cities.map((city, i) => (
                  <SwiperSlide key={city._id || i}>
                    <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-md">
                      <img
                        src={getBackendUrl(city.img)}
                        alt={city.name}
                        className="h-40 w-full object-cover"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-bold text-lg text-gray-800">{city.name}</h3>
                      <button className="mt-2 text-sm text-orange-600 hover:text-orange-800 font-medium transition duration-200">
                        Explore Stays
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        ))}

      </div>
      <Footer />
    </>
  );
}