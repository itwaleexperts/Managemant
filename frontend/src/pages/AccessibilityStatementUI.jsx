import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const AccessibilityStatementUI = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const staticData = {
    title: "Accessibility Statement",
    intro: "Our commitment to accessibility across all digital platforms.",
    digitalPolicy: {
      heading: "Digital Accessibility Policy",
      points: [
        "Apply WCAG 2.1 AA standards",
        "Regular audits and testing",
      ]
    },
    limitations: {
      heading: "Limitations and Known Issues",
      points: [
        "Third-party booking tools may not fully comply"
      ]
    },
    compliance: "Partially conformant with WCAG 2.1 AA",
    preparation: "This statement was prepared on 01-Oct-2025",
    contact: {
      email: "accessibility@easyhotel.com",
      address: "123 London Road, UK",
      phone: "+44 123456789"
    },
    technicalSpec: ["Chrome", "Firefox", "Edge"],
    focusAreas: ["Keyboard navigation", "Colour contrast"],
    commitment: "Reviewed annually",
    navigationTips: ["ARIA attributes", "Descriptive labels"]
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://apiyatraadda.jaspersoftwaresolutions.com/api/accessbility/get");
        if (res.data.success && res.data.data) {
          setData(res.data.data);
        } else {
          setData(staticData); 
        }
      } catch (err) {
        console.error("Error fetching accessibility data:", err);
        setData(staticData); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!data) {
    return <div className="text-center py-10">No data found!</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans text-gray-700">

        <div className="bg-black py-4">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
              {data.title}
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 py-10 max-w-4xl space-y-8">

          <section className="space-y-4">
            <p className="leading-relaxed">{data.intro}</p>
          </section>

          <section className="space-y-4 pt-4 border-t border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">{data.digitalPolicy.heading}</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
              {data.digitalPolicy.points.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-4 pt-4 border-t border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">{data.limitations.heading}</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
              {data.limitations.points.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-4 pt-4 border-t border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Compliance Status</h2>
            <p>{data.compliance}</p>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 pt-2">Preparation</h2>
            <p>{data.preparation}</p>
          </section>

          <section className="space-y-4 pt-4 border-t border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Contact Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
              <li><strong>Email:</strong> {data.contact.email}</li>
              <li><strong>Address:</strong> {data.contact.address}</li>
              <li><strong>Phone:</strong> {data.contact.phone}</li>
            </ul>
          </section>

          <section className="space-y-4 pt-4 border-t border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Technical Specification and Testing</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
              {data.technicalSpec.map((tech, idx) => <li key={idx}>{tech}</li>)}
            </ul>
          </section>

          <section className="space-y-4 pt-4 border-t border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Focus Areas</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
              {data.focusAreas.map((f, idx) => <li key={idx}>{f}</li>)}
            </ul>
          </section>

          <section className="space-y-4 pt-4 border-t border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Our Ongoing Commitment</h2>
            <p>{data.commitment}</p>
          </section>

          <section className="space-y-4 pt-4 border-t border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Navigation & Page Structure</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
              {data.navigationTips.map((tip, idx) => <li key={idx}>{tip}</li>)}
            </ul>
          </section>

        </div>

        <div className="bg-orange-500 py-10 mt-12">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h3 className="text-white text-xl font-bold">Your access is our priority.</h3>
          </div>
        </div>

      </div>
      <Footer/>
    </>
  );
};

export default AccessibilityStatementUI;
