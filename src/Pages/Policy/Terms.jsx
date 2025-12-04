import Data from "../../DataStore/Department.json";
import { useNavigate } from "react-router-dom";

export default function Terms({onClose}) {
  const navigate = useNavigate();

  const terms =
    Data?.education?.department?.policies?.terms_conditions ||
    "No terms & conditions found. Please update JSON.";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[1000]">

      {/* Popup Container */}
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl p-8 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">

        {/* Close */}
        <button
           onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-black text-xl"
        >
          ✕
        </button>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Terms & Conditions
        </h2>

        {/* Text */}
        <p className="text-gray-700 dark:text-gray-300 leading-7 whitespace-pre-line">
          {terms}
        </p>
      </div>
    </div>
  );
}
