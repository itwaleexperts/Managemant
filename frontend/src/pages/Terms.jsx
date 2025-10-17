import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const TermsAndCondition = () => {
  const [termsData, setTermsData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await axios.get('https://apiyatraadda.jaspersoftwaresolutions.com/api/terms'); 
        if (res.data.success) {
          setTermsData(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!Object.keys(termsData).length) return <div className="min-h-screen flex items-center justify-center">No data available</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <div className="bg-black text-white p-20 text-center">
          <h1 className="text-4xl font-bold mb-4 font-serif">Terms and Conditions</h1>
        </div>

        <div className="bg-white text-black p-8">
          <div className="max-w-6xl mx-auto space-y-12">
            <p className="text-gray-600 text-center mb-12 font-serif text-lg">
              Please select the relevant Terms and Conditions for your hotel below.
            </p>

            {Object.keys(termsData).map((country) => (
              <div key={country}>
                <h2 className="text-lg font-bold text-blue-600 mb-4">{country}</h2>
                <ul className="space-y-2 font-semibold">
                  {termsData[country].map((hotel) => (
                    <li
                      key={hotel._id}
                      className={hotel.highlight ? 'text-orange-500' : 'text-black'}
                    >
                      {hotel.hotelName}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsAndCondition;
