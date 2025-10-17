import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";

export default function NextDestinations() {
  const [hotels, setHotels] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [tabs, setTabs] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await axios.get("https://apiyatraadda.jaspersoftwaresolutions.com/api/group/hotels");
        const data = res.data || [];

        setHotels(data);

        const countries = Array.from(new Set(data.map((h) => h.country)));
        setTabs(["All", ...countries]);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch hotels:", err);
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (!hotels.length)
    return (
      <div className="min-h-screen flex items-center justify-center">
        No hotels found.
      </div>
    );

  const filteredHotels =
    activeTab === "All"
      ? hotels
      : hotels.filter((h) => h.country === activeTab);

  // 🟢 When user clicks on a hotel card, navigate to Hotels page for that country
  const handleNavigate = (country) => {
    navigate("/hotels", { state: { country } });
  };

  return (
    <section className="py-12 px-6 w-full max-w-6xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        What’s your next destination?
      </h2>

      <div className="flex flex-wrap gap-4 mb-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-medium ${
              activeTab === tab
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {filteredHotels.map((d) => (
          <SwiperSlide key={d._id}>
            <div
              className="rounded-lg overflow-hidden shadow-lg bg-white cursor-pointer group h-60"
              onClick={() => handleNavigate(d.country)} // 🟢 navigate to Hotels.jsx
            >
              <img
                src={`https://apiyatraadda.jaspersoftwaresolutions.com${d.images?.[0]}`}
                alt={d.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{d.name}</h3>
                <p className="text-sm text-gray-500">{d.country}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
