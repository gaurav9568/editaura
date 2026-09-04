"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Logging in ...");

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Get the ID token
      const idToken = await userCredential.user.getIdToken();

      // Send the token to our API to create a session cookie
      const res = await fetch("/api/admin/session", {
        method: "POST",
        body: JSON.stringify({ idToken }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Login successful! Redirecting...");
        window.location.href = "/admin";
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        setMessage("Invalid email or password");
      } else if (error.code === "auth/invalid-email") {
        setMessage("Invalid email format");
      } else {
        setMessage("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center relative overflow-hidden bg-[#060608]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-[#c8a45a] opacity-[0.015] blur-[150px] pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center max-w-5xl w-full px-6">
        
        {/* Left Side: Branding */}
        <div className="flex flex-col items-center md:border-r border-gray-800/60 pr-0 md:pr-24 mb-16 md:mb-0">
          <div className="mb-6">
            <svg width="52" height="36" viewBox="0 0 52 36" fill="none" stroke="#c8a45a" strokeWidth="1.5">
              <rect x="1" y="1" width="50" height="34" rx="2" />
              <circle cx="26" cy="18" r="6" />
              <circle cx="26" cy="18" r="2" fill="#c8a45a" />
              <rect x="6" y="1" width="4" height="4" fill="#c8a45a" opacity="0.4" />
              <rect x="16" y="1" width="4" height="4" fill="#c8a45a" opacity="0.4" />
              <rect x="26" y="1" width="4" height="4" fill="#c8a45a" opacity="0.4" />
              <rect x="36" y="1" width="4" height="4" fill="#c8a45a" opacity="0.4" />
              <rect x="46" y="1" width="4" height="4" fill="#c8a45a" opacity="0.4" />
              <rect x="6" y="31" width="4" height="4" fill="#c8a45a" opacity="0.4" />
              <rect x="16" y="31" width="4" height="4" fill="#c8a45a" opacity="0.4" />
              <rect x="26" y="31" width="4" height="4" fill="#c8a45a" opacity="0.4" />
              <rect x="36" y="31" width="4" height="4" fill="#c8a45a" opacity="0.4" />
              <rect x="46" y="31" width="4" height="4" fill="#c8a45a" opacity="0.4" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl tracking-[0.25em] font-serif text-white uppercase text-center" style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}>
            Studio
          </h1>
          <h1 className="text-4xl md:text-5xl tracking-[0.25em] font-serif uppercase text-center mt-1" style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif", color: "#c8a45a" }}>
            Admin
          </h1>
          <p className="mt-4 text-[0.6rem] tracking-[0.35em] text-gray-500 uppercase text-center">
            Access The Creative Vault
          </p>
        </div>

        {/* Right Side: Form */}
        <div className="flex flex-col w-full max-w-[380px] pl-0 md:pl-24 relative">
          
          <div className="flex items-center mb-8 relative">
            <h2 className="text-[0.8rem] md:text-xs tracking-[0.3em] font-semibold text-[#c8a45a] uppercase whitespace-nowrap pr-4">
              Sign In
            </h2>
            <div className="h-[1px] w-full bg-gradient-to-r from-[#c8a45a] to-transparent opacity-40 absolute top-[50%] right-0 left-20 rounded-r-full" />
            
            {/* Very faint background highlight for the form section */}
            <div className="absolute top-0 right-0 -left-6 bottom-[-320px] bg-gradient-to-br from-[#111] to-transparent opacity-40 rounded-tr-3xl rounded-br-3xl -z-10 border-t border-r border-[#c8a45a]/10" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[0.55rem] tracking-[0.15em] text-gray-400 uppercase ml-1">Email</label>
              <input
                className="w-full rounded-full bg-[#111115] border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-[#c8a45a] px-5 py-3 text-sm transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="editaura555@gmail.com"
                type="email"
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[0.55rem] tracking-[0.15em] text-gray-400 uppercase ml-1">Password</label>
              <input
                className="w-full rounded-full bg-[#111115] border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-[#c8a45a] px-5 py-3 text-sm transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-4 w-full rounded-full text-black font-bold tracking-[0.2em] text-xs uppercase px-4 py-4 transition-transform hover:scale-[1.02] shadow-[0_0_20px_rgba(200,164,90,0.15)] hover:shadow-[0_0_25px_rgba(200,164,90,0.3)]"
              style={{ background: "linear-gradient(to right, #cfb06b, #eacb88, #cfb06b)" }}
            >
              Sign In
            </button>
            
            {message && (
               <div className="text-center text-xs tracking-widest font-semibold uppercase mt-2 text-[#c8a45a]">
                 {message}
               </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
