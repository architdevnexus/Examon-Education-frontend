import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuickConnect from "./QuickConnect";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";

const ContactUspageForm = () => {
  //  Centralized state for form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    message: "",
  });

  //  Email validation regex
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  //  Phone number validation (basic length & numeric)
  const validatePhone = (phone) => {
    return phone && phone.replace(/\D/g, "").length >= 10;
  };

  //  Input change handler
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //  API base URL (for maintainability)
  const API_BASE = "http://194.238.18.1:3004/api";

  //  Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, phoneNo, message } = formData;

    // 🔍 Validation
    if (!firstName || !lastName || !email || !phoneNo || !message) {
      toast.error("Please fill all fields before submitting.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!validatePhone(phoneNo)) {
      toast.error("Please enter a valid phone number (at least 10 digits).");
      return;
    }

    try {
      // 🌐 Send data to backend API
      const response = await axios.post(`${API_BASE}/contact-us`, {
        fname: firstName,
        lname: lastName,
        email,
        phoneNo,
        message,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(" Message sent successfully!");
        // Reset form after success
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNo: "",
          message: "",
        });
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.error(" Contact form error:", error);
      toast.error("Failed to send message. Please check your connection.");
    }
  };

  return (
    <div className="flex flex-col rounded-2xl shadow-md overflow-hidden gap-8 p-6 bg-white max-w-6xl mx-auto lg:flex-row">
      {/*  Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* ================== Left Section: Contact Form ================== */}
      <div className="flex-1">
        <h2 className="text-2xl font-semibold text-[#003366] mb-2">
          Send us a message
        </h2>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed">
          We'd love to hear from you. Please fill out the form below and our team will respond as soon as possible.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* 👥 Row 1: Name Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                className="w-full rounded-full border border-gray-300 focus:border-[#003366] focus:ring-[#003366] px-4 py-2 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                className="w-full rounded-full border border-gray-300 focus:border-[#003366] focus:ring-[#003366] px-4 py-2 outline-none transition"
              />
            </div>
          </div>

          {/* 📧 Row 2: Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full rounded-full border border-gray-300 focus:border-[#003366] focus:ring-[#003366] px-4 py-2 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <PhoneInput
                country={"in"}
                value={formData.phoneNo}
                placeholder="Enter your phone number"
                onChange={(value) =>
                  setFormData({ ...formData, phoneNo: value })
                }
                inputProps={{
                  name: "phoneNo",
                  required: true,
                }}
                containerClass="!rounded-full"
                inputClass="!w-full !rounded-full !border !border-gray-300 !px-4 !py-2 !focus:border-[#003366] !focus:ring-[#003366] !outline-none"
                buttonClass="!rounded-l-full"
                dropdownClass="!rounded-xl"
              />
            </div>
          </div>

          {/* 📝 Message Box */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter your message"
              rows={4}
              className="w-full rounded-2xl border border-gray-300 focus:border-[#003366] focus:ring-[#003366] px-4 py-3 outline-none transition resize-none"
            ></textarea>
          </div>

          {/* 🚀 Submit Button */}
          <button
            type="submit"
            className="bg-[#003366] text-white rounded-full px-8 py-2 font-medium hover:bg-[#002244] transition self-end cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>

      {/* ================== Right Section: Quick Connect ================== */}
      <div className="flex justify-center lg:justify-end">
        <QuickConnect />
      </div>
    </div>
  );
};

export default ContactUspageForm;
