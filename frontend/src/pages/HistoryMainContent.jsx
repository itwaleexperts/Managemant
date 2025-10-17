import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const HistoryMainBody = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://apiyatraadda.jaspersoftwaresolutions.com/api/history") 
      .then((res) => {
        setData(res.data); 
      })
      .catch((err) => console.error("Error fetching history:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-600">
        Loading History Page...
      </div>
    );

  if (!data)
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load history content.
      </div>
    );

  const { heroBanner, videos, textSections, callToAction } = data;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white font-sans">

        <div
          className="relative bg-cover bg-center pt-20 pb-16"
          style={{
            backgroundImage: `url('${heroBanner?.imageUrl || "https://picsum.photos/1300/600"}')`,
            backgroundBlendMode: "multiply",
            filter: "grayscale(100%) brightness(90%)",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-center z-10 px-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white">
              {heroBanner?.overlayText || "Learn History the Easy Way"}
            </h1>
          </div>

          <div className="container mx-auto px-4 mt-20 flex justify-center">
            {videos?.map((video) => (
              <div
                key={video._id}
                className="w-full max-w-4xl shadow-2xl relative"
                style={{ aspectRatio: "16/9", maxHeight: "500px" }}
              >
                <iframe
                  src={video.url}
                  title={video.title}
                  allowFullScreen
                  className="w-full h-full absolute inset-0"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black py-16 text-center">
          <h2 className="text-white text-3xl font-bold uppercase tracking-wide mb-6">
            {callToAction?.title || "Get Your Easy History Lesson"}
          </h2>
          <button className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-orange-600 transition duration-200 shadow-xl">
            {callToAction?.buttonText || "Subscribe Now"}
          </button>
        </div>

        <div className="container mx-auto px-4 md:px-8 py-16 max-w-4xl space-y-16">
          {textSections?.map((section) => (
            <div key={section._id} className="space-y-4">
              {section.imageUrl && (
                <div className="bg-white border border-gray-200 h-96 shadow-lg overflow-hidden">
                  <img
                    src={section.imageUrl}
                    alt={section.heading}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/800x600";
                    }}
                  />
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                {section.heading}
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="bg-orange-500 py-10 text-center">
          <h2 className="text-white text-3xl font-bold">Discover Easy Learning Today</h2>
          <p className="text-white mt-2">Join millions learning history the easy way.</p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default HistoryMainBody;
