import React from "react";
import { IoIosCall } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";

const QuickConnect = () => {
  const DataLink = [
    {
      icon: <IoIosCall size={24} />,
      title: "Helpline",
      details: "+971 110 3405",
      path: "tel:+9711103405",
    },
    {
      icon: <FaWhatsapp size={24} />,
      title: "SMS / Whatsapp",
      details: "+971 110 3405",
      path: "https://wa.me/9711103405",
    },
    {
      icon: <MdEmail size={24} />,
      title: "Email",
      details: "support@examon.in",
      path: "mailto:support@examon.in",
    },
     {
      icon: <CiLocationOn size={24} />,
      title: "Head Quater",
      details: "Examo Learning Private Limited, 2nd Floor, 100, Sector 43, Gurugram, Haryana 122009",
      path: "https://www.google.com/maps/dir//2nd+Floor,+100,+Sector+43,+Gurugram,+Haryana+122009/@28.4131328,77.0473984,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x390d19a38b97328d:0x996ed6aa68383d52!2m2!1d77.0905234!2d28.4616212?entry=ttu&g_ep=EgoyMDI1MTIwMS4wIKXMDSoASAFQAw%3D%3D",
    }
  ];

  const SocialLinks = [
    { icon: <FaFacebook size={22} />, path: "#" },
    { icon: <FaInstagram size={22} />, path: "#" },
    { icon: <FaLinkedin size={22} />, path: "#" },
    { icon: <FaYoutube size={22} />, path: "#" },
  ];

  return (
    <div className="bg-[#003366] text-white rounded-2xl p-6 w-sm shadow-lg">
      {/* Header */}
      <h2 className="text-xl font-semibold mb-5">
        Hi! We are always here to <br />
        <span className="underline underline-offset-4 decoration-white">
          help you.
        </span>
      </h2>

      {/* Contact Boxes */}
      <div className="flex flex-col gap-3">
        {DataLink.map((data, index) => (
          <a
            href={data.path}
            key={index}
            className="flex items-center gap-3 bg-[#5A7AA5] hover:bg-[#6B8CBF] transition-all p-3 rounded-lg"
          >
            <div className="bg-white/20 p-2 rounded-full">{data.icon}</div>
            <div className="flex flex-col">
              <span className="font-medium">{data.title}</span>
              <span className="text-sm opacity-90">{data.details}</span>
            </div>
          </a>
        ))}
      </div>

      {/* Divider */}
      <hr className="my-5 border-white/30" />

      {/* Social Connect */}
      <div>
        <span className="font-medium block mb-3">Connect with us on:</span>
        <div className="flex items-center gap-4">
          {SocialLinks.map((social, i) => (
            <a
              key={i}
              href={social.path}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/40 transition-all p-2 rounded-full"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickConnect;
