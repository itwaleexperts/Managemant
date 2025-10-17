const Terms = require("../../models/Pages/termsModel");

const getTerms = async (req, res) => {
  try {
    const terms = await Terms.find({});

    const groupedTerms = terms.reduce((acc, term) => {
      if (!acc[term.country]) acc[term.country] = [];
      acc[term.country].push(term);
      return acc;
    }, {});

    res.status(200).json({ success: true, data: groupedTerms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getTermById = async (req, res) => {
  try {
    const term = await Terms.findById(req.params.id);
    if (!term) return res.status(404).json({ message: "Term not found" });
    res.json(term);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addTerm = async (req, res) => {
  try {
    const { country, hotelName, highlight } = req.body;
    const newTerm = new Terms({ country, hotelName, highlight });
    await newTerm.save();
    res.status(201).json(newTerm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTerm = async (req, res) => {
  try {
    const { country, hotelName, highlight } = req.body;
    const term = await Terms.findById(req.params.id);
    if (!term) return res.status(404).json({ message: "Term not found" });

    term.country = country || term.country;
    term.hotelName = hotelName || term.hotelName;
    term.highlight = highlight !== undefined ? highlight : term.highlight;

    const updatedTerm = await term.save();
    res.json(updatedTerm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTerm = async (req, res) => {
  try {
    const term = await Terms.findByIdAndDelete(req.params.id);
    if (!term) return res.status(404).json({ message: "Term not found" });

    res.json({ message: "Term deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { getTerms, getTermById, addTerm, updateTerm, deleteTerm };
