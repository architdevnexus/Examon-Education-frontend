function PdfPopup({ pdfUrl, onClose }) {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[999] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-[95%] max-w-6xl h-[85vh] rounded-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-500 hover:text-red-500"
        >
          ✕
        </button>

        {/* Mobile / fallback */}
        {isMobile ? (
          <div className="flex h-full items-center justify-center">
            <button
              onClick={() => window.open(pdfUrl, "_blank")}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Open PDF
            </button>
          </div>
        ) : (
          <object
            data={`${pdfUrl}#toolbar=0&navpanes=0`}
            type="application/pdf"
            width="100%"
            height="100%"
          >
            {/* Fallback if <object> fails */}
            <div className="flex h-full items-center justify-center">
              <button
                onClick={() => window.open(pdfUrl, "_blank")}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Open PDF
              </button>
            </div>
          </object>
        )}
      </div>
    </div>
  );
}
