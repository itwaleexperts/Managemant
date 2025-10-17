import React, { useEffect, useState } from 'react';
import { ChevronDown, MapPin, User, Wifi, Coffee, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="flex justify-between items-center w-full py-4 text-left font-medium text-gray-800 hover:text-orange-500 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          <ChevronDown className={`w-4 h-4 mr-2 transition-transform ${isOpen ? 'rotate-180 text-orange-500' : 'text-gray-400'}`} />
          {question}
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 pl-6 text-gray-600">
          {answer}
        </div>
      )}
    </div>
  );
};

const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const staticFaqs = [
    {
      category: "Your Booking",
      question: "How do I amend my booking?",
      answer: "This is the fallback answer for amending your booking."
    },
    {
      category: "At The Hotel",
      question: "Is breakfast available?",
      answer: "This is the fallback answer for breakfast availability."
    },
    {
      category: "Your Stay",
      question: "What is the maximum number of people per room?",
      answer: "This is the fallback answer for occupancy."
    }
  ];

  useEffect(() => {
    axios.get('https://apiyatraadda.jaspersoftwaresolutions.com/api/faq')
      .then(res => {
        const data = res.data?.length ? res.data : staticFaqs;
        setFaqs(data);
        setActiveCategory(data[0]?.category || 'Your Booking');
      })
      .catch(() => {
        setFaqs(staticFaqs);
        setActiveCategory(staticFaqs[0].category);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600">Loading FAQs...</div>
    );
  }

  const categories = [...new Set(faqs.map(f => f.category))];

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Your Booking': return <Star className="w-4 h-4 mr-2" />;
      case 'At The Hotel': return <MapPin className="w-4 h-4 mr-2" />;
      case 'Your Stay': return <User className="w-4 h-4 mr-2" />;
      case 'Our Rooms': return <Wifi className="w-4 h-4 mr-2" />;
      case 'Our Pricing': return <Coffee className="w-4 h-4 mr-2" />;
      default: return <ChevronDown className="w-4 h-4 mr-2" />;
    }
  };

  const filteredFaqs = faqs.filter(f => f.category === activeCategory);

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col bg-white">
        <div className="bg-black py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-light text-white uppercase text-center">FAQ's</h1>
          </div>
        </div>

        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-1/4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h2 className="text-sm font-semibold text-gray-600 uppercase mb-4 tracking-wider">All Questions</h2>
                <ul className="space-y-1">
                  {categories.map(category => (
                    <li key={category}>
                      <button
                        className={`flex items-center w-full py-2 px-3 text-left rounded transition-colors text-sm ${
                          activeCategory === category
                            ? 'bg-orange-500 text-white font-semibold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveCategory(category)}
                      >
                        {getCategoryIcon(category)}
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <section className="lg:w-3/4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">{activeCategory}</h2>
              <div className="space-y-0">
                {filteredFaqs.map((faq, idx) => (
                  <FaqItem key={faq._id || idx} question={faq.question} answer={faq.answer} />
                ))}
              </div>

              <div className="mt-8 text-right">
                <a href="#" className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors">
                  Didn't find what you were looking for? Contact us
                </a>
              </div>
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default Faq;
