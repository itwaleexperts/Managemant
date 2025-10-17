import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm, useFieldArray, Controller } from "react-hook-form";

const SupplierAdmin = () => {
  const [supplierData, setSupplierData] = useState(null);
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      hero: { title: "", subtitle: "" },
      introduction: "",
      sections: [],
      footerMessage: ""
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections"
  });

  useEffect(() => {
    axios.get("https://apiyatraadda.jaspersoftwaresolutions.com/api/supplier")  
      .then(res => {
        if (res.data.data) {
          setSupplierData(res.data.data);
          reset(res.data.data);
        }
      })
      .catch(err => console.error(err));
  }, [reset]);

  const onSubmit = (data) => {
    if (supplierData?._id) {
      axios.put(`https://apiyatraadda.jaspersoftwaresolutions.com/api/supplier/${supplierData._id}`, data)
        .then(res => {
          alert("Updated successfully");
          setSupplierData(res.data.data);
        })
        .catch(err => console.error(err));
    } else {
      axios.post("https://apiyatraadda.jaspersoftwaresolutions.com/api/supplier", data)
        .then(res => {
          alert("Created successfully");
          setSupplierData(res.data.data);
        })
        .catch(err => console.error(err));
    }
  };

  const handleDeleteSection = (index) => {
    remove(index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Supplier Code of Conduct Admin</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Hero Section</h2>
          <input
            {...register("hero.title")}
            placeholder="Hero Title"
            className="border p-2 w-full mb-2"
          />
          <input
            {...register("hero.subtitle")}
            placeholder="Hero Subtitle"
            className="border p-2 w-full"
          />
        </div>

        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Introduction</h2>
          <textarea
            {...register("introduction")}
            placeholder="Introduction Text"
            className="border p-2 w-full"
            rows={3}
          />
        </div>

        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Sections</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="mb-4 border p-2 rounded relative">
              <input
                {...register(`sections.${index}.title`)}
                placeholder="Section Title"
                className="border p-2 w-full mb-2"
              />
              <textarea
                {...register(`sections.${index}.content`)}
                placeholder="Section Content"
                className="border p-2 w-full"
                rows={3}
              />
              <button
                type="button"
                onClick={() => handleDeleteSection(index)}
                className="absolute top-2 right-2 text-red-500 font-bold"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ title: "", content: "" })}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Add Section
          </button>
        </div>

        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Footer Message</h2>
          <input
            {...register("footerMessage")}
            placeholder="Footer Message"
            className="border p-2 w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default SupplierAdmin;
