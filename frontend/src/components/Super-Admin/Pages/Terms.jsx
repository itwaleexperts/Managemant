import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const TermsAdmin = () => {
  const [terms, setTerms] = useState([]);
  const [editingTermId, setEditingTermId] = useState(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      country: "",
      hotelName: "",
      highlight: false
    }
  });

  const fetchTerms = () => {
    axios.get("https://apiyatraadda.jaspersoftwaresolutions.com/api/terms")
      .then(res => {
        const data = res.data.data;
        setTerms(data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const onSubmit = (data) => {
    if (editingTermId) {
      axios.put(`https://apiyatraadda.jaspersoftwaresolutions.com/api/terms/${editingTermId}`, data)
        .then(() => {
          fetchTerms();
          reset();
          setEditingTermId(null);
        })
        .catch(err => console.error(err));
    } else {
      axios.post("https://apiyatraadda.jaspersoftwaresolutions.com/api/terms", data)
        .then(() => {
          fetchTerms();
          reset();
        })
        .catch(err => console.error(err));
    }
  };

  const handleEdit = (term) => {
    setEditingTermId(term._id);
    reset({
      country: term.country,
      hotelName: term.hotelName,
      highlight: term.highlight
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this term?")) {
      axios.delete(`https://apiyatraadda.jaspersoftwaresolutions.com/api/terms/${id}`)
        .then(() => fetchTerms())
        .catch(err => console.error(err));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Terms Admin Panel</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 border p-4 rounded space-y-3">
        <input
          {...register("country")}
          placeholder="Country"
          className="border p-2 w-full"
          required
        />
        <input
          {...register("hotelName")}
          placeholder="Hotel Name"
          className="border p-2 w-full"
          required
        />
        <label className="flex items-center space-x-2">
          <input type="checkbox" {...register("highlight")} />
          <span>Highlight</span>
        </label>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          {editingTermId ? "Update Term" : "Add Term"}
        </button>
      </form>

      {Object.keys(terms).map(country => (
        <div key={country} className="mb-4">
          <h2 className="text-xl font-semibold">{country}</h2>
          <div className="border rounded p-2 mt-2">
            {terms[country].map(term => (
              <div key={term._id} className="flex justify-between items-center border-b py-2">
                <div>
                  <span className={term.highlight ? "font-bold text-blue-600" : ""}>
                    {term.hotelName}
                  </span>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(term)}
                    className="text-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(term._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TermsAdmin;
