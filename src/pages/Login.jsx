import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter email and password.");
      toast.error("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      if (res.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data?.msg || "Login failed. Please check your credentials.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-green-950/65"></div>

      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-md shadow-2xl border border-white/40 p-8"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-800">
            Login
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Access your AI Farm Doctor dashboard
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-700"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-700"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-[#245a45] px-4 py-3 text-white font-medium shadow-md transition hover:bg-[#1d4a39] disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-semibold text-[#245a45]">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}