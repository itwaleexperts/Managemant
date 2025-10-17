import { useCallback, useEffect, useState } from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Destinations from "./Destinations";
import NextDestinations from "./NextDestinations";
import Footer from "../components/Footer";

const dateToISOString = (date) => date.toISOString().split("T")[0];

export default function Home() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState(dateToISOString(new Date()));
  const [checkOutDate, setCheckOutDate] = useState(
    dateToISOString(new Date(Date.now() + 24 * 60 * 60 * 1000))
  );
  const [guests, setGuests] = useState(1);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch("https://apiyatraadda.jaspersoftwaresolutions.com/api/setting", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
        console.log(data.data)
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const getImageURL = (img, fallback) => {
    if (!img) return fallback;
    if (img.startsWith("http")) return img;
    return `https://apiyatraadda.jaspersoftwaresolutions.com${img}`;
  };

  const sliderImages =
    settings?.images?.map((img) => getImageURL(img)) || [];
  const bgImageURL = getImageURL(
    settings?.bgImage,
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1950"
  );

  const ImageSlider = ({ images, interval = 3500 }) => {
    const defaultImages = [
      "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&q=80&w=1950",
      "https://images.unsplash.com/photo-1549471946-24856f68c345?auto=format&fit=crop&q=80&w=1950",
    ];

    const imageList = images && images.length ? images : defaultImages;
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
      setCurrentIndex((prev) => (prev + 1) % imageList.length);
    }, [imageList.length]);

    useEffect(() => {
      if (imageList.length > 1) {
        const timer = setInterval(nextSlide, interval);
        return () => clearInterval(timer);
      }
    }, [imageList.length, interval, nextSlide]);

    const prevSlide = () => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + imageList.length) % imageList.length
      );
    };

  

    return (
      <div className="relative overflow-hidden rounded-xl shadow-xl h-[250px] md:h-[300px]">
        {imageList.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/1000x400/808080/FFFFFF?text=Image+Load+Failed";
              }}
            />
         
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-50 text-blue-500 p-3 rounded-full hover:bg-opacity-75 transition"
          aria-label="Previous Slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-50 text-blue-500 p-3 rounded-full hover:bg-opacity-75 transition"
          aria-label="Next Slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {imageList.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-blue-500 w-5" : "bg-white opacity-50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  };

  const handleDateChange = (type, dateString) => {
    let newIn = checkInDate;
    let newOut = checkOutDate;

    if (type === "checkIn") {
      newIn = dateString;
      const newInDate = new Date(newIn);
      const newOutDateObj = new Date(newOut);
      if (newInDate >= newOutDateObj) {
        const nextDay = new Date(newInDate.getTime() + 24 * 60 * 60 * 1000);
        newOut = dateToISOString(nextDay);
        setCheckOutDate(newOut);
      }
      setCheckInDate(newIn);
    } else {
      newOut = dateString;
      if (new Date(newOut) <= new Date(newIn)) return;
      setCheckOutDate(newOut);
    }
  };

  const handleSearch = () => {
    if (!destination || !checkInDate || !checkOutDate) {
      alert("Please enter a destination and valid dates.");
      return;
    }

    navigate(
      `/roomdetails/search?destination=${destination}&checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${guests}`
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section
        className="relative bg-cover bg-center h-[400px] flex flex-col justify-center items-center text-white p-4"
        style={{
          backgroundImage: `url('${bgImageURL}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Explore Europe for less
        </h2>

 <div className="bg-white text-black rounded-lg shadow-md flex flex-col sm:flex-row flex-wrap items-center gap-2 px-4 py-3 w-full sm:w-[90%] max-w-4xl">
  <div className="flex items-center gap-2 flex-1 sm:flex-none w-full sm:w-auto border-b sm:border-b-0 sm:border-r pb-2 sm:pb-0">
    <MapPin className="w-5 h-5 text-gray-500" />
    <input
      type="text"
      placeholder="Enter hotel or destination"
      className="outline-none flex-1 w-full"
      value={destination}
      onChange={(e) => setDestination(e.target.value)}
    />
  </div>

  <div className="flex items-center gap-2 flex-1 sm:flex-none w-full sm:w-auto border-b sm:border-b-0 sm:border-r pb-2 sm:pb-0">
    <Calendar className="w-5 h-5 text-gray-500" />
    <input
      type="date"
      className="outline-none flex-1 w-full"
      value={checkInDate}
      onChange={(e) => handleDateChange("checkIn", e.target.value)}
      min={dateToISOString(new Date())}
    />
    <span className="text-gray-400">→</span>
    <input
      type="date"
      className="outline-none flex-1 w-full"
      value={checkOutDate}
      onChange={(e) => handleDateChange("checkOut", e.target.value)}
      min={dateToISOString(
        new Date(new Date(checkInDate).getTime() + 24 * 60 * 60 * 1000)
      )}
    />
  </div>

  <div className="flex items-center gap-2 flex-1 sm:flex-none w-full sm:w-auto border-b sm:border-b-0 sm:border-r pb-2 sm:pb-0">
    <Users className="w-5 h-5 text-gray-500" />
    <select
      value={guests}
      onChange={(e) => setGuests(Number(e.target.value))}
      className="outline-none w-full"
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
        <option key={g} value={g}>
          {g} guest{g > 1 ? "s" : ""}
        </option>
      ))}
    </select>
  </div>

  <button
    onClick={handleSearch}
    disabled={!destination || !checkInDate || !checkOutDate}
    className={`px-12 py-2 rounded font-bold transition w-full sm:w-auto ${
      !destination || !checkInDate || !checkOutDate
        ? "bg-gray-200 cursor-not-allowed text-gray-500"
        : "bg-blue-600 text-white hover:bg-blue-700"
    }`}
  >
    SEARCH
  </button>
</div>


      </section>

      <section className="py-10 bg-gray-100 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Featured Deals & Galleries
          </h3>
          {loading ? (
            <div className="text-center p-8 bg-white rounded-xl shadow-lg h-[250px] md:h-[300px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="ml-4 text-blue-600">Loading settings...</p>
            </div>
          ) : (
            <ImageSlider images={sliderImages} />
          )}
        </div>
      </section>

      <Destinations />
      <NextDestinations />
      <Footer />
    </div>
  );
}
