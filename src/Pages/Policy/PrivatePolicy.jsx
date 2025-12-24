import React from "react";

export default function PrivacyPolicy() {

  const privacyPolicyData = {
  title: "Examon Course – Privacy Policy",
  lastUpdated: "January 2025",
  intro: [
    "Welcome to Examon Course (“we”, “our”, “us”). We are committed to protecting your personal information and your right to privacy.",
    "This Privacy Policy explains how your data is collected, used, and protected when you access our educational platform, mobile application, or services.",
    "By using Examon Course, you agree to the terms outlined in this Privacy Policy."
  ],
  sections: [
    {
      heading: "1. Information We Collect",
      content: [
        {
          subHeading: "1.1 Personal Information",
          points: [
            "Full Name",
            "Email Address",
            "Phone Number (optional)",
            "Password",
            "Profile Information (photo, gender, or optional details)"
          ]
        },
        {
          subHeading: "1.2 Educational Data",
          points: [
            "Courses purchased",
            "Test scores and performance analytics",
            "Learning progress",
            "Notes, bookmarks, and doubts"
          ]
        },
        {
          subHeading: "1.3 Payment Information",
          text: "We do NOT store your card or banking data. All payments are processed securely through trusted third-party payment gateways."
        },
        {
          subHeading: "1.4 Automatic Data Collection",
          points: [
            "IP Address",
            "Device type",
            "Browser type",
            "App activity logs",
            "Cookies and analytics information"
          ]
        }
      ]
    },
    {
      heading: "2. How We Use Your Information",
      points: [
        "Create and manage your account",
        "Provide access to courses and study materials",
        "Track exam performance and learning progress",
        "Send notifications, updates, and reminders",
        "Improve our platform and learning tools",
        "Provide customer support",
        "Prevent fraud and ensure platform security"
      ]
    },
    {
      heading: "3. Sharing Your Information",
      text: [
        "We do NOT sell your data.",
        "We may share data only with service providers, legal authorities (if required), and internal teams for support and improvement."
      ]
    },
    {
      heading: "4. Cookies & Tracking Technologies",
      points: [
        "Save your login session",
        "Personalize your study dashboard",
        "Improve website speed and experience",
        "Analyze platform usage"
      ]
    },
    {
      heading: "5. Data Security",
      points: [
        "SSL encryption",
        "Secure authentication",
        "Encrypted database storage",
        "Regular security audits"
      ]
    },
    {
      heading: "6. Your Rights",
      points: [
        "Access your personal data",
        "Update or correct your information",
        "Request account deletion",
        "Opt-out of promotional emails",
        "Request a copy of stored data"
      ]
    },
    {
      heading: "7. Children’s Privacy",
      text: "Our platform is designed for users aged 13 and above. Accounts below this age will be deleted."
    },
    {
      heading: "8. Third-Party Links",
      text: "We are not responsible for external websites linked from our platform."
    },
    {
      heading: "9. Policy Updates",
      text: "We may update this policy. Major changes will be communicated through email or dashboard notifications."
    }
  ],
  contact: {
    title: "10. Contact Us",
    email: "Shivamgupta.vits@gmail.com",
    team: "Examon Course – Support Team"
  }
};

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-4 mb-4 md:px-10 py-12">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">

        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          {privacyPolicyData.title}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Last Updated: {privacyPolicyData.lastUpdated}
        </p>

        {/* Intro */}
        <div className="space-y-3 mb-8 text-gray-700">
          {privacyPolicyData.intro.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {privacyPolicyData.sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-xl font-bold mb-3">
                {section.heading}
              </h2>

              {section.content &&
                section.content.map((item, idx) => (
                  <div key={idx} className="mb-4">
                    <h3 className="font-semibold mb-2">
                      {item.subHeading}
                    </h3>

                    {item.points && (
                      <ul className="list-disc pl-6 space-y-1">
                        {item.points.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    )}

                    {item.text && (
                      <p className="text-gray-700">{item.text}</p>
                    )}
                  </div>
                ))}

              {section.points && (
                <ul className="list-disc pl-6 space-y-1">
                  {section.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              )}

              {section.text &&
                (Array.isArray(section.text) ? (
                  section.text.map((t, i) => <p key={i}>{t}</p>)
                ) : (
                  <p>{section.text}</p>
                ))}
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-10 border-t pt-6">
          <h2 className="text-xl font-bold mb-2">
            {privacyPolicyData.contact.title}
          </h2>
          <p>{privacyPolicyData.contact.team}</p>
          <p className="font-medium">
            Email:{" "}
            <a
              href={`mailto:${privacyPolicyData.contact.email}`}
              className="text-blue-600 hover:underline"
            >
              {privacyPolicyData.contact.email}
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
