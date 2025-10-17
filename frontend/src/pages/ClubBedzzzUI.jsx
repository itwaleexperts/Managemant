import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const ClubBedzzzUI = () => {
  const [clubData, setClubData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        const response = await axios.get("https://apiyatraadda.jaspersoftwaresolutions.com/api/clubedzz/"); 
        setClubData(response.data);
      } catch (error) {
        console.error("Error fetching club data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubData();
  }, []);

  if (loading) return <p className="text-center py-10 text-gray-600">Loading...</p>;
  if (!clubData) return <p className="text-center py-10 text-red-500">No data available</p>;

  const { hero, intro, valueProposition, membershipBenefits, howItWorks, disclaimer } = clubData;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans text-gray-700 mt-5">
        <div className="relative w-full">
          <img
            src={hero?.img}
            alt={hero?.title || "clubBedzzz Hero"}
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-wider bg-orange-500 bg-opacity-70 p-4 rounded-lg">
              {hero?.title}
            </h1>
            {hero?.subtitle && (
              <p className="text-white text-lg mt-2 font-light">{hero.subtitle}</p>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 py-10 max-w-4xl space-y-6 text-center">
          <p className="text-xl font-light text-gray-600">{intro}</p>
          <p className="text-lg leading-relaxed text-gray-700">{valueProposition}</p>
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-4xl py-6">
          <h2 className="text-3xl font-extrabold text-gray-800">{hero?.title}</h2>
          <p className="text-lg leading-relaxed text-gray-700 mt-2">{howItWorks}</p>
        </div>

        <div className="bg-gray-50 py-10">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl space-y-6">
            <p className="font-semibold text-lg text-gray-800">
              As a member of {hero?.title}, you'll benefit from:
            </p>

            {membershipBenefits?.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-5 border-l-4 border-orange-500 shadow-md"
              >
                <h3 className="text-xl font-bold text-gray-800">{benefit.title}</h3>
                {benefit.description && (
                  <p className="text-gray-600 mt-2">{benefit.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 py-10 max-w-4xl space-y-4">
          <p className="leading-relaxed text-gray-700">
            Once you have an account, make sure you're <strong>logged in</strong> on our site to see the discounted rates.
          </p>
          <p className="leading-relaxed text-gray-700">
            Sign up for our newsletter to stay updated on exclusive offers.
          </p>

          <p className="text-sm italic text-gray-500 mt-8">{disclaimer}</p>
        </div>

        <div className="bg-orange-500 py-10 mt-12">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h3 className="text-white text-xl font-bold">
              Join {hero?.title} Today and Start Saving!
            </h3>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ClubBedzzzUI;
