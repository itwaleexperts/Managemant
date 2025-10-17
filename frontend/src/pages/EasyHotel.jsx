import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock, Tag, Bookmark, KeyRound } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const iconMap = { Clock, Tag, Bookmark, KeyRound };

const FeatureCard = ({ Icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-4 transition-transform transform hover:scale-105">
    <div className="text-orange-500 mb-4">
      <Icon className="w-12 h-12 mx-auto" strokeWidth={1} />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

export default function EasyHotelApp() {
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);

  const staticData = {
    heroImage: "https://picsum.photos/450/900?random=1",
    heading: "Manage your bookings with the easyHotel app",
    subHeading:
      "Easily book, update or check your reservation anytime with the easyHotel app. Enjoy exclusive offers and get real-time updates for a hassle-free travel experience. Download now.",
    googlePlayLink:
      "https://play.google.com/store/apps/details?id=easyhotel.app",
    appStoreLink: "https://apps.apple.com/app/easyhotel",
    features: [
      {
        icon: "Clock",
        title: "Book your next stay in seconds",
        description:
          "Find and secure your room quickly with a streamlined booking process.",
      },
      {
        icon: "Tag",
        title: "Unlock exclusive app-only offers",
        description:
          "Access special rates and deals not available anywhere else.",
      },
      {
        icon: "Bookmark",
        title: "Keep all your booking details",
        description:
          "View confirmations, check-in info, and hotel details instantly.",
      },
      {
        icon: "KeyRound",
        title: "Check-in online and digital key",
        description:
          "Skip the front desk and go straight to your room for faster arrival.",
      },
    ],
  };

  useEffect(() => {
    axios
      .get("https://apiyatraadda.jaspersoftwaresolutions.com/api/easy/get")
      .then((res) => {
        console.log("EasyHotel App Data:", res.data);
        const data = res.data.data?.[0];
        setAppData(data || staticData);
      })
      .catch((err) => {
        console.error("Error fetching EasyHotelApp data:", err);
        setAppData(staticData); 
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  const data = appData || staticData;

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col bg-white">
        <section className="bg-orange-500 py-16 sm:py-24 text-white relative">
          <div className="container mx-auto px-4 text-center">
            <div className="relative mx-auto w-3/4 max-w-xs sm:max-w-sm mb-12">
              <div className="bg-black p-2 rounded-[2.5rem] shadow-2xl border-[10px] border-black relative">
                <div className="aspect-[9/18] w-full overflow-hidden rounded-[2rem]">
                  <img
                    src={data.heroImage}
                    alt="easyHotel App Screenshot"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-4 w-1/3 bg-black rounded-b-lg" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-normal tracking-wide mb-6 leading-snug">
              {data.heading.split("easyHotel app")[0]}
              <span className="font-bold">easyHotel app</span>
            </h1>

            <p className="text-lg font-light mb-8 max-w-2xl mx-auto px-4">
              {data.subHeading}
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href={data.googlePlayLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://placehold.co/150x45/ffffff/000000?text=Google+Play"
                  alt="Download on Google Play"
                  className="h-11 rounded-lg hover:opacity-90 transition"
                />
              </a>
              <a
                href={data.appStoreLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://placehold.co/150x45/ffffff/000000?text=App+Store"
                  alt="Download on the App Store"
                  className="h-11 rounded-lg hover:opacity-90 transition"
                />
              </a>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold text-gray-900 text-center mb-12">
              Making your hotel stay even easier
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {data.features?.map((feature, index) => {
                const Icon = iconMap[feature.icon] || Clock;
                return (
                  <FeatureCard
                    key={index}
                    Icon={Icon}
                    title={feature.title}
                    description={feature.description}
                  />
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
