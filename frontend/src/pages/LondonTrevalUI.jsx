import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const ImageTextBlock = ({ imageUrl, title, text, imageOnLeft = true }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start mb-8">
    <div className={`${imageOnLeft ? "md:order-1" : "md:order-2"} rounded-lg overflow-hidden shadow-md`}>
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
    </div>
    <div className={`${imageOnLeft ? "md:order-2" : "md:order-1"} space-y-2`}>
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-600">{text}</p>
    </div>
  </div>
);

const LondonTravelGuideUI = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://apiyatraadda.jaspersoftwaresolutions.com/api/london");
        if (res.data.success) {
          setData(res.data.data[0]); 
        } else {
          setError("Failed to load data");
        }
      } catch (err) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans text-gray-700">

        <div
          className="relative bg-cover bg-center py-16"
          style={{
            backgroundImage: `url('${data?.heroBanner?.imageUrl}')`,
            backgroundBlendMode: "multiply",
            filter: "brightness(70%)",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative container mx-auto px-4 md:px-8 max-w-6xl text-center">
            <h1 className="text-3xl md:text-6xl font-extrabold text-white tracking-wider">
              {data?.heroBanner?.title}
            </h1>
            <p className="text-white mt-2">{data?.heroBanner?.subtitle}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl text-center">
          <p className="text-gray-600 leading-relaxed">{data?.introduction}</p>
        </div>

        <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
          {data?.guideSections?.map((section) => (
            <ImageTextBlock
              key={section._id}
              imageUrl={section.imageUrl}
              title={section.title}
              text={section.text}
              imageOnLeft={section.imageOnLeft}
            />
          ))}

          {data?.guideSections?.find(section => section.closingTagline) && (
            <div className="text-center pt-10 text-xl font-bold text-gray-800">
              {data.guideSections.find(section => section.closingTagline).closingTagline}
            </div>
          )}
        </div>

        {data?.preFooter && (
          <div className="bg-orange-500 py-10 mt-12">
            <div className="container mx-auto px-4 md:px-8 text-center">
              <h3 className="text-white text-xl font-bold">{data.preFooter.text}</h3>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </>
  );
};

export default LondonTravelGuideUI;
