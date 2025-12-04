import Data from "../../DataStore/Department.json";

export default function Refund({ onClose }) {
  const refundContent =
    Data?.education?.department?.policies?.refund_policy || [];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-(--primary-color) text-white w-full max-w-2xl rounded-xl shadow-2xl p-6 relative animate-fadeIn">

        {/* Close Button */}
        {/* <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-200 hover:text-black text-2xl"
        >
          ✕
        </button> */}

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 text-gray-200">
          Refund Policy
        </h2>

        {/* Dynamic Content */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
         {refundContent}
        </div>

        {/* Close Button Bottom */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
