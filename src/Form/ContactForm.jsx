import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";

const ContactForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // ✅ Validation Logic
  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Please enter a valid email address.";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^[0-9]{10}$/.test(form.phone))
      newErrors.phone = "Enter a valid 10-digit phone number.";
    if (!form.message.trim()) newErrors.message = "Message cannot be empty.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("✅ Submitted:", form);
      setSuccess(true);
      setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" });
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl mx-auto border border-gray-100"
    >
      <h2 className="text-2xl font-semibold text-[var(--primary-color)] mb-6 text-center">
        Get In Touch
      </h2>

      {/* Row 1: Names */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            className={`w-full border rounded-xl px-4 py-2 focus:outline-none transition ${
              errors.firstName
                ? "border-red-500 focus:ring-1 focus:ring-red-400"
                : "border-gray-300 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)]"
            }`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            className={`w-full border rounded-xl px-4 py-2 focus:outline-none transition ${
              errors.lastName
                ? "border-red-500 focus:ring-1 focus:ring-red-400"
                : "border-gray-300 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)]"
            }`}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className={`w-full border rounded-xl px-4 py-2 focus:outline-none transition ${
            errors.email
              ? "border-red-500 focus:ring-1 focus:ring-red-400"
              : "border-gray-300 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)]"
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Phone No
        </label>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          className={`w-full border rounded-xl px-4 py-2 focus:outline-none transition ${
            errors.phone
              ? "border-red-500 focus:ring-1 focus:ring-red-400"
              : "border-gray-300 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)]"
          }`}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Message */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Message
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Enter your message"
          rows={4}
          className={`w-full border rounded-xl px-4 py-2 focus:outline-none transition ${
            errors.message
              ? "border-red-500 focus:ring-1 focus:ring-red-400"
              : "border-gray-300 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)]"
          }`}
        ></textarea>
        {errors.message && (
          <p className="text-red-500 text-xs mt-1">{errors.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-[var(--primary-color)] text-white font-semibold py-3 rounded-xl 
                   flex items-center justify-center gap-2 hover:bg-opacity-90 
                   transition-all duration-200 shadow-md"
      >
      <FaArrowRight className="text-sm" />  Send Message 
      </button>

      {/* Success Message */}
      {success && (
        <p className="text-green-600 text-center mt-4 font-medium animate-pulse">
          Message sent successfully!
        </p>
      )}
    </form>
  );
};

export default ContactForm;
