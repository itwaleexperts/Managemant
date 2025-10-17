import React, { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue with local fallback
const customHotelIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper function to convert Date object to YYYY-MM-DD string
const dateToISOString = (date) => date.toISOString().split("T")[0];

// Separate Question Component
const Question = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="mb-1">
      <p
        className="bg-white p-2 rounded-lg shadow-sm text-gray-700 text-sm flex justify-between items-center cursor-pointer"
        onClick={handleToggle}
      >
        <span>{question}</span>
        <span className="text-orange-500">{isOpen ? "−" : "+"}</span>
      </p>
      {isOpen && <div className="ml-4 mt-2 text-gray-600 text-sm">{answer}</div>}
    </div>
  );
};

export default function RoomDetails() {
  const navigate = useNavigate();
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndexes, setImageIndexes] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [cartMessage, setCartMessage] = useState("");
  const [checkInDate, setCheckInDate] = useState(dateToISOString(new Date()));
  const [checkOutDate, setCheckOutDate] = useState(
    dateToISOString(new Date(Date.now() + 24 * 60 * 60 * 1000))
  );

  const getImageUrl = (filename) => `https://apiyatraadda.jaspersoftwaresolutions.com/uploads/${filename}`;

  const calculateTotal = () =>
    cartItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2);

  // --- Cart Fetching Logic ---
  const fetchCart = useCallback(async (inDate, outDate) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setCartItems([]);
        return;
      }

      const response = await axios.get(
        `https://apiyatraadda.jaspersoftwaresolutions.com/api/cart/get?checkInDate=${inDate}&checkOutDate=${outDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;

      setCartMessage(data.message || "");

      if (data && data.rooms && data.rooms.length > 0) {
        setCartItems(
          data.rooms.map((r) => ({
            id: r.roomId._id,
            hotelId: r.roomId.hotelId,
            roomType: r.roomId.roomType,
            price: r.pricePerNight,
            quantity: r.quantity,
            checkInDate: r.checkInDate,
            checkOutDate: r.checkOutDate,
            totalPrice: r.totalPrice,
            destination: hotel?.destination || "Unknown",
          }))
        );
      } else {
        setCartItems([]);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setCartItems([]);
        setCartMessage("Cart is empty");
      } else {
        console.error("Failed to fetch cart:", error.response?.data || error);
        setCartItems([]);
      }
    }
  }, [hotel]);

  // --- Handlers ---
  const handleDateChange = (type, dateString) => {
    let newIn = checkInDate;
    let newOut = checkOutDate;
    if (type === "checkIn") {
      newIn = dateString;
      const newInDate = new Date(newIn);
      const newOutDateObj = new Date(newOut);
      if (newInDate >= newOutDateObj) {
        const nextDay = new Date(newInDate.getTime() + 24 * 60 * 60 * 1000);
        newOut = dateToISOString(nextDay);
        setCheckOutDate(newOut);
      }
      setCheckInDate(newIn);
    } else {
      newOut = dateString;
      if (new Date(newOut) <= new Date(newIn)) return;
      setCheckOutDate(newOut);
    }
    fetchCart(newIn, newOut);
  };

  const handleAddToCart = async (room) => {
    const token = localStorage.getItem("userToken");
    if (!token) return alert("Please login to add rooms to cart");
    try {
      await axios.post(
        "https://apiyatraadda.jaspersoftwaresolutions.com/api/cart/create",
        {
          roomId: room._id,
          quantity: 1,
          checkInDate,
          checkOutDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart(checkInDate, checkOutDate);
    } catch (error) {
      console.error("Failed to add room to cart:", error);
      const errorMessage = error.response?.data?.message || "Error adding to cart";
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleQuantityChange = async (itemId, delta) => {
    const token = localStorage.getItem("userToken");
    const item = cartItems.find((i) => i.id === itemId);
    if (!item) return;
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;
    try {
      await axios.post(
        "https://apiyatraadda.jaspersoftwaresolutions.com/api/cart/update",
        {
          roomId: item.id,
          checkInDate: item.checkInDate,
          checkOutDate: item.checkOutDate,
          quantity: newQuantity,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart(checkInDate, checkOutDate);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    const token = localStorage.getItem("userToken");
    const item = cartItems.find((i) => i.id === itemId);
    if (!item) return;
    try {
      await axios.delete(`https://apiyatraadda.jaspersoftwaresolutions.com/api/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          roomId: item.id,
          checkInDate: item.checkInDate,
          checkOutDate: item.checkOutDate,
        },
      });
      await fetchCart(checkInDate, checkOutDate);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  // --- Scroll Handler ---
  const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const hotelRes = await axios.get(
          `https://apiyatraadda.jaspersoftwaresolutions.com/api/hotel/one/${hotelId}`
        );
        const roomsRes = await axios.get(
          `https://apiyatraadda.jaspersoftwaresolutions.com/api/room/hotel/${hotelId}`
        );
        setHotel(hotelRes.data || {});
        setRooms(roomsRes.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch hotel data:", err);
        setLoading(false);
      }
    };
    fetchHotelDetails();
    fetchCart(checkInDate, checkOutDate);
  }, [hotelId, fetchCart, checkInDate, checkOutDate]);

  const handleNext = (roomId, totalImages) => {
    setImageIndexes((prev) => ({
      ...prev,
      [roomId]: prev[roomId] === undefined ? 1 : (prev[roomId] + 1) % totalImages,
    }));
  };

  const handlePrev = (roomId, totalImages) => {
    setImageIndexes((prev) => ({
      ...prev,
      [roomId]: prev[roomId] === undefined ? totalImages - 1 : (prev[roomId] - 1 + totalImages) % totalImages,
    }));
  };

  if (loading)
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!hotel)
    return <div className="min-h-screen flex items-center justify-center">Hotel not found</div>;

  const lat = hotel?.location?.[0]?.coordinates?.lat || 19.0760; 
  const lng = hotel?.location?.[0]?.coordinates?.lng || 72.8777; 
  const hasValidCoords = lat && lng && typeof lat === 'number' && typeof lng === 'number';
  const position = hasValidCoords ? [lat, lng] : [19.0760, 72.8777]; 
  const hotelName = hotel?.name || "Unnamed Hotel";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  const defaultServices = [
    { icon: "📶", name: "Free Wi-Fi" },
    { icon: "⏰", name: "24/7 Reception" },
    { icon: "💧", name: "Free Water Fountain" },
    { icon: "☕", name: "Tea & Coffee Vending Machine" },
  ];
  const services = hotel?.amenities?.length > 0 ? hotel.amenities.map(a => ({ icon: "✔", name: a })) : defaultServices;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8 font-sans space-y-12">
      

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <img
            src={hotel.images?.[0] ? getImageUrl(hotel.images[0]) : "https://picsum.photos/800/500"}
            alt="Hotel Main"
            className="col-span-2 rounded-2xl object-cover w-full h-[360px] shadow-lg hover:scale-[1.01] transition"
          />
          <div className="grid grid-cols-2 gap-4">
            {hotel.images?.slice(1, 5).map((img, idx) => (
              <img
                key={idx}
                src={img ? getImageUrl(img) : "https://picsum.photos/300/200"}
                alt={`Hotel ${idx + 1}`}
                className="rounded-xl object-cover h-[178px] w-full shadow hover:scale-[1.03] transition"
              />
            ))}
          </div>
        </div>

        <div className="border-b pb-6">
          <h6 className="text-3xl font-bold text-gray-800">{hotel.name || "Unnamed Hotel"}</h6>
          <p className="text-gray-600 mt-3 text-md font-semibold leading-relaxed max-w-3xl">{hotel.description || "No description available."}</p>
        </div>

