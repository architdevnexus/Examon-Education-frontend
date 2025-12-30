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
  const [loadingPdf, setLoadingPdf] = useState(false);
  const containerRef = useRef(null);

  const token = localStorage.getItem("token");

  /* ---------------- LOAD PDF ---------------- */
  useEffect(() => {
    if (!showModal || !pdfUrl) return;

    let cancelled = false;

    const loadPdf = async () => {
      try {
        setLoadingPdf(true);
        containerRef.current.innerHTML = "";

        const pdf = await getDocument({
          url: pdfUrl,
          withCredentials: false,
        }).promise;

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          if (cancelled) return;

          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.5 });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.className = "mb-6 shadow rounded";

          containerRef.current.appendChild(canvas);

          await page.render({
            canvasContext: context,
            viewport,
          }).promise;
        }

        setLoadingPdf(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load PDF");
        setLoadingPdf(false);
      }
    };

    loadPdf();

    return () => {
      cancelled = true;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [showModal, pdfUrl]);

  /* ---------------- DOWNLOAD ---------------- */
  const handleDownload = () => {
    if (!token) {
      toast.info("Please login to download the PDF.");
      return;
    }

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    link.target = "_blank";
    link.click();
  };

  return (
    <div className="bg-gradient-to-b from-[#EAF5FF] to-white rounded-2xl shadow-sm hover:shadow-md transition-all w-full max-w-sm">
      <div className="p-4">
        <img src="/logo2.svg" alt="logo" className="w-12 h-12 mb-3" />
        <h2 className="text-black text-lg font-semibold mb-2">{title}</h2>

        <div className="text-gray-700 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <LuTimerReset className="text-[var(--primary-color)]" />
            <span>View / Download PDF</span>
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

      <div className="p-3 flex justify-end gap-3 bg-[var(--primary-color)] rounded-b-2xl">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 cursor-pointer bg-white rounded-xl text-sm"
        >
          View
        </button>

        <button
          onClick={handleDownload}
          className="p-2 rounded-full cursor-pointer bg-white"
        >
          <BsDownload size={18} />
        </button>
      </div>

      {/* ---------------- MODAL ---------------- */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex justify-center items-center"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-[95%] max-w-6xl h-[85vh] relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
              onClick={() => setShowModal(false)}
            >
              <IoClose size={22} />
            </button>

            {loadingPdf && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                <div className="w-64 h-80 animate-pulse bg-gray-200 rounded-lg" />
              </div>
            )}

            {/* PDF SCROLL AREA */}
            <div
              ref={containerRef}
              className="flex-1 overflow-y-auto p-6 bg-gray-100"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyMaterialPageCard;
