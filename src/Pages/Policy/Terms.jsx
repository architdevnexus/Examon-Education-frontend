import React from "react";


export default function TermsAndConditions() {
const termsPolicyData = {
  title: "Examon Course – Terms & Conditions",
  lastUpdated: "January 2025",
  intro: [
    "Welcome to Examon Course (“we”, “our”, “us”).",
    "By accessing or using our website, learning materials, online tests, or services, you agree to comply with these Terms & Conditions.",
    "Please read these terms carefully before using the platform."
  ],
  sections: [
    {
      heading: "1. Acceptance of Terms",
      points: [
        "You must be at least 13 years old to use the platform.",
        "You agree to use the platform in a lawful and responsible manner.",
        "You agree to comply with all rules, policies, and updates published by Examon Course.",
        "If you do not agree with any part of these terms, you must stop using the platform immediately."
      ]
    },
    {
      heading: "2. Account Creation & Responsibilities",
      points: [
        "You must provide accurate and complete registration information.",
        "You are responsible for maintaining the confidentiality of your login credentials.",
        "All activities performed through your account are your responsibility.",
        "Sharing accounts, passwords, or course access is strictly prohibited."
      ]
    },
    {
      heading: "3. Use of Educational Content",
      text: "All videos, notes, tests, PDFs, and course materials available on Examon Course are the intellectual property of Examon Course.",
      points: [
        "You may not copy, reproduce, download, distribute, or resell any content.",
        "You may not upload or share content on social media or third-party platforms.",
        "Content access is provided strictly for personal and non-commercial learning purposes."
      ]
    },
    {
      heading: "4. Course Access & Validity",
      points: [
        "Course validity is determined by the plan or package purchased.",
        "Once validity expires, access to content and tests will be revoked.",
        "Renewal or repurchase is required to regain access."
      ]
    },
    {
      heading: "5. Payments & Billing",
      points: [
        "All payments are final and non-transferable.",
        "Payments are processed through trusted third-party payment gateways.",
        "Examon Course does not store or access your card or banking details.",
        "Refunds and cancellations are governed by the Refund Policy."
      ]
    },
    {
      heading: "6. Prohibited Activities",
      points: [
        "Cheating, hacking, or attempting to manipulate tests or results.",
        "Mass downloading or screen recording of paid content.",
        "Reverse-engineering tests or copying exam questions.",
        "Uploading abusive, harmful, or misleading content."
      ]
    },
    {
      heading: "7. Performance Reports & Analytics",
      text: "Performance reports and analytics are provided solely for self-assessment and academic improvement. These reports must not be publicly shared or misused."
    },
    {
      heading: "8. Limitation of Liability",
      points: [
        "Internet connectivity issues or device-related failures.",
        "Exam scores, results, rankings, or final selections.",
        "Temporary service interruptions due to maintenance or technical issues."
      ],
      text: "The platform is provided on an “as is” basis without any guarantees regarding exam outcomes."
    },
    {
      heading: "9. Modifications to Services",
      text: "Examon Course reserves the right to update or modify courses, pricing, features, or policies at any time. Significant changes will be communicated via email or dashboard notifications."
    },
    {
      heading: "10. Termination of Access",
      points: [
        "Violation of these Terms & Conditions.",
        "Misuse of content or platform features.",
        "Engaging in fraudulent or harmful activities."
      ],
      text: "Accounts terminated for violations are not eligible for refunds."
    },
    {
      heading: "11. Governing Law",
      text: "These Terms & Conditions shall be governed and interpreted in accordance with the laws of India. Any disputes shall be subject to the jurisdiction of Indian courts."
    }
  ],
  contact: {
    heading: "12. Contact Us",
    team: "Examon Course – Support Team",
    email: "Shivamgupta.vits@gmail.com"
  }
};


  return (
    <div className="min-h-screen bg-gray-50 mb-4 px-4 md:px-10 py-12 text-gray-800">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">

        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          {termsPolicyData.title}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Last Updated: {termsPolicyData.lastUpdated}
        </p>

        {/* Intro */}
        <div className="space-y-3 mb-8">
          {termsPolicyData.intro.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {termsPolicyData.sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-xl font-bold mb-3">
                {section.heading}
              </h2>

              {section.text && (
                <p className="mb-3">{section.text}</p>
              )}

              {section.points && (
                <ul className="list-disc pl-6 space-y-1">
                  {section.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-10 border-t pt-6">
          <h2 className="text-xl font-bold mb-2">
            {termsPolicyData.contact.heading}
          </h2>
          <p>{termsPolicyData.contact.team}</p>
          <p className="font-medium">
            Email:{" "}
            <a
              href={`mailto:${termsPolicyData.contact.email}`}
              className="text-blue-600 hover:underline"
            >
              {termsPolicyData.contact.email}
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
