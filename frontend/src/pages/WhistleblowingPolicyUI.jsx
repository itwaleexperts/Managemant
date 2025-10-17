import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const WhistleblowingPolicy = () => {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await axios.get("https://apiyatraadda.jaspersoftwaresolutions.com/api/whistle"); 
        if (res.data && res.data.length > 0) {
          setPolicy(res.data[0]); 
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch policy:", err);
        setLoading(false);
      }
    };
    fetchPolicy();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!policy) return <div className="min-h-screen flex items-center justify-center">Policy not found.</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans text-gray-700 mt-5">
        
        <div className="bg-black py-4">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
              {policy.title}
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 py-10 max-w-4xl space-y-8">
          {policy.sections && policy.sections.map((section, index) => (
            <section key={section._id} className={`space-y-4 ${index > 0 ? "pt-4 border-t border-gray-100" : ""}`}>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">{section.heading}</h2>
              {section.content && <p className="leading-relaxed">{section.content}</p>}
              {section.listItems && section.listItems.length > 0 && (
                <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                  {section.listItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {policy.policyOwner && (
            <section className="space-y-4 pt-4 border-t border-gray-100">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Policy Owner</h2>
              <p className="leading-relaxed">{policy.policyOwner}</p>
            </section>
          )}
          {policy.reviewDate && (
            <section className="space-y-4 pt-4 border-t border-gray-100">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Policy Review Date</h2>
              <p className="leading-relaxed">{policy.reviewDate}</p>
            </section>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WhistleblowingPolicy;
