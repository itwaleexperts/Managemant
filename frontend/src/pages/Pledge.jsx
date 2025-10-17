
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const SustainabilityUI = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://apiyatraadda.jaspersoftwaresolutions.com/api/pledge");
        setData(res.data?.data?.[0]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching sustainability data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!data) return <div className="text-center py-20">No data available.</div>;

  return (
    <>
      <Navbar />
      <div className="font-sans text-gray-800 mt-5">

        <section className="relative h-64 md:h-96">
          <img
            src={data.hero.imageUrl}
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <h1 className="text-2xl md:text-4xl font-bold text-white text-center">
              {data.hero.heading}
            </h1>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p>{data.hero.introText}</p>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            What we’re doing right now
          </h2>
          <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6">
            {data.currentActions.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm flex-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-10 text-center">
          <h2 className="text-2xl font-bold mb-6">
            Meet the easyHotel Low-Carbon Committee
          </h2>
          <p className="mb-8">
            We’ll work today to cut and win it in the long haul. From construction
            to check-out, we’re rolling out projects that reduce emissions and
            improve energy usage.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
            {data.committeeMembers.map((member) => (
              <div key={member._id} className="p-2 flex items-center gap-4">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p>{member.name}</p>
                  <p className="text-xs text-gray-500">{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold text-center mb-8">
            They’ve been working on…
          </h2>
          <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6">
            {data.pastProjects.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold text-center mb-8">
            What we have planned
          </h2>
          <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6">
            {data.futurePlans.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-10 text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            {data.ctaButtons.map((btn) => (
              <button
                key={btn._id}
                className={`px-6 py-2 rounded ${
                  btn.type === "primary"
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "border border-gray-400 hover:bg-gray-100"
                } transition`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};

export default SustainabilityUI;
