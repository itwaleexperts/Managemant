import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const AboutUs = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  const staticData = {
    heroImage: "https://picsum.photos/1200/500",
    heroTitle: "About Us",
    introText: "We’re all about making hotels easy! Offering affordable, eco-friendly stays across Europe.",
    fastFacts: [
      { _id: "1", icon: "🏨", title: "c.50 Hotels" },
      { _id: "2", icon: "📍", title: "11 countries" },
      { _id: "3", icon: "👥", title: "Approximately 1.2 million guests in 2024" },
      { _id: "4", icon: "♻️", title: "0 Single-use Plastic in guest areas" },
    ],
    sections: [
      {
        _id: "1",
        title: "We’re super easy, super value and super low-carbon",
        description: "Get ready for a great night’s sleep in our space saving rooms with core comforts.",
        image: "https://picsum.photos/600/500",
        buttonText: "Read more →",
      },
      {
        _id: "2",
        title: "We plan to keep growing",
        description: "From our beginnings, our expansion across Europe keeps rolling with new hotels opening.",
        image: "https://picsum.photos/600/400",
        buttonText: "Read more →",
      },
    ],
    ctaCards: [
      { _id: "1", icon: "🌿", title: "Leading the way with low carbon", buttonText: "FIND OUT MORE" },
      { _id: "2", icon: "👥", title: "Meet our executive team", buttonText: "FIND OUT MORE" },
      { _id: "3", icon: "💼", title: "Join our team", buttonText: "EXPLORE JOBS" },
    ],
    banner: {
      image: "https://picsum.photos/1100/500",
      text: "easyHotel, and the city is yours.",
    },
  };

  const backendURL = "https://apiyatraadda.jaspersoftwaresolutions.com";

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/about/get`);
        if (res.data.success && res.data.data) {
          setAboutData(res.data.data);
          console.log(res.data.data);
        } else {
          setAboutData(staticData);
        }
      } catch (err) {
        console.error("Error fetching about data:", err);
        setAboutData(staticData);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!aboutData) return <div className="text-center py-10">No data found!</div>;

  const getImageUrl = (path, fallback) => {
    if (!path) return fallback;
    if (path.startsWith("http")) return path; 
    return `${backendURL}${path}`; 
  };

  return (
    <>
      <Navbar />
      <div className="w-full bg-white text-gray-800 font-sans mt-5">

        <section className="relative h-[300px] w-full">
          <img
            src={getImageUrl(aboutData.heroImage, staticData.heroImage)}
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-white text-4xl font-bold">{aboutData.heroTitle}</h1>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-10 text-center">
          <p className="text-base text-gray-700 leading-relaxed max-w-3xl mx-auto">
            {aboutData.introText}
          </p>
        </section>

        {aboutData.fastFacts?.length > 0 && (
          <section className="max-w-6xl mx-auto py-12 text-center px-4">
            <h2 className="text-2xl font-bold mb-10">Fast Facts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
              {aboutData.fastFacts.map((fact) => (
                <div key={fact._id} className="flex flex-col items-center gap-3">
                  <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center text-4xl">
                    {fact.icon}
                  </div>
                  <p className="font-semibold text-sm md:text-base max-w-[180px]">{fact.title}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {aboutData.sections?.length > 0 &&
          aboutData.sections.map((sec, idx) => (
            <section
              key={sec._id}
              className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center py-12 px-4"
            >
              {idx % 2 === 0 ? (
                <>
                  <img src={getImageUrl(sec.image, "https://picsum.photos/600/500")} alt={sec.title} className="rounded-lg w-full" />
                  <div>
                    <h3 className="text-xl font-bold mb-3">{sec.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{sec.description}</p>
                    <button className="text-orange-600 font-bold flex items-center gap-1 text-sm">{sec.buttonText}</button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-xl font-bold mb-3">{sec.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{sec.description}</p>
                    <button className="text-orange-600 font-bold flex items-center gap-1 text-sm">{sec.buttonText}</button>
                  </div>
                  <img src={getImageUrl(sec.image, "https://picsum.photos/600/400")} alt={sec.title} className="rounded-lg w-full" />
                </>
              )}
            </section>
          ))}

        {aboutData.ctaCards?.length > 0 && (
          <section className="max-w-6xl mx-auto py-12 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center mb-6">
              {aboutData.ctaCards.map((card) => (
                <div key={card._id} className="border rounded-lg p-6 flex flex-col items-center justify-between h-full">
                  <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-3">
                    {card.icon}
                  </div>
                  <p className="text-sm font-semibold mb-3">{card.title}</p>
                  <button className="text-orange-600 font-bold text-xs">{card.buttonText}</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {aboutData.banner && (
          <section className="relative h-[250px] w-full mt-8">
            <img src={getImageUrl(aboutData.banner.image, "https://picsum.photos/1100/500")} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0  flex items-center justify-center">
              <h2 className="text-white text-2xl font-bold text-center px-4">{aboutData.banner.text}</h2>
            </div>
          </section>
        )}

      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
