
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const ImageTextBlock = ({ imageUrl, title, text, imageOnLeft = true }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start mb-8">
    <div className={`${imageOnLeft ? 'md:order-1' : 'md:order-2'} rounded-lg overflow-hidden shadow-md`}>
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
    </div>
    <div className={`${imageOnLeft ? 'md:order-2' : 'md:order-1'} space-y-2`}>
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-600">{text}</p>
    </div>
  </div>
);

const UKTravelGuide = () => {
  const [guide, setGuide] = useState(null);
  const slug = 'india-travel-guide'; 

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const res = await axios.get(`https://apiyatraadda.jaspersoftwaresolutions.com/api/uk?slug=${slug}`);
        setGuide(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGuide();
  }, [slug]);

  if (!guide) return <div className="text-center py-20">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans text-gray-700 mt-5">

        <div
          className="relative bg-cover bg-center py-16"
          style={{
            backgroundImage: `url('${guide.heroImage}')`,
            backgroundBlendMode: 'multiply',
            filter: 'brightness(70%)',
          }}
        >
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative container mx-auto px-4 md:px-8 max-w-6xl text-center">
            <h1 className="text-3xl md:text-6xl font-extrabold text-white tracking-wider">
              {guide.country.toUpperCase()}
            </h1>
            <p className="text-white mt-2">{guide.tagline}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl space-y-6">
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <h2 className="text-xl font-bold text-orange-500 uppercase tracking-wider">Welcome</h2>
            <p className="text-gray-600 leading-relaxed">{guide.intro}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
          {guide.blocks.map(block => (
            <ImageTextBlock
              key={block._id}
              imageUrl={block.imageUrl}
              title={block.title}
              text={block.text}
              imageOnLeft={block.imageOnLeft}
            />
          ))}
        </div>

        {guide.cta && (
          <div className="text-center py-10" style={{ backgroundColor: guide.cta.bgColor || '#FF5733' }}>
            <a
              href="#"
              className="text-white text-xl font-bold px-6 py-3 rounded shadow-lg inline-block"
            >
              {guide.cta.text}
            </a>
          </div>
        )}

      </div>
      <Footer />
    </>
  );
};

export default UKTravelGuide;
