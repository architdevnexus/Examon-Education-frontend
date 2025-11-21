import React, { useState } from "react";
import { LuTimerReset } from "react-icons/lu";
import { SiLevelsdotfyi } from "react-icons/si";
import { FaLanguage } from "react-icons/fa6";
import { BsDownload } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

const StudyMaterialPageCard = ({ title, level, language, pdfUrl }) => {
    const [showModal, setShowModal] = useState(false);

    const token = localStorage.getItem("token")

    const handleDownload = () => {
        if (!token) {
            toast.info("Please login to download the PDF.");
        } else {

            const link = document.createElement("a");
            link.href = pdfUrl;
            link.download = `${title}.pdf`;
            link.click();
        }
    };

    return (
        <div className="bg-gradient-to-b from-[#EAF5FF] to-[#FFFFFF]  rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 w-full max-w-sm">

            <div className="p-3">


                <img src="/logo2.svg" alt="logo" className="w-12 h-12 mb-3" />

                <h2 className="text-black text-lg font-semibold mb-2">{title}</h2>

                <div className="text-gray-700 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <LuTimerReset className="text-[var(--primary-color)]" />
                        <span>Download / View PDF</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <SiLevelsdotfyi className="text-[var(--primary-color)]" />
                        <span>{level}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <FaLanguage className="text-[var(--primary-color)]" />
                        <span>{language}</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 p-3 flex justify-end items-center rounded-2xl gap-3 bg-[var(--primary-color)]">
                <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 text-black cursor-pointer rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition text-sm font-medium shadow-sm"
                >
                    View
                </button>

                <button
                    onClick={handleDownload}
                    className="p-2 cursor-pointer rounded-full bg-[var(--primary-color)] hover:bg-blue-600 text-white transition"
                >
                    <BsDownload size={18} />
                </button>
            </div>

            {/* PDF View Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-999"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl w-[95%] max-w-3xl h-[80vh] relative overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-black"
                            onClick={() => setShowModal(false)}
                        >
                            <IoClose size={22} />
                        </button>

                        <iframe
                            src={`${pdfUrl}#toolbar=0`}
                            title="PDF Preview"
                            className="w-full h-full border-0 rounded-b-2xl"
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudyMaterialPageCard;
