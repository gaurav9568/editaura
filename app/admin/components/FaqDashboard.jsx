"use client";
import { useState } from "react";
import { redirect } from "next/navigation";

const FaqDashboard = ({ faqs, setFaqs, loading }) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const handleDelete = async (id) => {
    const res = await fetch(`/api/faqs`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    if (res.status === 401) {
      redirect('/admin'); 
    }

    // Update client state without refetching
    setFaqs((prev) => prev.filter((faq) => faq.id !== id));
  };

  const handleAddFaq = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const res = await fetch("/api/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: newQuestion, answer: newAnswer }),
    });

    if (res.status === 401) {
      redirect('/admin'); 
    }

    const newFaq = await res.json(); // assuming API returns the created FAQ
    setFaqs((prev) => [...prev, newFaq.faq]);

    setNewQuestion("");
    setNewAnswer("");
  };

  return (
    <div className="w-full min-h-screen py-32 text-white">
      {!loading && (
        <div className="mx-auto py-4 px-4 flex flex-col gap-3 max-w-[700px] w-[60%] border-2 border-white">
          <h2 className="text-xl font-bold mb-4">FAQs</h2>
          {faqs.map((faq, i) => (
            <div key={faq.id || i} className="flex flex-col gap-1 p-3 bg-gray-800 rounded-lg">
              <div>Q. {faq.question}</div>
              <div>A. {faq.answer}</div>
              <button
                className="mt-2 self-end text-sm text-red-400 hover:text-red-200 cursor-pointer"
                onClick={() => handleDelete(faq.id)}
              >
                Delete
              </button>
            </div>
          ))}

          <form onSubmit={handleAddFaq} className="mt-8 flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Add New FAQ</h3>
            <input
              className="p-2 bg-gray-900 border border-gray-700 rounded"
              type="text"
              placeholder="Question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <input
              className="p-2 bg-gray-900 border border-gray-700 rounded"
              type="text"
              placeholder="Answer"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
            />
            <button
              type="submit"
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded cursor-pointer"
            >
              Add FAQ
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FaqDashboard;
