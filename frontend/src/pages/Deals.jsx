import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CurrentOffers = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const imageUrl = "https://apiyatraadda.jaspersoftwaresolutions.com/";

  const getImageUrl = (filename) => {
    if (!filename) return null;
    return `${imageUrl}${filename.replace(/\\/g, "/")}`;
  };

  useEffect(() => {
    axios
      .get("https://apiyatraadda.jaspersoftwaresolutions.com/api/deals/")
      .then((res) => {
        console.log("Backend response:", res.data); 
        setData(res.data); 
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load offers");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <>
      <Navbar />

      <div className="text-center mb-14 bg-orange-700 py-6 mt-10">
        <h2 className="text-4xl font-extrabold text-white">{data?.mainHeading}</h2>
        <p className="text-white mt-3 text-base">{data?.subHeading}</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6 pb-16">
        {data?.offers?.map((offer) => (
          <div key={offer._id} className="flex flex-col items-center text-center max-w-sm mx-auto">
            <div className="w-36 h-36 rounded-full overflow-hidden shadow-md mb-6">
              <img src={getImageUrl(offer.img)} alt={offer.title} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">{offer.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-5 px-2">{offer.desc}</p>
            <button className="border border-orange-500 text-orange-600 px-5 py-2 rounded-md text-xs font-semibold tracking-wide hover:bg-orange-500 hover:text-white transition-colors">
              {offer.btnText}
            </button>
          </div>
        ))}
      </div>

      {data?.extraSection && (
        <div className="bg-orange-700 py-10">
          <h2 className="text-center text-3xl font-bold text-white mb-2">{data.extraSection.heading}</h2>
          <p className="text-center text-white mb-10">{data.extraSection.subText}</p>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-6 py-16">
            <div>
              <img
                src={getImageUrl(data.extraSection.leftImage)}
                alt="Left"
                className="w-full h-64 object-cover rounded-xl shadow-md mb-4"
              />
              <h3 className="text-lg font-bold text-gray-900 mb-2">{data.extraSection.leftTitle}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{data.extraSection.leftDesc}</p>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
                {data.extraSection.leftBtnText}
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{data.extraSection.rightTitle}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{data.extraSection.rightDesc}</p>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors mb-6">
                {data.extraSection.rightBtnText}
              </button>
              <img
                src={getImageUrl(data.extraSection.rightImage)}
                alt="Right"
                className="w-full h-64 object-cover rounded-xl shadow-md"
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default CurrentOffers;
