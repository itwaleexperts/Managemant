import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Users,
  Home,
  Wifi,
  DollarSign,
  MapPin,
  ChevronDown,
  Check
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const iconMapping = {
  Home,
  Users,
  Briefcase,
  Wifi,
  DollarSign,
  MapPin,
  Check
};

const BenefitChip = ({ iconName, text }) => {
  const Icon = iconMapping[iconName] || Briefcase;
  return (
    <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <Icon className="w-8 h-8 text-orange-500 mb-2" />
      <p className="text-center text-sm font-medium text-gray-700">{text}</p>
    </div>
  );
};

const LocationCard = ({ city, country, imageUrl, altText }) => (
  <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
    <img
      src={imageUrl}
      alt={altText || city}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "https://placehold.co/400x400/CCCCCC/333333?text=Hotel+Image";
      }}
    />
    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4">
      <h3 className="text-xl font-bold text-white leading-tight">{city}</h3>
      <p className="text-sm text-gray-100">{country}</p>
    </div>
  </div>
);

const CollapsibleItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        className="flex justify-between items-center w-full py-4 text-left font-medium text-gray-800 hover:text-orange-500 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180 text-orange-500' : 'text-gray-400'}`} />
      </button>
      {isOpen && <div className="pb-4 text-gray-600">{answer}</div>}
    </div>
  );
};

const CorporateBookings = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://apiyatraadda.jaspersoftwaresolutions.com/api/corporate/get') 
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res.data[res.data.length - 1]); 
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load corporate bookings data.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-screen text-gray-600">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col bg-white font-sans">
        
        <section className="relative h-[500px] overflow-hidden">
          <img
            src={data.heroImageUrl}
            alt={data.heroTitle}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/1600x800/222222/FFFFFF?text=Business+Stays"; }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 flex items-center justify-center h-full">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white text-center p-4">
              {data.heroTitle.split("easy")[0]}<span className="text-orange-400">easy</span>
            </h1>
          </div>
        </section>

        <section className="bg-white py-12 sm:py-16">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <p className="text-lg text-gray-600 mb-8">{data.introText}</p>
            <button className="bg-orange-500 text-white font-bold py-3 px-10 rounded-full hover:bg-orange-600 transition-colors shadow-lg uppercase tracking-wider">
              SUBMIT ENQUIRY
            </button>
          </div>
        </section>

        <section className="bg-gray-50 py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              Cut the costs, not the comfort.
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 max-w-7xl mx-auto">
              {data.benefitChips.map((chip) => (
                <BenefitChip key={chip._id} iconName={chip.iconName} text={chip.text} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold text-gray-900 text-center mb-10">
              Our top locations for business bookers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {data.topLocations.map((loc) => (
                <LocationCard key={loc._id} city={loc.city} country={loc.country} imageUrl={loc.imageUrl} altText={loc.city} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-12 sm:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Good to know</h2>
            <div className="bg-white rounded-xl shadow-lg divide-y divide-gray-100">
              {data.goodToKnow.map((item) => (
                <CollapsibleItem key={item._id} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default CorporateBookings;
