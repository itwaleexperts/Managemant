import React, { useEffect, useState } from "react";
import { Apple, Key, Zap, Clock, Smartphone, ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const iconMap = { Key, Zap, Clock, Smartphone };

const FeatureChip = ({ Icon, title, description }) => (
  <div className="flex flex-col p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
    <Icon className="w-6 h-6 text-orange-500 mb-3" />
    <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const FAQItem = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        className="flex justify-between items-start w-full py-4 text-left font-medium text-gray-800 hover:text-orange-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex-1 pr-4">{title}</span>
        <ChevronDown
          className={`w-5 h-5 mt-1 transition-transform ${
            isOpen ? "rotate-180 text-orange-600" : "text-gray-500"
          }`}
        />
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600">
          <p>{content}</p>
        </div>
      )}
    </div>
  );
};

export default function DigitalKey() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://apiyatraadda.jaspersoftwaresolutions.com/api/digital/get")
      .then((res) => {
        console.log("Digital Key Data:", res.data);
        const data = res.data.data?.[0]; 
        setPageData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching DigitalKey data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!pageData)
    return (
      <div className="text-center py-20 text-red-600">No data found</div>
    );

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col bg-white font-sans">
        <section className="bg-orange-500 py-16 sm:py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">
              {pageData.heroTitle}
            </h1>
            <p className="text-lg text-white mb-12 max-w-2xl mx-auto">
              {pageData.introText}
            </p>

            <div className="flex justify-center -mb-24 sm:-mb-32">
              {pageData.heroImageUrls?.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Hero ${i}`}
                  className={`${
                    i === 0
                      ? "w-40 sm:w-56 rounded-3xl transform rotate-3"
                      : "w-20 sm:w-28 rounded-xl transform -rotate-6 ml-4 mt-8"
                  } h-auto object-contain shadow-2xl`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white pt-12 pb-16 sm:pt-24 sm:pb-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Making your Hotel Stay even Easier
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pageData.features?.map((feature) => {
                const Icon = iconMap[feature.iconName] || Key;
                return (
                  <FeatureChip
                    key={feature._id}
                    Icon={Icon}
                    title={feature.title}
                    description={feature.description}
                  />
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-orange-600 py-16 sm:py-20 relative">
          <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-3xl font-extrabold mb-4">
                {pageData.setupGuide?.title}
              </h2>
              <p className="text-lg opacity-90 mb-6">
                {pageData.setupGuide?.description}
              </p>
              <div className="flex items-center space-x-2 text-white font-semibold">
                <Apple className="w-5 h-5" />
                <span>Apple Wallet Required</span>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img
                src={pageData.setupGuide?.imageUrl}
                alt="Setup Guide"
                className="w-full max-w-xs sm:max-w-md h-auto object-contain shadow-2xl rounded-3xl"
              />
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-12 sm:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">FAQ</h2>
            <div className="bg-white rounded-xl shadow-lg divide-y divide-gray-100 p-4 sm:p-6">
              {pageData.faq?.map((item) => (
                <FAQItem
                  key={item._id}
                  title={item.question}
                  content={item.answer}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
