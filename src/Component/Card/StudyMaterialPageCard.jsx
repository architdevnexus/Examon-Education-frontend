import React, { useEffect, useRef, useState, useMemo } from "react";
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

  /* ---------------- PREVIEW URL (HTTPS ONLY) ---------------- */
  const previewUrl = useMemo(() => {
    if (!pdfUrl) return "";

    let url = pdfUrl.replace(/^http:\/\//i, "https://");

    // Force Cloudinary inline rendering
    if (url.includes("/upload/")) {
      url = url.replace("/upload/", "/upload/fl_inline/");
    }

    return url;
  }, [pdfUrl]);

  /* ---------------- LOAD PDF (VIEW ONLY) ---------------- */
  useEffect(() => {
    if (!showModal || !previewUrl) return;

    let cancelled = false;

    const loadPdf = async () => {
      try {
        setLoadingPdf(true);
        containerRef.current.innerHTML = "";

        const pdf = await getDocument({
          url: previewUrl,
        }).promise;

        const isMobile = window.innerWidth < 640;
        const scale = isMobile ? 1.1 : 1.6;

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          if (cancelled) return;

          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.maxWidth = "100%";
          canvas.style.height = "auto";
          canvas.className =
            "mb-4 shadow rounded bg-white mx-auto";

          containerRef.current.appendChild(canvas);

          await page.render({
            canvasContext: context,
            viewport,
          }).promise;
        }

        setLoadingPdf(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load PDF preview");
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
  }, [showModal, previewUrl]);

  /* ---------------- DOWNLOAD (ORIGINAL URL) ---------------- */
  const handleDownload = () => {
    if (!token) {
      toast.info("Please login to download the PDF.");
      return;
    }

    const link = document.createElement("a");
    link.href = pdfUrl; // 🔥 ORIGINAL URL
    link.download = `${title}.pdf`;
    link.target = "_blank";
    link.rel = "noopener";
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
          className="px-4 py-2 bg-white rounded-xl text-sm"
        >
          View
        </button>

        <button
          onClick={handleDownload}
          className="p-2 rounded-full bg-white"
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
                <div className="w-56 h-72 animate-pulse bg-gray-200 rounded-lg" />
              </div>
            )}

            <div
              ref={containerRef}
              className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-100"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyMaterialPageCard;
