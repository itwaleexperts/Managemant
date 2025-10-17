import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CareersPage() {
  const [careerData, setCareerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    hero: { title: "", subtitle: "", imgFile: null },
    intro: "",
    benefits: [], 
    peoplePillars: "",
    testimonials: [], 
    opportunities: [], 
    vacancies: { locations: [], defaultLocation: "Select Location" },
  });

  const API_URL = "https://apiyatraadda.jaspersoftwaresolutions.com/api/careers";

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        if (res.data.success && res.data.data) {
          setCareerData(res.data.data);

          setForm({
            hero: { ...res.data.data.hero, imgFile: null },
            intro: res.data.data.intro || "",
            benefits: res.data.data.benefits?.map((b) => ({ ...b, iconFile: null })) || [],
            peoplePillars: res.data.data.peoplePillars || "",
            testimonials: res.data.data.testimonials?.map((t) => ({ ...t, imgFile: null })) || [],
            opportunities: res.data.data.opportunities?.map((o) => ({ ...o, imgFile: null })) || [],
            vacancies: res.data.data.vacancies || { locations: [], defaultLocation: "Select Location" },
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleHeroChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, hero: { ...prev.hero, [name]: value } }));
  };

  const handleHeroImgChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, hero: { ...prev.hero, imgFile: file } }));
  };

  const handleBenefitChange = (index, field, value) => {
    const newBenefits = [...form.benefits];
    newBenefits[index][field] = value;
    setForm({ ...form, benefits: newBenefits });
  };

  const handleBenefitFileChange = (index, file) => {
    const newBenefits = [...form.benefits];
    newBenefits[index].iconFile = file;
    setForm({ ...form, benefits: newBenefits });
  };

  const handleTestimonialChange = (index, field, value) => {
    const newTestimonials = [...form.testimonials];
    newTestimonials[index][field] = value;
    setForm({ ...form, testimonials: newTestimonials });
  };

  const handleTestimonialFileChange = (index, file) => {
    const newTestimonials = [...form.testimonials];
    newTestimonials[index].imgFile = file;
    setForm({ ...form, testimonials: newTestimonials });
  };

  const handleOpportunityChange = (index, field, value) => {
    const newOpportunities = [...form.opportunities];
    newOpportunities[index][field] = value;
    setForm({ ...form, opportunities: newOpportunities });
  };

  const handleOpportunityFileChange = (index, file) => {
    const newOpportunities = [...form.opportunities];
    newOpportunities[index].imgFile = file;
    setForm({ ...form, opportunities: newOpportunities });
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("hero[title]", form.hero.title);
      formData.append("hero[subtitle]", form.hero.subtitle);
      if (form.hero.imgFile) formData.append("images", form.hero.imgFile);

      formData.append("intro", form.intro);
      formData.append("peoplePillars", form.peoplePillars);

      form.benefits.forEach((b, i) => {
        formData.append(`benefits[${i}][title]`, b.title);
        formData.append(`benefits[${i}][icon]`, b.icon);
        if (b.iconFile) formData.append("images", b.iconFile);
      });

      form.testimonials.forEach((t, i) => {
        formData.append(`testimonials[${i}][name]`, t.name);
        formData.append(`testimonials[${i}][text]`, t.text);
        if (t.imgFile) formData.append("images", t.imgFile);
      });

      form.opportunities.forEach((o, i) => {
        formData.append(`opportunities[${i}][role]`, o.role);
        formData.append(`opportunities[${i}][desc]`, o.desc || "");
        if (o.imgFile) formData.append("images", o.imgFile);
      });

      form.vacancies.locations.forEach((loc, i) => {
        formData.append(`vacancies[locations][${i}]`, loc);
      });
      formData.append("vacancies[defaultLocation]", form.vacancies.defaultLocation);

      let res;
      if (careerData?._id) {
        res = await axios.put(`${API_URL}/${careerData._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Career data updated successfully!");
      } else {
        res = await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Career data created successfully!");
      }

      setCareerData(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Error saving data: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async () => {
    if (!careerData?._id) return alert("No data to delete");
    if (!window.confirm("Are you sure you want to delete this data?")) return;

    try {
      await axios.delete(`${API_URL}/${careerData._id}`);
      setCareerData(null);
      setForm({
        hero: { title: "", subtitle: "", imgFile: null },
        intro: "",
        benefits: [],
        peoplePillars: "",
        testimonials: [],
        opportunities: [],
        vacancies: { locations: [], defaultLocation: "Select Location" },
      });
      alert("Career data deleted!");
    } catch (err) {
      console.error(err);
      alert("Error deleting: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow space-y-6">
      <h1 className="text-3xl font-bold mb-4">Manage Careers Page</h1>

      <div className="space-y-2 mb-4">
        <label className="block font-semibold">Hero Title</label>
        <input
          type="text"
          name="title"
          value={form.hero.title}
          onChange={handleHeroChange}
          className="border p-2 w-full"
        />

        <label className="block font-semibold">Hero Subtitle</label>
        <input
          type="text"
          name="subtitle"
          value={form.hero.subtitle}
          onChange={handleHeroChange}
          className="border p-2 w-full"
        />

        <label className="block font-semibold mt-2">Hero Image</label>
        {form.hero.imgFile && (
          <img
            src={URL.createObjectURL(form.hero.imgFile)}
            alt="Hero Preview"
            className="w-full h-40 object-cover mb-2 rounded"
          />
        )}
        {careerData?.hero?.img && !form.hero.imgFile && (
          <img
            src={careerData.hero.img}
            alt="Hero Preview"
            className="w-full h-40 object-cover mb-2 rounded"
          />
        )}
        <input type="file" accept="image/*" onChange={handleHeroImgChange} className="border p-2 w-full rounded" />
      </div>

      <div>
        <label className="block font-semibold">Intro</label>
        <textarea name="intro" value={form.intro} onChange={handleChange} rows={3} className="border p-2 w-full" />
      </div>

      <div>
        <label className="block font-semibold">People Pillars</label>
        <textarea
          name="peoplePillars"
          value={form.peoplePillars}
          onChange={handleChange}
          rows={3}
          className="border p-2 w-full"
        />
      </div>

      <div className="mt-4">
        <h2 className="font-semibold mb-2">Benefits</h2>
        {form.benefits.map((b, i) => (
          <div key={i} className="mb-2 border p-2 rounded space-y-1">
            <input
              type="text"
              placeholder="Title"
              value={b.title}
              onChange={(e) => handleBenefitChange(i, "title", e.target.value)}
              className="border p-1 w-full"
            />
            <input
              type="text"
              placeholder="Icon URL"
              value={b.icon}
              onChange={(e) => handleBenefitChange(i, "icon", e.target.value)}
              className="border p-1 w-full"
            />
            {b.iconFile && <img src={URL.createObjectURL(b.iconFile)} alt="Benefit Icon" className="h-16 w-16 object-cover" />}
            <input type="file" accept="image/*" onChange={(e) => handleBenefitFileChange(i, e.target.files[0])} />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setForm({ ...form, benefits: [...form.benefits, { title: "", icon: "", iconFile: null }] })}
          className="bg-green-500 text-white px-2 py-1 rounded"
        >
          + Add Benefit
        </button>
      </div>

      <div className="mt-4">
        <h2 className="font-semibold mb-2">Testimonials</h2>
        {form.testimonials.map((t, i) => (
          <div key={i} className="mb-2 border p-2 rounded space-y-1">
            <input
              type="text"
              placeholder="Name"
              value={t.name}
              onChange={(e) => handleTestimonialChange(i, "name", e.target.value)}
              className="border p-1 w-full"
            />
            <textarea
              placeholder="Text"
              value={t.text}
              onChange={(e) => handleTestimonialChange(i, "text", e.target.value)}
              className="border p-1 w-full"
            />
            {t.imgFile && <img src={URL.createObjectURL(t.imgFile)} alt="Testimonial" className="h-20 w-20 object-cover" />}
            {t.img && !t.imgFile && <img src={t.img} alt="Testimonial" className="h-20 w-20 object-cover" />}
            <input type="file" accept="image/*" onChange={(e) => handleTestimonialFileChange(i, e.target.files[0])} />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setForm({ ...form, testimonials: [...form.testimonials, { name: "", text: "", imgFile: null }] })}
          className="bg-green-500 text-white px-2 py-1 rounded"
        >
          + Add Testimonial
        </button>
      </div>

      <div className="mt-4">
        <h2 className="font-semibold mb-2">Opportunities</h2>
        {form.opportunities.map((o, i) => (
          <div key={i} className="mb-2 border p-2 rounded space-y-1">
            <input
              type="text"
              placeholder="Role"
              value={o.role}
              onChange={(e) => handleOpportunityChange(i, "role", e.target.value)}
              className="border p-1 w-full"
            />
            <textarea
              placeholder="Description"
              value={o.desc}
              onChange={(e) => handleOpportunityChange(i, "desc", e.target.value)}
              className="border p-1 w-full"
            />
            {o.imgFile && <img src={URL.createObjectURL(o.imgFile)} alt="Opportunity" className="h-20 w-20 object-cover" />}
            {o.img && !o.imgFile && <img src={o.img} alt="Opportunity" className="h-20 w-20 object-cover" />}
            <input type="file" accept="image/*" onChange={(e) => handleOpportunityFileChange(i, e.target.files[0])} />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setForm({ ...form, opportunities: [...form.opportunities, { role: "", desc: "", imgFile: null }] })}
          className="bg-green-500 text-white px-2 py-1 rounded"
        >
          + Add Opportunity
        </button>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {careerData ? "Update" : "Create"}
        </button>
        {careerData && (
          <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
