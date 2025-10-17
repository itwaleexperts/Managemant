const Hotel = require("../models/hotelModel.js")
const NodeGeocoder = require("node-geocoder"); 

const options = {
  provider: 'openstreetmap', 
  httpAdapter: 'https',
  formatter: null
};
const geocoder = NodeGeocoder(options);

const geocodeAddress = async (locationArray) => {
  let latitude = null;
  let longitude = null;

  if (locationArray && locationArray.length > 0) {
    const hotelLocation = locationArray[0];
    const fullAddress = `${hotelLocation.address}, ${hotelLocation.city}, ${hotelLocation.state}, ${hotelLocation.country} ${hotelLocation.pincode}`;

    try {
      const geoResult = await geocoder.geocode(fullAddress);
      if (geoResult && geoResult.length > 0) {
        latitude = geoResult[0].latitude;
        longitude = geoResult[0].longitude;
      }
    } catch (geoError) {
      console.warn("Geocoding failed for address:", fullAddress, geoError.message);
    }
  }
  return { latitude, longitude };
}


exports.createHotel = async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      contact,
      facilities,
      totalRooms,
      availableRooms,
      pricePerNight,
      goodToKnow, 
    } = req.body;

    const adminId = req.adminId;

    if (!adminId) {
      return res.status(401).json({ message: "Admin not authenticated" });
    }

    const locationArray = typeof location === "string" ? JSON.parse(location) : location;
    const contactArray = typeof contact === "string" ? JSON.parse(contact) : contact;
    const facilitiesArray = typeof facilities === "string" ? JSON.parse(facilities) : facilities;
    const goodToKnowArray = typeof goodToKnow === "string" ? JSON.parse(goodToKnow) : goodToKnow;

    const images = req.files.map(file => file.filename);

    const saveHotel = await Hotel.create({
      name,
      description,
      location: locationArray,
      contact: contactArray,
      facilities: facilitiesArray,
      totalRooms,
      availableRooms,
      pricePerNight,
      admin: adminId,
      images,
      goodToKnow: goodToKnowArray, 
    });

    res.status(201).json({ message: "Hotel created successfully!", data: saveHotel });
  } catch (error) {
    console.error("createHotel error is:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.getHotel = async (req, res) => {
  try {
    const allHotel = await Hotel.find()
    res.status(200).json(allHotel)
  } catch (error) {
    console.log("getHotel error is =>", error)
    res.status(500).json({ message: error.message })
  }
}

exports.getOneHotel = async (req, res) => {
  try {
    const getOne = await Hotel.findById(req.params.hotelId) 
    res.status(200).json(getOne)
  } catch (error) {
    console.log("getOneHotel error is ===========>", error)
    res.status(500).json({ message: error.message })
  }
}

exports.updateHotel = async (req, res) => {

  let parsedData = {};
  let existingImages = [];

  try {
    parsedData.location = JSON.parse(req.body.location);
    parsedData.contact = JSON.parse(req.body.contact);
    parsedData.facilities = JSON.parse(req.body.facilities);

    existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];

  } catch (e) {
    console.error("JSON Parsing Error:", e);
    return res.status(400).json({ message: "Invalid data format for location, contact, or facilities." });
  }

  const newImageFilenames = req.files ? req.files.map(file => file.filename) : [];

  const finalImages = [...existingImages, ...newImageFilenames];

  const { latitude, longitude } = await geocodeAddress(parsedData.location);


  const updateObject = {
    name: req.body.name,
    description: req.body.description,
    rating: req.body.rating,
    totalRooms: req.body.totalRooms,
    availableRooms: req.body.availableRooms,
    pricePerNight: req.body.pricePerNight,

    location: parsedData.location,
    contact: parsedData.contact,
    facilities: parsedData.facilities,
    images: finalImages,
    latitude,       
    longitude,      
  };


  try {
    const update = await Hotel.findByIdAndUpdate(
      req.params.hotelId,
      updateObject,
      {
        new: true,
        runValidators: true
      }
    );

    if (!update) {
      return res.status(404).json({ message: "Hotel not found" });
    }



    res.status(200).json({ message: "Hotel updated successfully!", data: update });
  } catch (error) {
    console.log("updateHotel DB error is =======>", error);
    res.status(500).json({ message: error.message });
  }
}

exports.deleteHotel = async (req, res) => {
  try {
    const remove = await Hotel.findByIdAndDelete(req.params.hotelId)
    res.status(200).json({ message: "hotel delete successfully!", data: remove })
  } catch (error) {
    console.log("deleteHotel error is =======>", error)
    res.status(500).json({ message: error.message })
  }
}


exports.getHotelsByCity = async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) {
      return res.status(400).json({ message: "City query parameter is required" });
    }

    const hotels = await Hotel.find({ "location.city": city });

    res.status(200).json({ data: hotels });
  } catch (err) {
    console.error("Error fetching hotels:", err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.searchByDestination = async (req, res) => {
  try {
    const { destination, checkIn, checkOut, guests } = req.query;

    if (!destination) {
      return res.status(400).json({ message: "Destination is required" });
    }

    const guestCount = guests ? parseInt(guests) : 1;

    const destRegex = new RegExp(destination, "i");

    let hotels = await Hotel.find({
      $or: [
        { "location.city": { $regex: destRegex } },
        { "location.state": { $regex: destRegex } },
        { "location.country": { $regex: destRegex } },
        { "location.address": { $regex: destRegex } },
      ],
    });

    hotels = hotels.filter((hotel) => hotel.availableRooms >= guestCount);

    res.status(200).json(hotels);
  } catch (error) {
    console.error("searchByDestination error =>", error);
    res.status(500).json({ message: "Server error" });
  }
};




exports.getCoordinates = async (req, res) => {
  try {
    const { address, city, state, country, pincode } = req.query;

    if (!address || !city || !state || !country) {
      return res.status(400).json({
        message: "Please provide address, city, state, and country in query parameters",
      });
    }

    const fullAddress = `${address}, ${city}, ${state}, ${country} ${pincode || ""}`;
    console.log("Geocoding request for:", fullAddress);

    const geoResult = await geocoder.geocode(fullAddress);

    if (!geoResult || geoResult.length === 0) {
      return res.status(404).json({ message: "Location not found" });
    }

    const { latitude, longitude } = geoResult[0];

    res.status(200).json({
      message: "Coordinates fetched successfully!",
      fullAddress,
      latitude,
      longitude,
    });
  } catch (error) {
    console.error("getCoordinates error =>", error);
    res.status(500).json({ message: "Error fetching coordinates", error: error.message });
  }
};
