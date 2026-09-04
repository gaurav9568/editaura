"use client"
import { useState,useEffect } from "react"
import Navbar from "../components/Navbar"
import FaqDashboard from "../components/FaqDashboard"
import WorkDashboard from "../components/WorkDashboard"
import PackageDashboard from "../components/PackageDashboard"

const Dashboard = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [videoData, setVideoData] = useState([]);

  const [faqs, setFaqs] = useState([]);
  
useEffect(() => {
  const fetchAllData = async () => {
    try {
      const [faqRes, packageRes, videoRes] = await Promise.all([
        fetch("/api/faqs", { headers: { "Content-Type": "application/json" } }),
        fetch("/api/packages"),
        fetch("/api/work")
      ]);

      const faqData = await faqRes.json();
      const packageData = await packageRes.json();
      const videoData = await videoRes.json();

      setFaqs(faqData.faqs);
      setPackages(packageData.packages);
      setVideoData(videoData.videos);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  fetchAllData();
}, []);



  const [page,setPage] = useState("work")

  const renderContent = () =>{  
    switch(page){
      case "work":
        return <WorkDashboard videoData={videoData} setVideoData={setVideoData} loading={loading}/>
        return <></>
      case "packages":
        return <PackageDashboard packages={packages} setPackages={setPackages} loading={loading}/>
      case "faq":
        return <FaqDashboard faqs={faqs} setFaqs={setFaqs} loading={loading}/>
    }

  }

  return (
    <>
    <Navbar setPage={setPage} />
    {renderContent()}
    </>
  )
}

export default Dashboard
