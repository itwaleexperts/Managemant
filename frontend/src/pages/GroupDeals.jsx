import React, { useEffect, useState } from 'react';
import { Users, Euro, MapPin, Bus, Hotel, ChevronDown, ChevronUp, Wifi } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const OfferCard = ({ Icon, title, description }) => (
  <div className="flex flex-col items-center p-4 bg-orange-50 rounded-xl transition-all duration-300 hover:bg-orange-100/70 shadow-sm border border-orange-200">
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border-4 border-orange-500 mb-2">
      <Icon className="w-5 h-5 text-orange-600" />
    </div>
    <p className="text-sm font-semibold text-gray-800 text-center">{title}</p>
    {description && <p className="text-xs text-gray-500 text-center mt-1">{description}</p>}
  </div>
);

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        className="flex justify-between items-center w-full py-4 text-left font-semibold text-gray-700 hover:text-orange-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-orange-500" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 py-2' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-600 pb-4 pr-6 text-sm">{answer}</p>
      </div>
    </div>
  );
};

const GroupDeals = () => {
  const [hotels, setHotels] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackHotels = [
    { name: "Glasgow City Centre", country: "Scotland, UK", image: "https://picsum.photos/400/300?random=1" },
    { name: "München City Centre", country: "Germany, Europe", image: "https://picsum.photos/400/300?random=2" },
  ];

  const fallbackFaqs = [
    { question: "What is the maximum number of people in a group?", answer: "A group is 6 or more rooms." },
    { question: "How do I get a quote?", answer: "Submit an enquiry via form or email." },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hotelsRes = await axios.get('https://apiyatraadda.jaspersoftwaresolutions.com/api/group/deals');
        const faqsRes = await axios.get('https://apiyatraadda.jaspersoftwaresolutions.com/api/faq');

        setHotels(hotelsRes.data?.length ? hotelsRes.data : fallbackHotels);
        setFaqs(faqsRes.data?.length ? faqsRes.data : fallbackFaqs);
      } catch (err) {
        setHotels(fallbackHotels);
        setFaqs(fallbackFaqs);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-600">Loading Group Deals...</div>;

  const handleSubmit = () => console.log("Group enquiry submitted.");

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col bg-white font-sans">
        <section className="relative py-20 sm:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-orange-600/90"></div>
          <img
            src="https://picsum.photos/1600/600?random=23"
            alt="Group Booking Hero"
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-50"
          />
          <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6">Group Bookings</h1>
            <p className="text-xl text-gray-100 font-medium">Planning a group trip with 6+ rooms? Stay in the heart of the action!</p>
            <button onClick={handleSubmit} className="mt-8 bg-white text-orange-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors shadow-lg uppercase tracking-wider transform hover:scale-105">
              Submit Enquiry
            </button>
          </div>
        </section>

        <section className="bg-white py-12 sm:py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Why choose easyHotel for your group booking?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <OfferCard Icon={Euro} title="65+ hotels across Europe" />
              <OfferCard Icon={Users} title="Dedicated group booking team" />
              <OfferCard Icon={Hotel} title="Choice of rooms to suit your group" />
              <OfferCard Icon={Wifi} title="Free & fast Wi-Fi" />
              <OfferCard Icon={MapPin} title="City-centre locations" />
              <OfferCard Icon={Bus} title="Great transport links" />
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-12 sm:py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Popular hotels for groups</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {hotels.map((hotel, index) => (
  <div key={hotel._id || index} className="relative rounded-xl overflow-hidden shadow-lg group">
    <img
      src={hotel.image || `https://picsum.photos/400/300?random=${index + 1}`}
      alt={hotel.name}
      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors"></div>
    <div className="absolute bottom-0 p-4 text-white">
      <h4 className="text-lg font-bold">{hotel.name}</h4>
      <p className="text-sm">{hotel.country}</p>
    </div>
  </div>
))}

            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-12 sm:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Good to know</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              {faqs.map((item, index) => (
                <FaqItem key={item._id || index} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default GroupDeals;
