import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminHistoryLessons() {
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState({
    heroTitle: "",
    heroBanner: { imageUrl: "", overlayText: "" },
    videos: [],
    textSections: [],
    callToAction: { title: "", buttonText: "" },
  });
  const [editingId, setEditingId] = useState(null);

  const apiUrl = "https://apiyatraadda.jaspersoftwaresolutions.com/api/history";

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await axios.get(apiUrl);
      setLessons(res.data ? [res.data] : []);
    } catch (err) { console.error(err); }
  };

  const handleChange = (e, path) => {
    if (!path) {
      setForm({ ...form, [e.target.name]: e.target.value });
    } else {
      const keys = path.split(".");
      let temp = { ...form };
      let obj = temp;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = e.target.value;
      setForm(temp);
    }
  };

  const addVideo = () => setForm({ ...form, videos: [...form.videos, { title: "", url: "", description: "" }] });
  const addTextSection = () => setForm({ ...form, textSections: [...form.textSections, { heading: "", content: "", imageUrl: "" }] });

  const handleVideoChange = (index, e) => {
    const videos = [...form.videos];
    videos[index][e.target.name] = e.target.value;
    setForm({ ...form, videos });
  };

  const handleTextChange = (index, e) => {
    const textSections = [...form.textSections];
    textSections[index][e.target.name] = e.target.value;
    setForm({ ...form, textSections });
  };

  const submitLesson = async () => {
    try {
      if (editingId) {
        await axios.put(`${apiUrl}/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post(apiUrl, form);
      }
      setForm({
        heroTitle: "",
        heroBanner: { imageUrl: "", overlayText: "" },
        videos: [],
        textSections: [],
        callToAction: { title: "", buttonText: "" },
      });
      fetchLessons();
    } catch (err) { console.error(err); alert("Error saving lesson"); }
  };

  const editLesson = (lesson) => {
    setForm(lesson);
    setEditingId(lesson._id);
  };

  const deleteLesson = async (id) => {
    if (!window.confirm("Delete this lesson?")) return;
    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchLessons();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">History Lessons Admin</h1>

      <div className="mb-6 p-4 border rounded">
        <h2 className="font-semibold mb-2">{editingId ? "Edit Lesson" : "Create New Lesson"}</h2>
        <input placeholder="Hero Title" name="heroTitle" value={form.heroTitle} onChange={handleChange} className="border p-2 w-full mb-2" />
        <input placeholder="Banner Image URL" name="imageUrl" value={form.heroBanner.imageUrl} onChange={(e) => handleChange(e, "heroBanner.imageUrl")} className="border p-2 w-full mb-2" />
        <input placeholder="Banner Overlay Text" name="overlayText" value={form.heroBanner.overlayText} onChange={(e) => handleChange(e, "heroBanner.overlayText")} className="border p-2 w-full mb-2" />

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Videos</h3>
          {form.videos.map((v, idx) => (
            <div key={idx} className="mb-2">
              <input placeholder="Title" name="title" value={v.title} onChange={(e) => handleVideoChange(idx, e)} className="border p-1 w-full mb-1" />
              <input placeholder="URL" name="url" value={v.url} onChange={(e) => handleVideoChange(idx, e)} className="border p-1 w-full mb-1" />
              <input placeholder="Description" name="description" value={v.description} onChange={(e) => handleVideoChange(idx, e)} className="border p-1 w-full mb-1" />
            </div>
          ))}
          <button onClick={addVideo} className="bg-blue-500 text-white px-2 py-1 rounded mb-2">Add Video</button>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Text Sections</h3>
          {form.textSections.map((t, idx) => (
            <div key={idx} className="mb-2">
              <input placeholder="Heading" name="heading" value={t.heading} onChange={(e) => handleTextChange(idx, e)} className="border p-1 w-full mb-1" />
              <textarea placeholder="Content" name="content" value={t.content} onChange={(e) => handleTextChange(idx, e)} className="border p-1 w-full mb-1" />
              <input placeholder="Image URL" name="imageUrl" value={t.imageUrl} onChange={(e) => handleTextChange(idx, e)} className="border p-1 w-full mb-1" />
            </div>
          ))}
          <button onClick={addTextSection} className="bg-blue-500 text-white px-2 py-1 rounded mb-2">Add Text Section</button>
        </div>

        <input placeholder="CTA Title" name="title" value={form.callToAction.title} onChange={(e) => handleChange(e, "callToAction.title")} className="border p-2 w-full mb-2" />
        <input placeholder="CTA Button Text" name="buttonText" value={form.callToAction.buttonText} onChange={(e) => handleChange(e, "callToAction.buttonText")} className="border p-2 w-full mb-2" />

        <button onClick={submitLesson} className="bg-green-600 text-white px-4 py-2 rounded">{editingId ? "Update Lesson" : "Create Lesson"}</button>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Existing Lessons</h2>
        {lessons.map((lesson) => (
          <div key={lesson._id} className="border p-3 mb-2 rounded flex justify-between items-center">
            <div>
              <p><strong>{lesson.heroTitle}</strong></p>
              <p>{lesson.heroBanner.overlayText}</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => editLesson(lesson)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
              <button onClick={() => deleteLesson(lesson._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
