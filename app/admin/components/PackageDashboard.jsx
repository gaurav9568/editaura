"use client";
import { useState } from "react";
import { redirect } from "next/navigation";

const PackageDashboard = ({ packages, setPackages, loading }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    billing: "",
    features: [""],
  });

  const handleFeatureChange = (index, value) => {
    const updated = [...form.features];
    updated[index] = value;
    setForm({ ...form, features: updated });
  };

  const addFeatureField = () => {
    setForm({ ...form, features: [...form.features, ""] });
  };

  const removeFeatureField = (index) => {
    const updated = form.features.filter((_, i) => i !== index);
    setForm({ ...form, features: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/packages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.status === 401) {
      redirect('/admin'); 
    }

    const newPackage = await res.json();
    setPackages((prev) => [...prev, newPackage.pkg]);

    setForm({
      name: "",
      price: "",
      billing: "",
      features: [""],
    });
  };

  const handleDelete = async (id) => {
    const res = await fetch("/api/packages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.status === 401) {
      redirect('/admin'); 
    }

    setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
  };

  return (
    <div className="w-full min-h-screen py-32 text-white">
      {!loading && (
        <div className="mx-auto py-4 px-4 flex flex-col gap-6 max-w-[800px] w-[70%] border-2 border-white">
          <h2 className="text-2xl font-bold mb-2">Packages</h2>

          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-semibold">{pkg.name}</h3>
              <p className="text-sm">
                {pkg.price} — {pkg.billing}
              </p>
              <ul className="list-disc pl-5 text-sm mt-2">
                {pkg.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <button
                className="mt-2 text-red-400 hover:text-red-200 text-sm cursor-pointer"
                onClick={() => handleDelete(pkg.id)}
              >
                Delete
              </button>
            </div>
          ))}

          <form
            onSubmit={handleSubmit}
            className="bg-gray-900 p-4 rounded-lg flex flex-col gap-2 mt-8"
          >
            <h3 className="text-lg font-semibold">Add New Package</h3>
            <input
              className="p-2 bg-gray-800 border border-gray-700 rounded"
              type="text"
              placeholder="Package Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="p-2 bg-gray-800 border border-gray-700 rounded"
              type="text"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <input
              className="p-2 bg-gray-800 border border-gray-700 rounded"
              type="text"
              placeholder="Billing (e.g. per month)"
              value={form.billing}
              onChange={(e) => setForm({ ...form, billing: e.target.value })}
            />

            <div className="flex flex-col gap-2">
              {form.features.map((feature, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded"
                    placeholder={`Feature ${i + 1}`}
                    value={feature}
                    onChange={(e) => handleFeatureChange(i, e.target.value)}
                  />
                  {form.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeatureField(i)}
                      className="text-red-400 hover:text-red-200 text-sm cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeatureField}
                className="text-blue-400 hover:text-blue-200 text-sm mt-1 cursor-pointer"
              >
                + Add Feature
              </button>
            </div>

            <button
              type="submit"
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer"
            >
              Add Package
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PackageDashboard;
