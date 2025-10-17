import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const SiteMap = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await axios.get('https://apiyatraadda.jaspersoftwaresolutions.com/api/sitemap'); 
        setLinks(res.data); 
      } catch (err) {
        console.error('Failed to fetch sitemap links:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  const column1 = links.filter((item) => item.column === 'column1');
  const column2 = links.filter((item) => item.column === 'column2');

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-white">
        <div className="bg-neutral-900 py-20 px-6">
          <h1 className="text-5xl font-extrabold text-white text-center mb-6 pb-4 relative">
            Site Map
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-blue-500"></span>
          </h1>
        </div>

        <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-6 px-6">
          <div className="space-y-3">
            {column1.map((item) => (
              <a
                key={item._id}
                href={`#${item.link.toLowerCase().replace(/\s/g, '-')}`}
                className="block text-lg text-blue-600 hover:text-orange-700 transition duration-200 font-medium"
              >
                {item.link}
              </a>
            ))}
          </div>

          <div className="space-y-3">
            {column2.map((item) => (
              <a
                key={item._id}
                href={`#${item.link.toLowerCase().replace(/\s/g, '-')}`}
                className="block text-lg text-blue-600 hover:text-orange-700 transition duration-200 font-medium"
              >
                {item.link}
              </a>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SiteMap;
