import Data from "../../DataStore/Department.json";

export default function Refund() {
  const refundContent =
    Data?.education?.department?.policies?.refund_policy || [];

  return (
    <div className="w-full min-h-screen bg-(--primary-color) text-white py-16 px-4 md:px-10">

      {/* Title */}
      <h2 className="text-4xl font-bold mb-6 text-white">
        Refund Policy
      </h2>

      {/* Content */}
      <div className="space-y-4 text-lg leading-relaxed whitespace-pre-line">
        {refundContent}
      </div>

    </div>
  );
}
