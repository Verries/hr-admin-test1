"use client"; // This is a client-side component

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [email, setEmail] = useState("hradmin@test.com");
  const [password, setPassword] = useState("TestPass1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/",
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password. Please try again.");
    } else if (res?.ok) {
      // Redirect to the callback URL after successful sign-in
      window.location.href = res.url ?? "/";
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-r from-[#00A9A6] to-[#006F72] p-6">
      <div className="w-full sm:w-96 bg-white rounded-xl shadow-lg p-10">
        <h1 className="text-4xl font-semibold text-center text-[#0A9396] mb-6">HR System Login</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div>
            <label htmlFor="email" className="text-[#3D3D3D] text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
              className="mt-2 w-full px-4 py-3 border border-[#0A9396] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A9396] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-[#3D3D3D] text-sm font-medium">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="mt-2 w-full px-4 py-3 border border-[#0A9396] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A9396] focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-6 rounded-full bg-[#0A9396] text-white font-medium text-lg transition hover:bg-[#007C7A] focus:outline-none focus:ring-2 focus:ring-[#0A9396] focus:ring-opacity-50 ${loading ? "opacity-50" : ""}`}
          >
            {loading ? (
              <span className="animate-spin">🔄</span> // You can replace it with a spinner
            ) : (
              "Login"
            )}
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-4 text-sm">{error}</p>}
      </div>
    </div>
  );
}
