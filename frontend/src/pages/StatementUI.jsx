import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const ModernSlaveryStatement = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatement = async () => {
      try {
        const res = await axios.get('https://apiyatraadda.jaspersoftwaresolutions.com/api/statement'); 
        setSections(res.data); 
      } catch (err) {
        console.error('Failed to fetch Modern Slavery Statement:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatement();
  }, []);

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans text-gray-700 mt-5">
        <div className="bg-black py-4">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
              Modern Slavery Statement
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 py-10 max-w-4xl space-y-8">
          {sections.map((sec) => (
            <section key={sec._id} className="space-y-4 pt-4 border-t border-gray-100">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">{sec.section}</h2>
              {sec.content && <p className="leading-relaxed">{sec.content}</p>}
              {sec.listItems && sec.listItems.length > 0 && (
                <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                  {sec.listItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ModernSlaveryStatement;
