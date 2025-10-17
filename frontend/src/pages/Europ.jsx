import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ImageTextBlock = ({ imageUrl, title, text, imageOnLeft = true }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-10">
    <div
      className={`${
        imageOnLeft ? "md:order-1" : "md:order-2"
      } rounded-lg overflow-hidden shadow-lg`}
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-52 sm:h-64 object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div
      className={`${
        imageOnLeft ? "md:order-2" : "md:order-1"
      } space-y-3 text-center md:text-left`}
    >
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{text}</p>
    </div>
  </div>
);

export default function EuropeTravelGuideUI() {
  const [guideData, setGuideData] = useState(null);
  const [loading, setLoading] = useState(true);

  const staticData = {
    heroTitle: "Explore Europe with easyHotel",
    guideSections: [
      {
        imageUrl: "https://picsum.photos/400/300?random=201",
        title: "Vibrant Nightlife",
        text: "European cities come alive after dark. From Paris cocktail bars to Berlin clubs, the continent is buzzing with nightlife.",
        imageOnLeft: true,
      },
      {
        imageUrl: "https://picsum.photos/400/300?random=202",
        title: "Easy Travel Across Borders",
        text: "The Schengen Area makes European travel seamless — hop between capitals affordably with easyHotel stays.",
        imageOnLeft: false,
      },
      {
        imageUrl: "https://picsum.photos/400/300?random=203",
        title: "Canals and Waterways",
        text: "Explore cities like Amsterdam and Venice by boat for unforgettable canal views and charm.",
        imageOnLeft: true,
      },
      {
        imageUrl: "https://picsum.photos/400/300?random=204",
        title: "Culinary Exploration",
        text: "Sample cheeses, pastries, and local delicacies at Europe’s vibrant food markets — from Lisbon to London.",
        imageOnLeft: false,
      },
      {
        imageUrl: "https://picsum.photos/400/300?random=205",
        title: "Historic Architecture",
        text: "Marvel at centuries-old architecture, from Roman ruins to Baroque palaces across the continent.",
        imageOnLeft: true,
      },
      {
        imageUrl: "https://picsum.photos/400/300?random=206",
        title: "Art and Museums",
        text: "See masterpieces in the Louvre, the Vatican Museums, and vibrant street art scenes in cities like Berlin.",
        imageOnLeft: false,
      },
      {
        imageUrl: "https://picsum.photos/400/300?random=207",
        title: "Iconic City Squares",
        text: "Enjoy Europe’s social heart — the piazzas and plazas perfect for coffee, music, and people-watching.",
        imageOnLeft: true,
      },
      {
        imageUrl: "https://picsum.photos/400/300?random=208",
        title: "Charming Old Towns",
        text: "Wander through cobbled streets and colorful facades in cities like Prague, Rome, and Edinburgh.",
        imageOnLeft: false,
      },
      {
        imageUrl: "https://picsum.photos/400/300?random=209",
        title: "Beautiful Gardens",
        text: "Relax in Europe’s manicured parks and royal gardens — perfect for a tranquil afternoon stroll.",
        imageOnLeft: true,
      },
      {
        imageUrl: "https://picsum.photos/400/300?random=210",
        title: "Romantic European Streets",
        text: "Discover quiet, lantern-lit alleys in Paris, Venice, and Rome — Europe’s timeless romance lives here.",
        imageOnLeft: false,
      },
    ],
  };

  useEffect(() => {
    axios
      .get("https://apiyatraadda.jaspersoftwaresolutions.com/api/europe/get")
      .then((res) => {
        console.log("Europe Guide API Response:", res.data);
        const data = res.data.data?.[0];
        setGuideData(data || staticData);
      })
      .catch((err) => {
        console.error("Error fetching Europe guide:", err);
        setGuideData(staticData);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="text-center py-20 text-gray-600">Loading...</div>;

  const data = guideData || staticData;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white font-sans text-gray-700">
        <div
          className="relative bg-cover bg-center py-16 sm:py-24"
          style={{
            backgroundImage: `url('https://picsum.photos/seed/europe-bg/1200/400')`,
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative container mx-auto px-4 max-w-6xl text-center">
            <h1 className="text-3xl sm:text-6xl font-extrabold text-white tracking-wide">
              {data.heroTitle || "Explore Europe"}
            </h1>
            <p className="text-white mt-3 text-lg font-light">
              Travel Guides & Inspiration
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 max-w-5xl text-center space-y-4">
          <h2 className="text-xl font-bold text-orange-500 uppercase tracking-wide">
            EXPLORE EUROPE
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Europe is a continent of rich history, diverse culture, and endless
            adventure. From the romantic canals of Amsterdam to the ancient
            streets of Rome, easyHotel helps you discover Europe without
            breaking the bank.
          </p>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {data.guideSections?.map((section, index) => (
            <ImageTextBlock
              key={section._id || index}
              imageUrl={section.imageUrl}
              title={section.title}
              text={
                section.text ||
                "Discover the charm and diversity of Europe in every destination."
              }
              imageOnLeft={section.imageOnLeft}
            />
          ))}

          <div className="text-center pt-10 text-lg sm:text-xl font-bold text-gray-800">
            Book your great value stay and start exploring Europe today!
          </div>
        </div>

        <div className="bg-orange-500 py-10 mt-12">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-white text-xl font-semibold">
              Your easy European adventure starts here.
            </h3>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
