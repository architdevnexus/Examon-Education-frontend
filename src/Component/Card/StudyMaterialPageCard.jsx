import React, { useState, useCallback, memo } from "react";
import { LuTimerReset } from "react-icons/lu";
import { SiLevelsdotfyi } from "react-icons/si";
import { FaLanguage } from "react-icons/fa6";
import { BsDownload } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

/**
 * INLINE POPUP PDF PREVIEW (IMAGE BASED)
 * ✔ Works on LIVE + LOCAL
 * ✔ No CORS issues
 * ✔ No workers
 * ✔ No iframe/object
 * ✔ Cloudinary-safe
 */

const StudyMaterialPageCard = memo(
  ({ title, level, language, pdfUrl }) => {
    const [open, setOpen] = useState(false);
    const token = localStorage.getItem("token");

    const openPreview = useCallback(() => {
      setOpen(true);
    }, []);

    const closePreview = useCallback(() => {
      setOpen(false);
    }, []);

    const handleDownload = useCallback(() => {
      if (!token) {
        toast.info("Please login to download the PDF.");
        return;
      }
      window.open(pdfUrl, "_self");
    }, [token, pdfUrl]);

    /**
     * Convert Cloudinary PDF → image pages
     * raw/upload  → image/upload
     * add pg_1, pg_2, ...
     */
    const getPageImage = (page) =>
      pdfUrl
        .replace("/raw/upload/", "/image/upload/")
        .replace(".pdf", `.jpg`)
        .replace("/upload/", `/upload/pg_${page}/`);

    return (
      <div className="bg-gradient-to-b from-[#EAF5FF] to-white rounded-2xl shadow-sm hover:shadow-md transition w-full max-w-sm">
        {/* Card Body */}
        <div className="p-4">
          <img src="/logo2.svg" alt="logo" className="w-12 h-12 mb-3" />

          <h2 className="text-lg font-semibold text-black mb-2">
            {title}
          </h2>

          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex items-center gap-2">
              <LuTimerReset className="text-[var(--primary-color)]" />
              <span>View PDF</span>
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

        {/* Actions */}
        <div className="p-3 flex justify-end gap-3 bg-[var(--primary-color)] rounded-b-2xl">
          <button
            onClick={openPreview}
            className="px-4 py-2 bg-white rounded-xl text-sm"
          >
            View
          </button>

          <button onClick={handleDownload} className="p-2 text-white">
            <BsDownload size={18} />
          </button>
        </div>

        {/* ================= MODAL ================= */}
        {open && (
          <div
            className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center"
            onClick={closePreview}
          >
            <div
              className="bg-white rounded-2xl w-[95%] max-w-5xl h-[85vh] relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={closePreview}
                className="absolute top-4 cursor-pointer right-4 text-gray-400 hover:text-red-500 z-10"
              >
                <IoClose size={22} />
              </button>

              {/* IMAGE PREVIEW */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {[1, 2, 3,4,5,6].map((page) => (
                  <img
                    key={page}
                    src={getPageImage(page)}
                    alt={`Page ${page}`}
                    className="w-full rounded-lg shadow-sm"
                    loading="lazy"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default StudyMaterialPageCard;