<div className="sticky top-1 z-50 bg-white flex justify-center space-x-15 p-0">
  <button
    onClick={() => handleScrollToSection("location")}
    className="text-orange-500 hover:underline text-md font-bold"
  >
    Location
  </button>
  <button
    onClick={() => handleScrollToSection("about")}
    className="text-orange-500 hover:underline text-md font-bold"
  >
    About
  </button>
  <button
    onClick={() => handleScrollToSection("services")}
    className="text-orange-500 hover:underline text-md font-bold"
  >
    Services
  </button>
  <button
    onClick={() => handleScrollToSection("know")}
    className="text-orange-500 hover:underline text-md font-bold"
  >
    Go To Know
  </button>
  <button
    onClick={() => handleScrollToSection("contact")}
    className="text-orange-500 hover:underline text-md font-bold"
  >
    Contact
  </button>
</div>


        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 mt-10">
          <div className="space-y-12 order-2 lg:order-1">
            <h2 className="text-2xl font-semibold mb-6">Choose Your Room</h2>
            <div className="space-y-6">
              {rooms.length > 0 ? (
                rooms.map((room) => {
                  const currentIndex = imageIndexes[room._id] || 0;
                  const isBooked = room.roomStatus === "booked";

                  return (
                    <div
                      key={room._id}
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between border rounded-2xl p-6 shadow-md transition gap-6 ${
                        isBooked ? "bg-gray-100 cursor-not-allowed" : "bg-white hover:shadow-lg"
                      }`}
                    >
                      <div className="relative flex-shrink-0 w-full sm:w-60">
                        {room.images?.length > 1 && !isBooked && (
                          <button
                            onClick={() => handlePrev(room._id, room.images.length)}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-10"
                          >
                            <ChevronLeft size={20} />
                          </button>
                        )}
                        <img
                          src={room.images?.[currentIndex] ? getImageUrl(room.images[currentIndex]) : "https://picsum.photos/400/300"}
                          alt={room.roomType}
                          className="w-full sm:w-60 h-44 rounded-xl object-cover shadow"
                        />
                        {room.images?.length > 1 && !isBooked && (
                          <button
                            onClick={() => handleNext(room._id, room.images.length)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-10"
                          >
                            <ChevronRight size={20} />
                          </button>
                        )}
                      </div>

                      <div className="flex-1 mt-4 sm:mt-0">
                        <h3 className="font-semibold text-xl text-gray-800">{room.roomType}</h3>
                        <p className="text-gray-500 text-sm mt-1">
                          {room.capacity} {room.capacity > 1 ? "Adults" : "Adult"} | Floor {room.floorNumber} | Room #{room.roomNumber}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {room.isSmoking ? "Smoking allowed" : "Non-smoking"} | {room.isWindow ? "Window available" : "No window"}
                        </p>
                        {room.amenities?.length > 0 && <p className="text-gray-500 text-sm">Amenities: {room.amenities.join(", ")}</p>}
                      </div>

                      <div className="flex flex-col items-end text-right w-full sm:w-56 mt-4 sm:mt-0">
                        <p className="text-sm font-medium text-gray-700">Non-refundable</p>
                        <div className="flex items-end justify-end space-x-2 mt-1">
                          <span className="line-through text-sm text-gray-400">₹{(room.pricePerNight * 1.1).toFixed(2)}</span>
                          <span className="text-2xl font-bold text-orange-500">₹{room.pricePerNight}</span>
                        </div>
                        <p className="text-xs text-orange-500 mt-1">10% off - member discount</p>

                        {!isBooked && (
                          <button
                            onClick={() => handleAddToCart(room)}
                            className="mt-3 px-6 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition w-full"
                          >
                            ADD TO CART
                          </button>
                        )}

                        <p className={`font-semibold mt-2 ${isBooked ? "text-gray-400" : "text-gray-500"}`}>
                          {room?.roomStatus}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center">No rooms available for this hotel.</p>
              )}
            </div>
          </div>

          <div className="order-1 lg:order-2 mt-13">
            <div className="sticky top-4 p-6 border rounded-xl shadow-lg bg-white space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center border border-gray-300 rounded-lg p-3">
                  <span className="text-lg font-medium">Your Booking</span>
                  <span className="text-sm text-gray-500">{cartItems.length} item(s)</span>
                </div>
                {cartMessage && (
                  <div className="text-sm text-center p-2 rounded-lg bg-yellow-100 text-yellow-800 border border-yellow-300">
                    {cartMessage}
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.id} className="pb-4 border-b">
                      <div className="flex justify-between items-start text-gray-700">
                        <div className="text-sm font-semibold">
                          {item.roomType}
                          <span className="block text-xs font-normal text-orange-500">
                            {new Date(item.checkInDate).toLocaleDateString()} to {new Date(item.checkOutDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold">₹{item.totalPrice.toFixed(2)}</span>
                          <span className="block text-xs text-gray-500">
                            ₹{item.price.toFixed(2)}/night × {item.quantity} room(s)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border rounded-full text-base">
                          <button
                            className="px-3 py-1 text-gray-500 hover:text-black"
                            onClick={() => handleQuantityChange(item.id, -1)}
                          >
                            -
                          </button>
                          <span className="px-3">{item.quantity}</span>
                          <button
                            className="px-3 py-1 text-gray-500 hover:text-black"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="text-gray-400 hover:text-red-500"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5 text-gray-500 italic">
                    <p>No rooms added yet. Add a room to proceed!</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t space-y-4">
                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <button
                  disabled={cartItems.length === 0}
                  onClick={() => {
                    if (cartItems.length > 0) {
                      navigate(`/booking/${hotelId}/${cartItems[0].id}, { state: { room: cartItems[0] } }`);
                    }
                  }}
                  className={`w-full py-3 font-bold rounded-xl text-xl transition ${
                    cartItems.length > 0 ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  BOOK NOW
                </button>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm mt-4">
                <p className="font-semibold text-blue-700">Stay Longer, Spend Less</p>
                <p className="text-gray-600 mt-1">Log in or sign up for a FREE account to take advantage of this deal.</p>
              </div>
            </div>
          </div>
        </div>

        <div id="location" className="flex bg-white rounded-lg p-0 border-t">
          <div className="w-1/2 p-6 pr-10">
            <h4 className="text-xl font-extrabold text-gray-800 mb-4 ">Location :</h4>
           <div className="pb-4 mb-4 space-y-2"> 
    
    <div className="flex justify-start gap-4"> 
        
        <p className="text-md font-semibold text-gray-700">
            {hotel.location[0]?.address || "Address not available"}
        </p>
        
        <p className="text-md font-semibold text-gray-500">
            {hotel.location[0]?.state ? `| ${hotel.location[0].state}` : null}
        </p>
    </div>

    <div className="flex justify-start gap-4"> 
        
        <p className="text-md font-semibold text-gray-700">
            {hotel.location[0]?.city || "City not available"}
        </p>
        
        <p className="text-md font-semibold text-gray-500">
            {hotel.location[0]?.pincode ? `| ${hotel.location[0].pincode}` : null}
        </p>
    </div>
    
    <p className="text-md font-semibold text-gray-700">
        {hotel.location[0]?.country || "Country not available"}
    </p>
    
</div>
          </div>

          <div className="w-1/2 h-64"> 
            <div className="h-full w-full relative overflow-hidden rounded-r-lg mt-5 px-8">
              <MapContainer
                center={position}
                zoom={hasValidCoords ? 14 : 12}
                scrollWheelZoom={false}
                className="h-full w-full z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {hasValidCoords && (
                  <Marker position={position} icon={customHotelIcon}>
                    <Popup>
                      <span className="font-semibold">{hotelName}</span>
                    </Popup>
                  </Marker>
                )}
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] flex flex-col items-center"
                >
                  <div className="bg-white border border-gray-300 text-orange-500 font-semibold px-3 py-2 text-xs rounded shadow-lg cursor-pointer hover:bg-gray-50 transition duration-150 ease-in-out">
                    SEE MAP
                  </div>
                </a>
              </MapContainer>
            </div>
          </div>
        </div>

<div id="services" className="border-t pt-6">
  <h2 className="text-2xl font-semibold mb-4">Services</h2>
  <div className="grid grid-cols-4 gap-4 mb-6">
    {[...new Set(rooms.flatMap(room => 
      room.amenities?.[0]?.split(',') || []
    ))].map((amenity, index) => (
      <div key={index} className="bg-orange-50 p-3 rounded-lg text-center">
        <span className="text-orange-500 text-xl">✔</span>
        <p className="text-gray-600 text-sm mt-1">{amenity.trim()}</p>
      </div>
    ))}
  </div>
 
</div>
        <div id="know" className="border-t pt-6 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <span className="text-orange-500 mr-2">ⓘ</span> Good to Know
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              {hotel.goodToKnow?.slice(0, Math.ceil(hotel.goodToKnow?.length / 2)).map((item, index) => (
                <Question
                  key={index}
                  question={item.question}
                  answer={
                    item.question.toLowerCase().includes("what do the rooms look like") ? (
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        {hotel.images?.slice(0, 4).map((img, idx) => (
                          <img
                            key={idx}
                            src={img ? getImageUrl(img) : "https://picsum.photos/300/200?random=" + idx}
                            alt={`Room Model ${idx + 1}`}
                            className="rounded-lg object-cover w-full h-40 shadow-md"
                          />
                        ))}
                        {(!hotel.images || hotel.images.length === 0) && (
                          <p className="text-gray-500">No room images available.</p>
                        )}
                      </div>
                    ) : (
                      <p>{item.answer}</p>
                    )
                  }
                />
              ))}
            </div>
            <div>
              {hotel.goodToKnow?.slice(Math.ceil(hotel.goodToKnow?.length / 2)).map((item, index) => (
                <Question
                  key={index}
                  question={item.question}
                  answer={
                    item.question.toLowerCase().includes("what do the rooms look like") ? (
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        {hotel.images?.slice(0, 4).map((img, idx) => (
                          <img
                            key={idx}
                            src={img ? getImageUrl(img) : "https://picsum.photos/300/200?random=" + idx}
                            alt={`Room Model ${idx + 1}`}
                            className="rounded-lg object-cover w-full h-40 shadow-md"
                          />
                        ))}
                        {(!hotel.images || hotel.images.length === 0) && (
                          <p className="text-gray-500">No room images available.</p>
                        )}
                      </div>
                    ) : (
                      <p>{item.answer}</p>
                    )
                  }
                />
              ))}
            </div>
          </div>
          {(!hotel.goodToKnow || hotel.goodToKnow.length === 0) && (
            <p className="text-gray-500 text-center">No "Good to Know" information available.</p>
          )}
        </div>

     <div id="contact" className="border-t pt-6">
        <h2 className="text-2xl font-semibold mb-4">Contact</h2>
        <p className="text-gray-600">
          Reception:{" "}
          <a href={`tel:${rooms[0]?.number}`} className="text-blue-500">
            {rooms[0]?.number}
          </a>
        </p>
        <p className="text-gray-600">
          Email:{" "}
          <a href={`mailto:${rooms[0]?.email}`} className="text-blue-500">
            {rooms[0].email}
          </a>
        </p>
      </div>

      <div id="about" className="border-t pt-6">
        <h2 className="text-2xl font-semibold mb-4">About</h2>
        <p className="text-gray-600">{rooms[0]?.about}</p>
      </div>
      </div>
      <Footer />
    </>
  );
}