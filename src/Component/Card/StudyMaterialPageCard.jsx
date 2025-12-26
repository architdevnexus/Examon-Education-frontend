import React, { useEffect, useRef, useState } from "react";
import { LuTimerReset } from "react-icons/lu";
import { SiLevelsdotfyi } from "react-icons/si";
import { FaLanguage } from "react-icons/fa6";
import { BsDownload } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

import {
  GlobalWorkerOptions,
  getDocument,
} from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker.min.js?url";

GlobalWorkerOptions.workerSrc = pdfWorker;

const StudyMaterialPageCard = ({ title, level, language, pdfUrl }) => {
  const [showModal, setShowModal] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(true);
  const canvasRef = useRef(null);

  const token = localStorage.getItem("token");

  // Preload PDF
  useEffect(() => {
    if (pdfUrl) fetch(pdfUrl, { method: "HEAD" }).catch(() => {});
  }, [pdfUrl]);

  useEffect(() => {
    if (!showModal) return;

    const loadPdf = async () => {
      try {
        setLoadingPdf(true);

        const pdf = await getDocument(pdfUrl).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;
        setLoadingPdf(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load PDF");
        setLoadingPdf(false);
      }
    };

    loadPdf();
  }, [showModal, pdfUrl]);

  const handleDownload = () => {
    if (!token) return toast.info("Please login to download the PDF.");

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    link.click();
  };

  return (
    <div className="bg-gradient-to-b from-[#EAF5FF] to-[#FFFFFF] rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 w-full max-w-sm">
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
          onClick={() => setShowModal(true)}
          className="px-4 py-2 cursor-pointer bg-white rounded-xl text-sm shadow-sm"
        >
          View
        </button>

        <button
          onClick={handleDownload}
          className="p-2 rounded-full cursor-pointer bg-[var(--primary-color)] text-white"
        >
          <BsDownload size={18} />
        </button>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-999"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-[95%] max-w-7xl h-[80vh] relative overflow-hidden flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute cursor-pointer top-3 right-12 text-gray-200 hover:text-red-500"
              onClick={() => setShowModal(false)}
            >
              <IoClose size={22} />
            </button>

            {loadingPdf && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                <div className="w-64 h-80 animate-pulse bg-gray-200 rounded-lg" />
              </div>
            )}

            <canvas ref={canvasRef} className="max-w-full max-h-full" />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyMaterialPageCard;
