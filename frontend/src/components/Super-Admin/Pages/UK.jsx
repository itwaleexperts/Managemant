import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";

const GuideAdmin = () => {
  const [guides, setGuides] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      slug: "",
      country: "",
      heroImage: "",
      heroSeed: "",
      tagline: "",
      intro: "",
      blocks: [],
      cta: { text: "", bgColor: "" }
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "blocks" });

  const fetchGuides = () => {
    axios.get("https://apiyatraadda.jaspersoftwaresolutions.com/api/uk")
      .then(res => setGuides(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  const onSubmit = (data) => {
    if (editingId) {
      axios.put(`https://apiyatraadda.jaspersoftwaresolutions.com/api/uk/${editingId}`, data)
        .then(() => {
          fetchGuides();
          reset();
          setEditingId(null);
        })
        .catch(err => console.error(err));
    } else {
      axios.post("https://apiyatraadda.jaspersoftwaresolutions.com/api/uk", data)
        .then(() => {
          fetchGuides();
          reset();
        })
        .catch(err => console.error(err));
    }
  };

  const handleEdit = (guide) => {
    setEditingId(guide._id);
    reset(guide);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this guide?")) {
      axios.delete(`https://apiyatraadda.jaspersoftwaresolutions.com/api/uk/${id}`)
        .then(() => fetchGuides())
        .catch(err => console.error(err));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">UK Guides Admin Panel</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 border p-4 rounded space-y-3">
        <input {...register("slug")} placeholder="Slug" className="border p-2 w-full" required />
        <input {...register("country")} placeholder="Country" className="border p-2 w-full" required />
        <input {...register("heroImage")} placeholder="Hero Image URL" className="border p-2 w-full" />
        <input {...register("heroSeed")} placeholder="Hero Image Seed" className="border p-2 w-full" />
        <input {...register("tagline")} placeholder="Tagline" className="border p-2 w-full" />
        <textarea {...register("intro")} placeholder="Intro" className="border p-2 w-full"></textarea>

        <div className="space-y-2">
          <h2 className="font-semibold">Blocks</h2>
          {fields.map((block, index) => (
            <div key={block.id} className="border p-2 rounded space-y-1">
              <input {...register(`blocks.${index}.title`)} placeholder="Title" className="border p-1 w-full" required />
              <textarea {...register(`blocks.${index}.text`)} placeholder="Text" className="border p-1 w-full" required></textarea>
              <input {...register(`blocks.${index}.imageUrl`)} placeholder="Image URL" className="border p-1 w-full" />
              <input {...register(`blocks.${index}.imageSeed`)} placeholder="Image Seed" className="border p-1 w-full" />
              <label className="flex items-center space-x-2">
                <input type="checkbox" {...register(`blocks.${index}.imageOnLeft`)} />
                <span>Image On Left</span>
              </label>
              <button type="button" onClick={() => remove(index)} className="text-red-500">Remove Block</button>
            </div>
          ))}
          <button type="button" onClick={() => append({ title: "", text: "", imageUrl: "", imageSeed: "", imageOnLeft: true })} className="text-blue-500">Add Block</button>
        </div>

        <div className="space-y-1">
          <h2 className="font-semibold">CTA</h2>
          <input {...register("cta.text")} placeholder="CTA Text" className="border p-2 w-full" />
          <input {...register("cta.bgColor")} placeholder="CTA Background Color" className="border p-2 w-full" />
        </div>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          {editingId ? "Update Guide" : "Add Guide"}
        </button>
      </form>

      <div className="space-y-4">
        {guides.map(guide => (
          <div key={guide._id} className="border p-2 rounded flex justify-between items-center">
            <span>{guide.slug} - {guide.country}</span>
            <div className="space-x-2">
              <button onClick={() => handleEdit(guide)} className="text-yellow-500">Edit</button>
              <button onClick={() => handleDelete(guide._id)} className="text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuideAdmin;
