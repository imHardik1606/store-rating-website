import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    role: "", // default role
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (formData.password !== formData.confirmPassword) {
  //     setError("Passwords do not match!");
  //     toast.error("Passwords do not match ❌");
  //     return;
  //   }

  //   try {
  //     await axios.post(`${API_BASE_URL}/auth/register`, {
  //       name: formData.name,
  //       email: formData.email,
  //       password: formData.password,
  //       address: formData.address,
  //       role: formData.role,
  //     });

  //     toast.success("Registration successful! 🎉");
  //     navigate("/login");
  //   } catch (err) {
  //     setError("Registration failed. Please try again.");
  //     toast.error("Registration failed ❌");
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  // Log formData to compare with Postman payload
  console.log("Form data sent:", formData);

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match!");
    toast.error("Passwords do not match ❌");
    return;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      address: formData.address,
      role: formData.role,
    });
    toast.success("Registration successful! 🎉");
    navigate("/");
  } catch (err) {
    console.log("Error response:", err.response?.data); // Log server response
    const errorMsg =
      err.response?.data?.errors?.[0]?.msg ||
      err.response?.data?.error ||
      "Registration failed. Please try again.";
    setError(errorMsg);
    toast.error(errorMsg);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/70 backdrop-blur-xl border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Create your account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/60 backdrop-blur-sm"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/60 backdrop-blur-sm"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/60 backdrop-blur-sm"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/60 backdrop-blur-sm"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/60 backdrop-blur-sm"
          />

          {/* Role Dropdown */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/60 backdrop-blur-sm"
          >
            <option value="user">User</option>
            <option value="owner">Store Owner</option>
          </select>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-gray-600 text-center mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
