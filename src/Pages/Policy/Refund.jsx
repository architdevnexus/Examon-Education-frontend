import React from "react";


export default function RefundPolicy() {

 const refundPolicyData = {
  title: "Examon Course – Refund & Cancellation Policy",
  lastUpdated: "January 2025",
  intro: [
    "Thank you for choosing Examon Course.",
    "This Refund & Cancellation Policy explains the rules, conditions, and limitations related to refunds for courses purchased on the Examon platform.",
    "By purchasing any course on Examon, you agree to this policy."
  ],
  sections: [
    {
      heading: "1. General Refund Terms",
      points: [
        "All purchases made on Examon Course are final unless stated otherwise.",
        "Refunds are provided only under specific conditions mentioned in this policy.",
        "Approved refunds will be processed to the original payment method only.",
        "Refund processing may take 7–14 working days depending on the payment gateway or bank."
      ]
    },
    {
      heading: "2. Refund Eligibility",
      subSections: [
        {
          title: "You may be eligible for a refund if:",
          points: [
            "You purchased the wrong course by mistake and accessed less than 10% of the content.",
            "There were technical issues that prevented access for more than 48 hours.",
            "A duplicate payment was made due to a payment gateway error."
          ]
        },
        {
          title: "Refunds will NOT be granted if:",
          points: [
            "The course has been accessed or consumed significantly.",
            "A large portion of videos, tests, or materials were completed or downloaded.",
            "You changed your mind or no longer wish to continue the course.",
            "Your exam schedule or preparation plan changed.",
            "Course access expired due to inactivity."
          ]
        }
      ]
    },
    {
      heading: "3. Non-Refundable Items",
      points: [
        "Activated subscription plans",
        "Mock tests once attempted",
        "Downloaded PDFs, notes, or study materials",
        "Discounted bundles, offers, or promotional packages",
        "Courses purchased under special sales or campaigns"
      ]
    },
    {
      heading: "4. Cancellation Policy",
      points: [
        "Orders cannot be cancelled once course access is activated.",
        "Cancellation requests before activation may receive partial refunds after deducting gateway charges.",
        "No cancellations are allowed after accessing any course content."
      ]
    },
    {
      heading: "5. Technical Issues",
      text: "If you face issues such as login errors, course access problems, or payment deducted without access, you must contact support within 24–48 hours with valid screenshots or proof. Resolution may include access restoration or alternative solutions, not necessarily a refund."
    },
    {
      heading: "6. Duplicate or Failed Transactions",
      points: [
        "Duplicate payments caused by system or gateway errors are refundable.",
        "Refund initiation timeline: 3–5 working days.",
        "Final credit time depends on your bank or payment provider."
      ]
    },
    {
      heading: "7. How to Request a Refund",
      text: "To request a refund, email us with complete details including registered name, email, course name, payment ID, reason for refund, and supporting screenshots. Incomplete requests may be rejected."
    },
    {
      heading: "8. Decision on Refund Requests",
      text: "All refund requests are reviewed by verifying system logs, usage history, eligibility criteria, and payment details. Examon’s decision shall be final and binding."
    },
    {
      heading: "9. Policy Updates",
      text: "Examon reserves the right to update or modify this Refund Policy at any time. Major changes will be communicated via email or dashboard notifications."
    }
  ],
  contact: {
    heading: "10. Contact Us",
    team: "Examon Course – Support Team",
    email: "Shivamgupta.vits@gmail.com"
  }
};

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-10 py-12 text-gray-800 mb-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">

        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          {refundPolicyData.title}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Last Updated: {refundPolicyData.lastUpdated}
        </p>

        {/* Intro */}
        <div className="space-y-3 mb-8">
          {refundPolicyData.intro.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {refundPolicyData.sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-xl font-bold mb-3">
                {section.heading}
              </h2>

              {section.points && (
                <ul className="list-disc pl-6 space-y-1">
                  {section.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              )}

              {section.subSections &&
                section.subSections.map((sub, idx) => (
                  <div key={idx} className="mb-4">
                    <h3 className="font-semibold mb-2">{sub.title}</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      {sub.points.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}

              {section.text && <p>{section.text}</p>}
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-10 border-t pt-6">
          <h2 className="text-xl font-bold mb-2">
            {refundPolicyData.contact.heading}
          </h2>
          <p>{refundPolicyData.contact.team}</p>
          <p className="font-medium">
            Email:{" "}
            <a
              href={`mailto:${refundPolicyData.contact.email}`}
              className="text-blue-600 hover:underline"
            >
              {refundPolicyData.contact.email}
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
