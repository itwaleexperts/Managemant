const Destination = require("../models/destinationModel");

const processCitiesAndFiles = (citiesJson, files) => {
    let cities;
    try {
        cities = JSON.parse(citiesJson); 
    } catch (e) {
        console.error("Failed to parse cities JSON:", citiesJson);
        return []; 
    }
    
    const newFiles = files || [];
    let fileIndex = 0;

    const finalCities = cities.map(city => {
        if (city.img === '' && fileIndex < newFiles.length) {
            const filePath = '/uploads/' + newFiles[fileIndex].filename; 
            fileIndex++;
            return { ...city, img: filePath };
        }
        
        return city;
    });

    return finalCities;
};

exports.addDestination = async (req, res) => {
    try {
        const { country, cities } = req.body;
        
        if (!country || !cities) {
            return res.status(400).json({ message: 'Country and Cities data are required.' });
        }
        
        const finalCities = processCitiesAndFiles(cities, req.files);
        
        const newDestination = new Destination({
            country,
            cities: finalCities
        });

        await newDestination.save();
        res.status(201).json({ success: true, data: newDestination });
    } catch (err) {
        console.error("Error in addDestination:", err);
        res.status(400).json({ message: err.message });
    }
};

exports.getAllDestinations = async (req, res) => {
    try {
        const destinations = await Destination.find();
        res.json({ success: true, data: destinations }); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getDestinationById = async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination)
            return res.status(404).json({ message: "Destination not found" });
        res.json({ success: true, data: destination }); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateDestination = async (req, res) => {
    try {
        const { country, cities } = req.body;

        if (!country || !cities) {
            return res.status(400).json({ message: 'Country and Cities data are required for update.' });
        }

        const finalCities = processCitiesAndFiles(cities, req.files);
        
        const updated = await Destination.findByIdAndUpdate(
            req.params.id,
            { country, cities: finalCities }, 
            { new: true, runValidators: true } 
        );

        if (!updated)
            return res.status(404).json({ message: "Destination not found" });
            
        res.json({ success: true, data: updated });
    } catch (err) {
        console.error("Error in updateDestination:", err);
        res.status(400).json({ message: err.message }); 
    }
};

exports.deleteDestination = async (req, res) => {
    try {
        const deleted = await Destination.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ message: "Destination not found" });
            
        res.json({ success: true, message: "Destination deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};