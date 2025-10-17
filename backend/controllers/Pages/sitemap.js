import Sitemap from "../../models/Pages/sitemapModel.js";

export const getSitemapLinks = async (req, res) => {
  try {
    const links = await Sitemap.find();
    console.log(links); 
    res.status(200).json(links);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addSitemapLink = async (req, res) => {
  try {
    const { column, link } = req.body;
    const newLink = new Sitemap({ column, link });
    await newLink.save();
    res.status(201).json(newLink);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSitemapLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { column, link } = req.body;

    const updatedLink = await Sitemap.findByIdAndUpdate(
      id,
      { column, link },
      { new: true, runValidators: true }
    );

    if (!updatedLink) {
      return res.status(404).json({ message: "Link not found" });
    }

    res.status(200).json(updatedLink);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSitemapLink = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLink = await Sitemap.findByIdAndDelete(id);

    if (!deletedLink) {
      return res.status(404).json({ message: "Link not found" });
    }

    res.status(200).json({ message: "Link deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
