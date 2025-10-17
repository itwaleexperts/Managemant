import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const CookiePolicy = () => {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://apiyatraadda.jaspersoftwaresolutions.com/api/cookie/get")
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          setPolicy(res.data.data[res.data.data.length - 1]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading cookie policy:", err);
        setError("Failed to load cookie policy.");
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
      <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800 leading-relaxed">
        <h1 className="text-3xl font-bold mb-8 text-center">{policy?.title}</h1>

        {policy?.sections?.map((section) => (
          <section key={section._id} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{section.heading}</h2>
            {section.content.includes(",") ? (
              <ul className="list-disc pl-6 space-y-1">
                {section.content.split(",").map((item, i) => (
                  <li key={i}>{item.trim()}</li>
                ))}
              </ul>
            ) : (
              <p>{section.content}</p>
            )}
          </section>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default CookiePolicy;
