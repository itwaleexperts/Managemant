import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const ChevronDown = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
       viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
       strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
const ChevronUp = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
       viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
       strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 15-6-6-6 6"/>
  </svg>
);

const ArticleLink = ({ article }) => (
  <li className="mb-2 ml-4 list-disc text-sm">
    <a 
      href={article.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-blue-600 hover:text-orange-500 transition duration-150"
    >
      <span className="font-semibold">{article.title}</span> - {article.source}
    </a>
  </li>
);

const YearSection = ({ yearData }) => {
  const [isOpen, setIsOpen] = useState(yearData.year === new Date().getFullYear());
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="border-b border-gray-300">
      <button
        onClick={toggleOpen}
        className="w-full flex justify-between items-center py-4 text-xl font-bold text-gray-800 hover:bg-gray-50 transition duration-200 px-2 -mx-2"
      >
        <span>{yearData.year}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-orange-500" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {isOpen && (
        <div className="pt-2 pb-6 space-y-4">
          {yearData.months.map((monthData) => (
            <div key={monthData._id}>
              <h3 className="text-lg font-bold text-gray-700 mb-2 mt-4 ml-2">{monthData.month}</h3>
              <ul className="space-y-2">
                {monthData.articles.map((article) => (
                  <ArticleLink key={article._id} article={article} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PressArchive = ({ pressData }) => (
  <div className="container mx-auto px-4 md:px-8 py-10">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12">
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-6 text-orange-500">Archive</h2>
        {pressData.map((yearData) => (
          <YearSection key={yearData._id} yearData={yearData} />
        ))}
      </div>
      <div className="hidden md:block md:col-span-1 border-l border-gray-300 pl-8 pt-8">
        <h2 className="text-2xl font-bold mb-6 text-orange-500">Other Years</h2>
        <div className="space-y-4 text-lg text-gray-600">
        </div>
      </div>
    </div>
  </div>
);

const PressBanner = ({ hero }) => (
  <div 
    className="relative h-64 bg-cover bg-center mt-5" 
    style={{ backgroundImage: `url('${hero.imageUrl}')` }}
  >
    <div className="absolute inset-0 flex items-center justify-center">
      <h1 className="text-5xl font-extrabold text-white tracking-widest uppercase text-center px-4">{hero.heading}</h1>
    </div>
  </div>
);

const IntroText = ({ intro }) => (
  <div className="container mx-auto px-4 md:px-8 py-10 max-w-4xl">
    <p className="text-lg text-gray-700 mb-6 leading-relaxed">{intro}</p>
    <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">Media Enquiries</h2>
    <p className="text-gray-600 mb-2">
      <span className="font-semibold">Email:</span> <a href="mailto:press@easyhotel.com" className="text-blue-600 hover:text-orange-500">press@easyhotel.com</a>
    </p>
    <p className="text-gray-600 mb-2">
      <span className="font-semibold">T:</span> +44 (0)20 7061 9300
    </p>
  </div>
);

const PressPage = () => {
  const [pressData, setPressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hero, setHero] = useState({});

  useEffect(() => {
    const fetchPressData = async () => {
      try {
        const res = await axios.get("https://apiyatraadda.jaspersoftwaresolutions.com/api/press/all"); 
        if (res.data.data.length > 0) {
          setHero(res.data.data[0].hero || {});
          setPressData(res.data.data);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchPressData();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!pressData.length) return <div className="text-center py-20">No press articles available.</div>;

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar/>
      {hero.imageUrl && <PressBanner hero={hero} />}
      {hero.introText && <IntroText intro={hero.introText} />}
      <PressArchive pressData={pressData} />
      <Footer/>
    </div>
  );
};

export default PressPage;
