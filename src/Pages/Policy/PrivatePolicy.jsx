import Data from "../../DataStore/Department.json";

export default function PrivatePolicy() {
  const policy =
    Data?.education?.department?.policies?.privacy_policy ||
    "No policy found. Please update JSON.";

  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-900 py-16 px-4 md:px-10">

      {/* Title */}
      <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Privacy Policy
      </h2>

      {/* Content */}
      <div className="text-gray-700 dark:text-gray-300 leading-7 whitespace-pre-line text-lg">
        {policy}
      </div>

    </div>
  );
}
