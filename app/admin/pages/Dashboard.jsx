"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FaqDashboard from "../components/FaqDashboard";
import WorkDashboard from "../components/WorkDashboard";
import PackageDashboard from "../components/PackageDashboard";

export default function Dashboard() {
  const [packages, setPackages] = useState([]);
  const [videoData, setVideoData] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("work");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [faqRes, packageRes, videoRes] = await Promise.all([
          fetch("/api/faqs"),
          fetch("/api/packages"),
          fetch("/api/work"),
        ]);

        const faqData = await faqRes.json();
        const packageData = await packageRes.json();
        const videoDataRes = await videoRes.json();

        setFaqs(faqData?.faqs || []);
        setPackages(packageData?.packages || []);
        setVideoData(videoDataRes?.videos || []);
      } catch (err) {
        console.error("Error fetching admin data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const renderContent = () => {
    switch (page) {
      case "work":
        return (
          <WorkDashboard
            videoData={videoData}
            setVideoData={setVideoData}
            loading={loading}
          />
        );
      case "packages":
        return (
          <PackageDashboard
            packages={packages}
            setPackages={setPackages}
            loading={loading}
          />
        );
      case "faq":
        return (
          <FaqDashboard
            faqs={faqs}
            setFaqs={setFaqs}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] text-[#f0e8d8] relative selection:bg-[#c8a45a] selection:text-black">
      {/* Background ambient gold gradient glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(circle 800px at 50% -100px, rgba(200, 164, 90, 0.08), transparent 70%),
            radial-gradient(circle 600px at 80% 80%, rgba(200, 164, 90, 0.04), transparent 70%)
          `,
        }}
      />

      <Navbar
        page={page}
        setPage={setPage}
        counts={{
          work: videoData.reduce((acc, cat) => acc + (cat.videos?.length || 0), 0),
          packages: packages.length,
          faq: faqs.length,
        }}
      />

      <main className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
}
