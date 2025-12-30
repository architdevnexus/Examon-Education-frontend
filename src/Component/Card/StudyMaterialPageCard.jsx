import React, { useState, useCallback } from "react";
import { LuTimerReset } from "react-icons/lu";
import { SiLevelsdotfyi } from "react-icons/si";
import { FaLanguage } from "react-icons/fa6";
import { BsDownload } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

const StudyMaterialPageCard = React.memo(
  ({ title, level, language, pdfUrl }) => {
    const [open, setOpen] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const token = localStorage.getItem("token");

    /* ---------------- HANDLERS ---------------- */
    const openPreview = useCallback(() => {
      setLoaded(false);
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

      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `${title}.pdf`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();
    }, [token, pdfUrl, title]);

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

        {/* Actions */}
        <div className="p-3 flex justify-end gap-3 bg-[var(--primary-color)] rounded-b-2xl">
          <button
            onClick={openPreview}
            className="px-4 py-2 cursor-pointer bg-white rounded-xl text-sm"
          >
            View
          </button>

          <button
            onClick={handleDownload}
            className="p-2  cursor-pointer text-white"
          >
            <BsDownload size={18} />
          </button>
        </div>

        {/* Modal */}
        {open && (
          <div
            className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center"
            onClick={closePreview}
            onContextMenu={(e) => e.preventDefault()} // 🔒 Disable right click (outer)
          >
            <div
              className="bg-white rounded-2xl w-[95%] max-w-5xl h-[85vh] relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
              onContextMenu={(e) => e.preventDefault()} // 🔒 Disable right click (inner)
            >
              <button
                onClick={closePreview}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 z-10"
              >
                <IoClose size={22} />
              </button>

              {/* Skeleton */}
              {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-0">
                  <div className="w-64 h-80 bg-gray-200 animate-pulse rounded-lg" />
                </div>
              )}

              {/* PDF Preview */}
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                title={title}
                loading="lazy"
                className="flex-1 w-full rounded-b-2xl"
                onLoad={() => setLoaded(true)}
                onContextMenu={(e) => e.preventDefault()} // 🔒 Safari needs this
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default StudyMaterialPageCard;
