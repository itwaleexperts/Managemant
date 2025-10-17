import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const SupplierCodeOfConductUI = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://apiyatraadda.jaspersoftwaresolutions.com/api/supplier")
      .then((res) => {
    setData(res.data.data); 
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load data.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white font-sans text-gray-700 mt-5">
        <div className="bg-black py-6 md:py-10">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-bold text-white tracking-wide">
              {data?.hero?.title}
            </h1>
            {data?.hero?.subtitle && (
              <p className="text-gray-300 mt-2 text-sm md:text-base">
                {data.hero.subtitle}
              </p>
            )}
          </div>
        </div>

        {data?.hero?.introduction && (
          <div className="container mx-auto px-4 md:px-8 py-10 max-w-4xl">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
              Introduction
            </h2>
            <p className="leading-relaxed">{data.hero.introduction}</p>
          </div>
        )}

        <div className="container mx-auto px-4 md:px-8 pb-10 max-w-4xl space-y-10">
          {data.sections?.map((section, index) => (
            <section
              key={index}
              className="space-y-3 pt-6 border-t border-gray-200"
            >
              <h2 className="text-lg md:text-2xl font-bold text-gray-800">
                {index + 1}. {section.title}
              </h2>
              <p className="leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>

        {data?.footerMessage && (
          <div className="bg-orange-500 py-10 mt-8">
            <div className="container mx-auto px-4 md:px-8 text-center">
              <h3 className="text-white text-lg md:text-xl font-semibold">
                {data.footerMessage}
              </h3>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default SupplierCodeOfConductUI;
