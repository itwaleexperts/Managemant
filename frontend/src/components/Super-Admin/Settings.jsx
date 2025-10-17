import React, { useState, useEffect } from "react";
import { ImagePlus, X } from "lucide-react";

export default function SettingsPage() {
  const [form, setForm] = useState({
    logo: null,
    bgImage: null,
    carouselImages: [],
    phone: "",
    email: "",
    instagram: "",
    facebook: "",
    linkedIn: "",
    copyright: "",
    workingHours: "",
    address: "",
    footerText: "",
    footerHeading: "",
  });

  const [loading, setLoading] = useState(false);

  const sectionStyle =
    "bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition flex flex-col w-full sm:w-3/4 mx-auto";
  const buttonStyle =
    "flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2 rounded-lg font-medium hover:opacity-90 transition";

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("https://apiyatraadda.jaspersoftwaresolutions.com/api/setting", {
          credentials: "include",
        });
        const data = await res.json();

        if (data.success && data.data) {
          setForm((prev) => ({
            ...prev,
            logo: data.data.logo ? `https://apiyatraadda.jaspersoftwaresolutions.com${data.data.logo}` : null,
            bgImage: data.data.bgImage ? `https://apiyatraadda.jaspersoftwaresolutions.com${data.data.bgImage}` : null,
            carouselImages: data.data.images
              ? data.data.images.filter((img) => img).map((img) => `https://apiyatraadda.jaspersoftwaresolutions.com${img}`)
              : [],
            phone: data.data.phone || "",
            email: data.data.email || "",
            instagram: data.data.instagram || "",
            facebook: data.data.facebook || "",
            linkedIn: data.data.linkedIn || "",
            copyright: data.data.copyright || "",
            workingHours: data.data.workingHours || "",
            address: data.data.address || "",
            footerText: data.data.footerText || "",
            footerHeading: data.data.footerHeading || "",
          }));
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
        alert("Setting fetch error");
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (files && files.length > 0) {
      if (name === "carouselImages") {
        if (form.carouselImages.length + files.length > 5) {
          alert("Only maximum 5 carousel images can be uploaded");
          return;
        }

        const newFiles = Array.from(files).map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }));

        setForm((prev) => ({
          ...prev,
          carouselImages: [...prev.carouselImages, ...newFiles],
        }));
      } else {
        const file = files[0];
        const preview = URL.createObjectURL(file);
        setForm((prev) => ({ ...prev, [name]: { file, preview } }));
      }
    }
  };

  const handleRemoveImage = async (type, index = null) => {
    if (
      (type === "logo" && form.logo?.file) ||
      (type === "bgImage" && form.bgImage?.file) ||
      (type === "images" && form.carouselImages[index]?.file)
    ) {
      if (type === "logo") setForm((prev) => ({ ...prev, logo: null }));
      else if (type === "bgImage") setForm((prev) => ({ ...prev, bgImage: null }));
      else if (type === "images")
        setForm((prev) => ({
          ...prev,
          carouselImages: prev.carouselImages.filter((_, i) => i !== index),
        }));
      return;
    }

    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      setLoading(true);
      const payload = { type };
      if (type === "images" && index !== null && form.carouselImages[index]) {
        const img = form.carouselImages[index];
        payload.imagePath =
          typeof img === "string"
            ? img.replace("https://apiyatraadda.jaspersoftwaresolutions.com", "")
            : img.preview?.replace("https://apiyatraadda.jaspersoftwaresolutions.com", "");
      }

      const res = await fetch("https://apiyatraadda.jaspersoftwaresolutions.com/api/setting/image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        if (type === "logo") {
          setForm((prev) => ({ ...prev, logo: null }));
        } else if (type === "bgImage") {
          setForm((prev) => ({ ...prev, bgImage: null }));
        } else if (type === "images") {
          setForm((prev) => ({
            ...prev,
            carouselImages: prev.carouselImages.filter((_, i) => i !== index),
          }));
        }
        alert("Image deleted successfully");
      } else {
        alert("Failed to delete image: " + data.message);
      }
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("Failed to delete image");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();

    if (form.logo?.file) formData.append("logo", form.logo.file);
    if (form.bgImage?.file) formData.append("bgImage", form.bgImage.file);

    form.carouselImages.forEach((img) => {
      if (img.file) formData.append("carouselImages", img.file);
    });

    formData.append("phone", form.phone);
    formData.append("email", form.email);
    formData.append("instagram", form.instagram);
    formData.append("facebook", form.facebook);
    formData.append("linkedIn", form.linkedIn);
    formData.append("copyright", form.copyright);
    formData.append("workingHours", form.workingHours);
    formData.append("address", form.address || "");
    formData.append("footerText", form.footerText);
    formData.append("footerHeading", form.footerHeading);

    setLoading(true);
    try {
      const res = await fetch("https://apiyatraadda.jaspersoftwaresolutions.com/api/setting", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        setForm((prev) => ({
          ...prev,
          logo: data.data.logo ? `https://apiyatraadda.jaspersoftwaresolutions.com${data.data.logo}` : null,
          bgImage: data.data.bgImage ? `https://apiyatraadda.jaspersoftwaresolutions.com${data.data.bgImage}` : null,
          carouselImages: data.data.images
            ? data.data.images.filter((img) => img).map((img) => `https://apiyatraadda.jaspersoftwaresolutions.com${img}`)
            : [],
        }));
        alert("Settings updated successfully ");
      } else {
        alert("Failed to update settings ");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Settings update failed");
    }
    setLoading(false);
  };

  const renderPreview = (fileObj, type, index = null) => {
    if (!fileObj) return null;
    const url =
      typeof fileObj === "string"
        ? fileObj
        : fileObj.preview || URL.createObjectURL(fileObj.file);

    return (
      <div className="relative">
        <img
          src={url}
          alt="preview"
          className="h-20 w-20 object-cover rounded-lg border border-gray-200"
        />
        <button
          onClick={() => handleRemoveImage(type, index)}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
          disabled={loading}
        >
          <X size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-10 py-10 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 text-center tracking-tight">
        Website Settings
      </h2>

      <div className={sectionStyle}>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-4">
          <ImagePlus size={18} className="text-blue-600" /> Website Logo
        </h3>
        <div className="flex items-center gap-4">
          {renderPreview(form.logo, "logo") || (
            <div className="h-20 w-20 bg-gray-100 flex items-center justify-center rounded-lg">
              <ImagePlus size={24} className="text-gray-400" />
            </div>
          )}
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>
      </div>

      <div className={sectionStyle}>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-4">
          <ImagePlus size={18} className="text-blue-600" /> Background Image
        </h3>
        <div className="flex items-center gap-4">
          {renderPreview(form.bgImage, "bgImage") || (
            <div className="h-20 w-20 bg-gray-100 flex items-center justify-center rounded-lg">
              <ImagePlus size={24} className="text-gray-400" />
            </div>
          )}
          <input
            type="file"
            name="bgImage"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>
      </div>

      <div className={sectionStyle}>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-4">
          <ImagePlus size={18} className="text-blue-600" /> Carousel Images (Max 5)
        </h3>
        <div className="flex flex-wrap gap-3 mb-3">
          {form.carouselImages.map((img, index) => (
            <div key={index}>{renderPreview(img, "images", index)}</div>
          ))}
        </div>
        <input
          type="file"
          name="carouselImages"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
        />
      </div>

      <div className={sectionStyle}>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Contact & Social Links
        </h3>
        {[
          "address",
          "phone",
          "email",
          "instagram",
          "facebook",
          "linkedIn",
          "workingHours",
          "copyright",
          "footerText",
          "footerHeading",
        ].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="border p-2 mb-3 rounded w-full"
          />
        ))}
        <button onClick={handleSave} className={buttonStyle} disabled={loading}>
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
