import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BASE_URL = "https://apiyatraadda.jaspersoftwaresolutions.com/uploads"; 

const CareersPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const staticData = {
    hero: {
      title: "easyHotel Careers",
      subtitle: "Join easyHotel and be part of the team",
      image: `${BASE_URL}/hero.jpg`,
    },
    intro:
      "Making hotel stays super easy, super value and super low carbon! Launched in 2004 by Stelios Haji-Ioannou, founder of easyJet, easyHotel is a super budget international hotel chain across UK & Europe.",
    benefits: [
      { title: "50% Staff Discount", icon: "💰" },
      { title: "25% Friends & Family Discount", icon: "👨‍👩‍👧‍👦" },
      { title: "Life Insurance", icon: "🛡️" },
      { title: "Annual Team Leave", icon: "🌴" },
      { title: "Learning & Development", icon: "📘" },
      { title: "Annual Summer & Winter Team Events", icon: "🎉" },
    ],
    testimonials: [
      {
        name: "Anna – HR Assistant, UK",
        text: "I joined the HR team in 2022 and love working here! The team is amazing and the work environment is supportive.",
        img: `${BASE_URL}/testimonial1.jpg`,
      },
    ],
    opportunities: [
      {
        role: "Hotel Roles",
        desc: "UK, France & Spain",
        img: `${BASE_URL}/opportunity1.jpg`,
      },
    ],
    vacancies: ["UK", "Spain", "France", "Italy"],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://apiyatraadda.jaspersoftwaresolutions.com/api/careers");
        const json = await res.json();
        console.log("API Response:", json);
        if (json.success && json.data) {
          setData(json.data);
        } else {
          setData(staticData);
        }
      } catch (err) {
        console.error("Error fetching careers data:", err);
        setData(staticData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!data) return <div className="text-center py-10">No data found!</div>;

  return (
    <div className="w-full">
      <Navbar />

      <div className="relative h-[300px] w-full mt-4">
        <img
          src={data.hero?.image ? `${BASE_URL}/${data.hero.image}` : staticData.hero.image}
          alt="Careers"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-5xl font-bold">{data.hero.title}</h1>
            {data.hero.subtitle && <p className="mt-2 text-lg md:text-xl">{data.hero.subtitle}</p>}
          </div>
        </div>
      </div>

      <div className="px-6 py-10 text-center">
        <p className="text-gray-600 max-w-2xl mx-auto">{data.intro}</p>
      </div>

      <div className="px-6 py-10 bg-gray-50">
        <h2 className="text-2xl font-bold mb-6 text-center">Benefits</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
          {data.benefits.map((b, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-md">
              <div className="text-4xl mb-3">{b.icon}</div>
              <h3 className="font-semibold text-gray-800">{b.title}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-12 text-center">
        <h2 className="text-2xl font-bold mb-6">Testimonials</h2>
        <div className="space-y-8">
          {data.testimonials.map((t, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-center bg-white p-6 rounded-lg shadow hover:shadow-md"
            >
              <img
                src={t.img ? `${BASE_URL}/${t.img}` : staticData.testimonials[0].img}
                alt={t.name}
                className="w-24 h-24 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
              />
              <div>
                <p className="text-gray-700 italic mb-2">"{t.text}"</p>
                <h4 className="font-semibold text-gray-900">{t.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Opportunities</h2>
        <Swiper
          spaceBetween={20}
          slidesPerView={1.2}
          breakpoints={{ 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3 } }}
        >
          {data.opportunities.map((o, i) => (
            <SwiperSlide key={i}>
              <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg">
                <img
                  src={o.img ? `${BASE_URL}/${o.img}` : staticData.opportunities[0].img}
                  alt={o.role}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold">{o.role}</h3>
                  <p className="text-gray-500 text-sm">{o.desc}</p>
                  <button className="mt-3 text-orange-500 font-medium">View Vacancies</button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="px-6 py-12 bg-gray-50 text-center">
        <h2 className="text-2xl font-bold mb-6">Our Vacancies</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <select className="border p-3 rounded-lg w-full sm:w-60">
            <option>Select Location</option>
            {Array.isArray(data.vacancies) &&
              data.vacancies.map((loc, i) => <option key={i}>{loc}</option>)}
          </select>
          <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold">Search</button>
        </div>
        <button className="mt-6 underline text-orange-500 font-medium">Explore All Jobs</button>
      </div>

      <Footer />
    </div>
  );
};

export default CareersPage;
