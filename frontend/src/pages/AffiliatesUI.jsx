import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const AffiliatesUI = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const staticData = {
    hero: {
      brand: "easyHotel",
      title: "Affiliates",
      subtitle: "Join our affiliate programme and earn commission"
    },
    intro: "At easyHotel we like to reward affiliates who market our hotels on their websites. You'll earn cash for each customer sale brought to us through your site. Becoming an affiliate is free.",
    sections: [
      {
        heading: "What is affiliate marketing?",
        content: "You'll earn cash for each customer sale brought to us through your site. Becoming an affiliate is free."
      },
      {
        heading: "Easy steps to sign up",
        content: "Visit the affiliate network, use code 0531 and search program ID 7594."
      }
    ],
    signup: {
      signupUrl: "https://example-affiliate-network.com",
      signupCode: "0531",
      programId: "7594"
    },
    paymentInfo: {
      currency: "GBP",
      paymentCycle: "Monthly"
    },
    contact: {
      email: "affiliate@easyhotel.com"
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://apiyatraadda.jaspersoftwaresolutions.com/api/affilits/");
        if (res.data.success && res.data.data) {
          setData(res.data.data);
        } else {
          setData(staticData); 
        }
      } catch (err) {
        console.error("Error fetching affiliate data:", err);
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
      <Navbar/>

      <div className="min-h-screen bg-white font-sans text-gray-700 mt-5">

        <div className="bg-black py-16">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl text-center">
            <span className="text-sm font-semibold text-orange-500 block mb-2">{data.hero.brand}</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-wide">{data.hero.title}</h1>
            {data.hero.subtitle && (
              <p className="text-white mt-3 text-lg md:text-xl">{data.hero.subtitle}</p>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 py-10 max-w-5xl space-y-10">
          <p className="leading-relaxed">{data.intro}</p>

          {data.sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">{section.heading}</h2>
              <p className="leading-relaxed">{section.content}</p>
            </section>
          ))}

          {data.signup && (
            <section className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Sign Up</h2>
              <p className="leading-relaxed">
                Signing up is easy and <strong>FREE</strong>. Visit{' '}
                <a href={data.signup.signupUrl} className="text-blue-600 hover:text-orange-500 font-medium" target="_blank" rel="noopener noreferrer">
                  Affiliate Network
                </a>
                , use code <strong>{data.signup.signupCode}</strong> and search program ID <strong>{data.signup.programId}</strong>.
              </p>
            </section>
          )}

          {data.paymentInfo && (
            <section className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Payment Info</h2>
              <p className="leading-relaxed">
                Payments are made in <strong>{data.paymentInfo.currency}</strong> on a <strong>{data.paymentInfo.paymentCycle}</strong> basis.
              </p>
            </section>
          )}

          {data.contact && (
            <section className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Contact</h2>
              <p className="leading-relaxed">
                For queries, email us at <strong>{data.contact.email}</strong>.
              </p>
            </section>
          )}

        </div>
      </div>

      <Footer/>
    </>
  );
};

export default AffiliatesUI;
