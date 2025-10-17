import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const Footer = () => {
  const [showDestinations, setShowDestinations] = useState(false);
  const [showHotels, setShowHotels] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    facebook: '',
    linkedIn: '',
    footerText: '',
    footerHeading : ''
  });
  const navigate = useNavigate(); 

 
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('https://apiyatraadda.jaspersoftwaresolutions.com/api/setting', {
          withCredentials: true, 
        });
        if (response.data.success && response.data.data) {
          setSocialLinks({
            instagram: response.data.data.instagram || '',
            facebook: response.data.data.facebook || '',
            linkedIn: response.data.data.linkedIn || '',
            footerText: response.data.data.footerText || '',
            footerHeading : response.data.data.footerHeading
          });
        }
      } catch (error) {
        console.error('Failed to fetch social media links:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleSocialClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <footer className="bg-white text-gray-700 text-sm mt-20 border-t">
      <div className="bg-white text-center py-4">
        <h2 className="text-blue-500 font-bold text-xl">{socialLinks.footerHeading}</h2>
        <p className="text-blue-500 text-xs mt-1">{socialLinks.footerText}</p>
      </div>

      <div className=" max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        <div>
          <h4 className="font-extrabold mb-3">Company</h4>
          <ul className="space-y-1 text-gray-600 font-semibold">
            <li>
              <a href="/careers" className="hover:text-blue-500 hover:underline">Careers</a>
            </li>
            <li>
              <a href="/about" className="hover:text-blue-500 hover:underline">About Us</a>
            </li>
            <li>
              <a href="/pledge" className="hover:text-blue-500 hover:underline">Our Low-Carbon Pledge</a>
            </li>
            <li>
              <a href="/press" className="hover:text-blue-500 hover:underline">Press Centre</a>
            </li>
            <li>
              <a href="/easy" className="hover:text-blue-500 hover:underline">easyHistory</a>
            </li>
            <li>
              <a href="/modern" className="hover:text-blue-500 hover:underline">Modern Slavery Statement</a>
            </li>
            <li>
              <a href="/whistle" className="hover:text-blue-500 hover:underline">Whistleblowing Policy</a>
            </li>
            <li>
              <a href="/affiliates" className="hover:text-blue-500 hover:underline">Affiliates</a>
            </li>
            <li>
              <a href="/supplier" className="hover:text-blue-500 hover:underline">Supplier Code of Conduct</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-extrabold mb-3">Customer</h4>
          <ul className="space-y-1 font-semibold">
            <li><a href="/easyhotel" className="hover:text-blue-500 hover:underline">easyHotel App</a></li>
            <li><a href="/corporate" className="hover:text-blue-500 hover:underline">Corporate Bookings</a></li>
            <li><a href="/contact" className="hover:text-blue-500 hover:underline">Contact Us</a></li>
            <li><a href="/faq" className="hover:text-blue-500 hover:underline">FAQs</a></li>
            <li><a href="/key" className="hover:text-blue-500 hover:underline">Digital Key</a></li>
            <li><a href="/club" className="hover:text-blue-500 hover:underline">clubBedzzz</a></li>
            <li><a href="/group" className="hover:text-blue-500 hover:underline">Group Deals</a></li>
            <li><a href="/dis" className="hover:text-blue-500 hover:underline">Student Discount</a></li>
            <li><a href="/access" className="hover:text-blue-500 hover:underline">Accessibility Statement</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-extrabold mb-3">Partnerships</h4>
          <ul className="space-y-1 font-semibold">
            <li><a href="/develop" className="hover:text-blue-500 hover:underline">Development</a></li>
          </ul>
          <h4 className="font-extrabold mt-6 mb-3">Travel guides</h4>
          <ul className="space-y-1 font-semibold">
            <li><a href="/uk" className="hover:text-blue-500 hover:underline">United Kingdom</a></li>
            <li><a href="/london" className="hover:text-blue-500 hover:underline">London</a></li>
            <li><a href="/europe" className="hover:text-blue-500 hover:underline">Europe</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-extrabold mb-3">Download Apps</h4>
          <div className="flex flex-col space-y-3">
            <img src="/apple.png" alt="App Store" className="h-8 w-8 ml-8" />
            <img src="/google.png" alt="Google Play" className="h-8 w-8 ml-8" />
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">
            Subscribe to get the latest hotel deals and offers by email.
          </h4>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input type="text" placeholder="First name" className="border border-gray-400 px-3 py-2 w-1/2 rounded text-sm" />
              <input type="text" placeholder="Last name" className="border border-gray-400 px-3 py-2 w-1/2 rounded text-sm" />
            </div>
            <input type="email" placeholder="Enter your email" className="border border-gray-400 px-3 py-2 w-full rounded text-sm" />
            <div className="flex items-start space-x-2 text-xs text-gray-600">
              <input type="checkbox" className="mt-1" />
              <p>
                I agree to receive marketing and promotion emails from easyHotel UK Limited and its group subsidiary companies as referenced in our website privacy policy
              </p>
            </div>
            <button className="bg-green-500 hover:bg-green-600 cursor-pointer text-white font-semibold py-2 px-4 rounded w-full">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 px-6 py-6 text-xs text-gray-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-6 font-semibold text-sm">
            <span
              className={`cursor-pointer ${showDestinations ? 'text-blue-500' : ''}`}
              onClick={() => setShowDestinations(!showDestinations)}
            >
              Our destinations {showDestinations ? '▲' : '▼'}
            </span>
            <span
              className={`cursor-pointer ${showHotels ? 'text-blue-500' : ''}`}
              onClick={() => setShowHotels(!showHotels)}
            >
              Our hotels near popular locations {showHotels ? '▲' : '▼'}
            </span>
          </div>

          <div className="flex space-x-4 font-semibold">
            <span>•</span>
            <a href="/sitemap" className="cursor-pointer hover:text-blue-500 hover:underline">
              Site Map
            </a>
            <span>•</span>
            <a href="/terms" className="cursor-pointer hover:text-blue-500 hover:underline">
              Terms & Conditions
            </a>
            <span>•</span>
            <a href="/cookie" className="cursor-pointer hover:text-blue-500 hover:underline">
              Cookie Policy
            </a>
            <span>•</span>
            <a href="/privacy" className="cursor-pointer hover:text-blue-500 hover:underline">
              Privacy Policy
            </a>
          </div>

          <div className="flex items-center space-x-3 mt-2 md:mt-0">
            <span className="font-semibold">Give us a follow:</span>
            <FaFacebookF
              className="text-blue-600 text-lg cursor-pointer hover:text-blue-800"
              onClick={() => handleSocialClick(socialLinks.facebook)}
            />
            <FaInstagram
              className="text-pink-500 text-lg cursor-pointer hover:text-pink-700"
              onClick={() => handleSocialClick(socialLinks.instagram)}
            />
            <FaLinkedinIn
              className="text-blue-800 text-lg cursor-pointer hover:text-blue-900"
              onClick={() => handleSocialClick(socialLinks.linkedIn)}
            />
          </div>
        </div>
      </div>

      {(showDestinations || showHotels) && (
        <div className="bg-gray-50 border-t px-6 py-6">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-sm">
            {showDestinations && (
              <div>
                <h4 className="font-bold text-gray-800 mb-2">United Kingdom</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>Belfast</li>
                  <li>Birmingham City Centre</li>
                  <li>Cardiff City Centre</li>
                  <li>Croydon Town Centre</li>
                  <li>Edinburgh</li>
                  <li>Glasgow City Centre</li>
                  <li>Ipswich Town Centre</li>
                  <li>Leeds City Centre</li>
                  <li>Liverpool City Centre</li>
                  <li>London City Shoreditch</li>
                  <li>London Paddington</li>
                  <li>London South Kensington</li>
                  <li>London Victoria</li>
                </ul>
              </div>
            )}

            {showHotels && (
              <>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">France</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>Marseille Euromed</li>
                    <li>Nice Old Town</li>
                    <li>Paris Charles de Gaulle Villepinte</li>
                    <li>Paris Nord Aubervilliers</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">The Netherlands</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>Amsterdam Arena Boulevard</li>
                    <li>Amsterdam City Centre</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Germany</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>Berlin Hackescher Markt</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Spain</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>Barcelona Fira</li>
                    <li>Barcelona La Sagrera</li>
                    <li>Madrid Alcala</li>
                    <li>Malaga</li>
                    <li>Valencia Ciutat Vella</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Others</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>Brussels City Centre (Belgium)</li>
                    <li>Sofia (Bulgaria)</li>
                    <li>Budapest (Hungary)</li>
                    <li>Lisbon (Portugal)</li>
                    <li>Dublin City Centre (Ireland)</li>
                    <li>Basel, Zürich (Switzerland)</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;