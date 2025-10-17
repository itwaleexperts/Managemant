import React from 'react';

const ClubPage = () => {
  return (
    <div className="font-sans text-gray-800">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/2 w-full h-96 lg:h-auto bg-cover bg-center" style={{ backgroundImage: "url('/left.jpg')" }}></div>

        <div className="lg:w-1/2 w-full p-8 bg-gray-100 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2">Join The Club</h1>
          <p className="font-semibold text-sm text-gray-700 mb-4">
            clubBedzzz is free and full of exclusive benefits
          </p>
          <ul className="list-none mb-6 space-y-2">
            <li className="flex items-start">
              <span className="text-green-600 mr-2 mt-1">✔</span> Get 10% off our already low-cost rooms.
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 mt-1">✔</span> Find local discounts at restaurants, parking and much more.
            </li>
          </ul>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 w-fit rounded">
            JOIN CLUBBEDZZZ
          </button>
        </div>
      </div>

      <div className="px-8 py-12">
        <h2 className="text-2xl font-bold mb-8">Places of interest</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place, index) => (
            <div key={index}>
              <strong className="block">{place.name}</strong>
              <span className="text-sm text-gray-600">{place.distance}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const places = [
  { name: 'Tower Of London', distance: '1.8 miles from easyHotel London City Shoreditch' },
  { name: 'Buckingham Palace', distance: '1 mile from easyHotel London Victoria' },
  { name: 'Guinness Storehouse', distance: '1km from easyHotel Dublin City Centre' },
  { name: 'Stade de France', distance: '2.4km from easyHotel Paris Nord Aubervilliers' },
  { name: 'Brandenburg Gate', distance: '2.7km from easyHotel Berlin Hackescher Markt' },
  { name: 'Lake Zürich', distance: '26km from easyHotel Zurich City Centre' },
  { name: 'Rijksmuseum', distance: '1.2km from easyHotel Amsterdam City Centre' },
  { name: 'Edinburgh Castle', distance: '0.5 miles from easyHotel Edinburgh' },
  { name: 'Eiffel Tower', distance: '9km from easyHotel Paris Nord' },
  { name: 'La Sagrada Familia', distance: '9km from easyHotel Barcelona Fira' },
  { name: 'Etihad Stadium', distance: '1.5 miles from easyHotel Manchester City Centre' },
  { name: 'Big Ben', distance: '1 mile from easyHotel London Victoria' },
];

export default ClubPage;
