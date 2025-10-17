import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";

const WhistleblowingAdmin = () => {
  const [policies, setPolicies] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "Whistleblowing Policy",
      policyOwner: "",
      reviewDate: "",
      sections: []
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "sections" });

  const fetchPolicies = () => {
    axios.get("https://apiyatraadda.jaspersoftwaresolutions.com/api/whistle")
      .then(res => setPolicies(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const onSubmit = (data) => {
    if (editingId) {
      axios.put(`https://apiyatraadda.jaspersoftwaresolutions.com/api/whistle/${editingId}`, data)
        .then(() => {
          fetchPolicies();
          reset();
          setEditingId(null);
        })
        .catch(err => console.error(err));
    } else {
      axios.post("https://apiyatraadda.jaspersoftwaresolutions.com/api/whistle", data)
        .then(() => {
          fetchPolicies();
          reset();
        })
        .catch(err => console.error(err));
    }
  };

  const handleEdit = (policy) => {
    setEditingId(policy._id);
    reset(policy);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      axios.delete(`https://apiyatraadda.jaspersoftwaresolutions.com/api/whistle/${id}`)
        .then(() => fetchPolicies())
        .catch(err => console.error(err));
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Whistleblowing Policy Admin</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 border p-4 rounded space-y-3">
        <input {...register("title")} placeholder="Policy Title" className="border p-2 w-full" required />
        <input {...register("policyOwner")} placeholder="Policy Owner" className="border p-2 w-full" />
        <input {...register("reviewDate")} placeholder="Review Date" className="border p-2 w-full" />

        <div className="space-y-2">
          <h2 className="font-semibold">Sections</h2>
          {fields.map((section, index) => (
            <div key={section.id} className="border p-2 rounded space-y-1">
              <input {...register(`sections.${index}.heading`)} placeholder="Heading" className="border p-1 w-full" required />
              <textarea {...register(`sections.${index}.content`)} placeholder="Content" className="border p-1 w-full"></textarea>
              <textarea {...register(`sections.${index}.listItems`)} placeholder="List Items (comma-separated)" className="border p-1 w-full"></textarea>
              <button type="button" onClick={() => remove(index)} className="text-red-500">Remove Section</button>
            </div>
          ))}
          <button type="button" onClick={() => append({ heading: "", content: "", listItems: [] })} className="text-blue-500">Add Section</button>
        </div>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          {editingId ? "Update Policy" : "Add Policy"}
        </button>
      </form>

      <div className="space-y-4">
        {policies.map(policy => (
          <div key={policy._id} className="border p-2 rounded flex justify-between items-center">
            <span>{policy.title}</span>
            <div className="space-x-2">
              <button onClick={() => handleEdit(policy)} className="text-yellow-500">Edit</button>
              <button onClick={() => handleDelete(policy._id)} className="text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhistleblowingAdmin;
