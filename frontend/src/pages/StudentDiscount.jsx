import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const StudentDiscount = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const res = await axios.get('https://apiyatraadda.jaspersoftwaresolutions.com/api/discount/get'); 
        if (res.data.success) {
          setPageData(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!pageData) return <div className="min-h-screen flex items-center justify-center">No data available</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
          
          <div className="flex items-center justify-between mb-8">
            <a href="/" className="text-sm font-semibold text-gray-600 hover:text-orange-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
              </svg>
              easyHotel homepage
            </a>
            <div className="bg-orange-500 text-white font-bold p-2 rounded text-lg">easyHotel</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            <div className="w-full rounded-lg overflow-hidden shadow-xl">
              <img 
                src={pageData.heroImage} 
                alt="Student Discount Hero" 
                className="w-full h-auto object-cover" 
              />
            </div>

            <div className="w-full bg-white p-8 rounded-lg shadow-xl border border-gray-100 sticky top-10">
              <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
                <span className="text-orange-500">{pageData.headerText}</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">{pageData.description}</p>

              {pageData.discounts?.map((item) => (
                <a
                  key={item._id}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-4 mb-4 border border-gray-300 rounded-lg text-gray-800 font-semibold hover:border-orange-500 transition duration-150"
                >
                  <span className="flex items-center">
                    <svg className="w-6 h-6 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h-7a4 4 0 01-4-4V5a2 2 0 012-2h10a2 2 0 012 2v11a4 4 0 01-4 4zM8 9h8m-8 4h8m-8 4h4"/>
                    </svg>
                    {item.title}
                  </span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </a>
              ))}

              <div className="text-center space-y-3 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Powered by <strong className="text-blue-600">{pageData.poweredBy}</strong></p>
                <a href={pageData.helpCenterLink} className="text-sm text-gray-500 hover:text-blue-600 flex items-center justify-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9.247a1 1 0 01.113 1.341l-.29.412a1 1 0 01-1.742-1.222l.29-.412a1 1 0 011.33-.111zM10.228 14.247a1 1 0 01.113 1.341l-.29.412a1 1 0 01-1.742-1.222l.29-.412a1 1 0 011.33-.111zM12 21a9 9 0 100-18 9 9 0 000 18z"/>
                  </svg>
                  Need help? Visit our help center
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StudentDiscount;
