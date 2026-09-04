"use client";
import { useState } from "react";
import { redirect } from "next/navigation";

const VideoDashboard = ({ videoData, setVideoData, loading }) => {
  const [popupMessage, setPopupMessage] = useState("");

  const handleChange = (type, index, value) => {
    setVideoData((prev) =>
      prev.map((item) =>
        item.type === type
          ? {
              ...item,
              videos: item.videos.map((vid, i) =>
                i === index ? value : vid
              ),
            }
          : item
      )
    );
  };

  const handleUpdate = async (type) => {
    const itemToUpdate = videoData.find((v) => v.type === type);
    if (!itemToUpdate) return;

    const res = await fetch("/api/work", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: itemToUpdate.type,
        videos: itemToUpdate.videos,
      }),
    });

    if (res.status === 401) {
      redirect('/admin'); 
    }

    // Show custom popup
    setPopupMessage(`Updated ${type} videos`);
    setTimeout(() => setPopupMessage(""), 3000);
  };

  return (
    <div className="w-full min-h-screen py-32 text-white relative">
      {popupMessage && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow-lg z-50 animate-fade-in">
          {popupMessage}
        </div>
      )}

      {!loading && (
        <div className="mx-auto py-4 px-4 flex flex-col gap-6 max-w-[800px] w-[70%] border-2 border-white">
          <h2 className="text-2xl font-bold mb-2">Video Dashboard</h2>

          {videoData.map((item) => (
            <div key={item.type} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-semibold capitalize mb-3">
                {item.type} Videos
              </h3>
              {item.videos.map((vid, index) => {
                const displayVal =
                  typeof vid === "string"
                    ? vid
                    : vid?.link || vid?.url || vid?.yt || "";
                return (
                  <input
                    key={index}
                    className="mb-2 p-2 w-full bg-gray-900 border border-gray-700 rounded"
                    type="text"
                    value={displayVal}
                    onChange={(e) => {
                      const newVal = e.target.value;
                      const updatedItemVal =
                        typeof vid === "object" && vid !== null
                          ? { ...vid, link: newVal, yt: newVal }
                          : newVal;
                      handleChange(item.type, index, updatedItemVal);
                    }}
                  />
                );
              })}
              <button
                onClick={() => handleUpdate(item.type)}
                className="mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoDashboard;
