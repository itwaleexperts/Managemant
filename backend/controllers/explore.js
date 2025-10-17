const Explore = require("../models/exploreModel");

const NEW_FILE_PLACEHOLDER = 'NEW_FILE_UPLOADED';

const processCitiesAndFiles = (citiesJson, files, startFileIndex) => {
  let cities;
  try {
    cities = JSON.parse(citiesJson);
  } catch (e) {
    console.error("Failed to parse cities JSON:", citiesJson);
    return [];
  }

  const newFiles = files || [];
  let fileIndex = startFileIndex;

  const finalCities = cities.map(city => {
    if (city.img === NEW_FILE_PLACEHOLDER) {
      if (fileIndex < newFiles.length) {
        const filePath = '/uploads/' + newFiles[fileIndex].filename;
        fileIndex++;
        return { ...city, img: filePath };
      }
      return { ...city, img: '' };
    }

    return city;
  });

  return finalCities; 
};

exports.addCountry = async (req, res) => {
  try {
    const { name, banner } = req.body;
    const citiesJson = req.body.cities; 
    const uploadedFiles = req.files || []; 

    if (!name || !citiesJson || banner === undefined) {
      return res.status(400).json({ message: 'Name, Cities, and Banner data are required.' });
    }

    const bannerFile = uploadedFiles.length > 0 && banner === NEW_FILE_PLACEHOLDER ? uploadedFiles[0] : null;

    if (banner === NEW_FILE_PLACEHOLDER && !bannerFile) {
      return res.status(400).json({ message: 'Banner file is required for new entry but was not uploaded.' });
    }

    let bannerPath = banner;
    let cityFileStartIndex = 0; 

    if (bannerFile) {
      bannerPath = '/uploads/' + bannerFile.filename;
      cityFileStartIndex = 1; 
    }

    const finalCities = processCitiesAndFiles(citiesJson, uploadedFiles, cityFileStartIndex);

    const newExploreItem = new Explore({
      name,
      banner: bannerPath,
      cities: finalCities
    });

    await newExploreItem.save();
    res.status(201).json({ success: true, data: newExploreItem });

  } catch (err) {
    console.error("Error in addCountry:", err);
    res.status(400).json({ success: false, message: `Explore validation failed: ${err.message}` });
  }
};

exports.updateCountry = async (req, res) => {
  try {
    const { name, banner } = req.body;
    const citiesJson = req.body.cities; 
    const uploadedFiles = req.files || [];

    if (!name || !citiesJson || banner === undefined) {
      return res.status(400).json({ message: 'Name, Cities, and Banner data are required for update.' });
    }

    const bannerFile = uploadedFiles.length > 0 && banner === NEW_FILE_PLACEHOLDER ? uploadedFiles[0] : null;

    let finalBannerPath = banner; 
    let cityFileStartIndex = 0;

    if (bannerFile) {
      finalBannerPath = '/uploads/' + bannerFile.filename;
      cityFileStartIndex = 1;
    }

    const finalCities = processCitiesAndFiles(citiesJson, uploadedFiles, cityFileStartIndex);

    const updated = await Explore.findByIdAndUpdate(
      req.params.id,
      { name, banner: finalBannerPath, cities: finalCities },
      { new: true, runValidators: true } 
    );

    if (!updated) return res.status(404).json({ success: false, message: "Country not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error in updateCountry:", err);
    res.status(400).json({ success: false, message: `Explore validation failed: ${err.message}` });
  }
};


exports.getAllCountries = async (req, res) => {
  try {
    const countries = await Explore.find();
    res.json({ success: true, data: countries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getCountryById = async (req, res) => {
  try {
    const country = await Explore.findById(req.params.id);
    if (!country) return res.status(404).json({ success: false, message: "Country not found" });
    res.json({ success: true, data: country });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCountry = async (req, res) => {
  try {
    const deleted = await Explore.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Country not found" });
    res.json({ success: true, message: "Country deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};