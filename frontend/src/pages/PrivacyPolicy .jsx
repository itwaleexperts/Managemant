import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const PrivacyPolicy = () => {
  const [policyData, setPolicyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await axios.get("https://apiyatraadda.jaspersoftwaresolutions.com/api/privacy/all"); 
 setPolicyData(res.data.data[0]);      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 bg-white">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 border-b pb-4">
          Privacy Policy
        </h1>

        <p className="text-sm text-gray-500 mb-8">
          Last updated: {policyData?.lastUpdated || "N/A"}
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            {policyData?.introduction || "No introduction available."}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">2. The Data We Collect</h2>
          {policyData?.dataWeCollect?.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 pl-4 text-gray-700">
              {policyData.dataWeCollect.map((item) => (
                <li key={item._id}>
                  <strong className="font-semibold">{item.title}:</strong> {item.description}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No data available.</p>
          )}
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">3. How We Use Your Personal Data</h2>
          {policyData?.howWeUseData?.length > 0 ? (
            <ol className="list-decimal list-inside space-y-2 pl-4 text-gray-700">
              {policyData.howWeUseData.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          ) : (
            <p className="text-gray-600">No information available.</p>
          )}
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Your Legal Rights</h2>
          <p className="text-gray-700 leading-relaxed">{policyData?.legalRights || "No legal rights information available."}</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Contact Details</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            If you have any questions about this privacy policy, please contact us at:
          </p>
          <p className="font-semibold text-lg text-indigo-600">{policyData?.contact?.email || "N/A"}</p>
          <p className="text-gray-700">{policyData?.contact?.address || "N/A"}</p>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
