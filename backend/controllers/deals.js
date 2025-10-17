const CurrentOffer = require("../models/dealsModel");

exports.createOfferPage = async (req, res) => {
  try {
    const { mainHeading, subHeading, offers, extraSection } = req.body;

    const offersData = JSON.parse(offers || "[]").map((o, i) => ({
      ...o,
      img: req.files.offerImages?.[i]?.path || "",
    }));

    const extraData = {
      ...extraSection,
      leftImage: req.files.leftImage?.[0]?.path || extraSection.leftImage || "",
      rightImage: req.files.rightImage?.[0]?.path || extraSection.rightImage || "",
    };

    const newOffer = new CurrentOffer({
      mainHeading,
      subHeading,
      offers: offersData,
      extraSection: extraData,
    });

    await newOffer.save();
    res.status(201).json(newOffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllOfferPages = async (req, res) => {
  try {
    const latestOffer = await CurrentOffer.findOne().sort({ createdAt: -1 }); 
    if (!latestOffer) return res.status(404).json({ message: "No offers found" });
    res.json(latestOffer); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getOfferPageById = async (req, res) => {
  try {
    const offer = await CurrentOffer.findById(req.params.id);
    if (!offer) return res.status(404).json({ error: "Offer not found" });
    res.json(offer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.updateOfferPage = async (req, res) => {
  try {
    const { mainHeading, subHeading, offers, extraSection } = req.body;

    const offersData = JSON.parse(offers || "[]").map((o, i) => ({
      ...o,
      img: req.files.offerImages?.[i]?.path || o.img || "",
    }));

    const extraData = {
      ...extraSection,
      leftImage: req.files.leftImage?.[0]?.path || extraSection.leftImage || "",
      rightImage: req.files.rightImage?.[0]?.path || extraSection.rightImage || "",
    };

    const updatedOffer = await CurrentOffer.findByIdAndUpdate(
      req.params.id,
      {
        mainHeading,
        subHeading,
        offers: offersData,
        extraSection: extraData,
      },
      { new: true }
    );

    if (!updatedOffer) return res.status(404).json({ error: "Offer not found" });
    res.json(updatedOffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.deleteOfferPage = async (req, res) => {
  try {
    const deleted = await CurrentOffer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Offer not found" });
    res.json({ message: "Offer deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
