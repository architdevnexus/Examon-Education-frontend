import React from "react";

export default function PrivatePolicy() {
  const policy = `
Examon Course – Privacy Policy

Last Updated: January 2025

Welcome to Examon Course (“we”, “our”, “us”). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how your data is collected, used, and protected when you access our educational platform, mobile application, or services.

By using Examon Course, you agree to the terms outlined in this Privacy Policy.

------------------------------------------
1. Information We Collect
------------------------------------------

1.1 Personal Information
We collect the following details when you register or use our services:
• Full Name  
• Email Address  
• Phone Number (optional)  
• Password  
• Profile Information (photo, gender, or optional details)

1.2 Educational Data
We collect information related to your learning activity:
• Courses purchased  
• Test scores and performance analytics  
• Learning progress  
• Notes, bookmarks, and doubts  

1.3 Payment Information
We do NOT store your card or banking data.  
All payments are processed securely through trusted third-party payment gateways (e.g., Razorpay, Stripe).

1.4 Automatic Data Collection
When you use our platform, we automatically collect:
• IP Address  
• Device type  
• Browser type  
• App activity logs  
• Cookies and analytics information  

------------------------------------------
2. How We Use Your Information
------------------------------------------

We use your information to:
• Create and manage your account  
• Provide access to courses and study materials  
• Track exam performance and learning progress  
• Send notifications, updates, and reminders  
• Improve our platform and learning tools  
• Provide customer support  
• Prevent fraud and ensure platform security  

------------------------------------------
3. Sharing Your Information
------------------------------------------

We do NOT sell your data.

We may share your data only with:
• Service Providers (payment gateways, hosting providers, analytics partners)  
• Legal Authorities (only when required by law)  
• Internal Teams (for academic support and system improvements)

All partners follow strict confidentiality and data protection standards.

------------------------------------------
4. Cookies & Tracking Technologies
------------------------------------------

We use cookies to:
• Save your login session  
• Personalize your study dashboard  
• Improve website speed and user experience  
• Understand usage patterns through analytics  

You can disable cookies through your browser settings.

------------------------------------------
5. Data Security  
------------------------------------------

We use advanced security measures to protect your data:
• SSL encryption  
• Secure user authentication  
• Encrypted database storage  
• Regular security audits  

No system is 100% secure, but we take every reasonable step to safeguard your information.

------------------------------------------
6. Your Rights  
------------------------------------------

You have the right to:
• Access your personal data  
• Update or correct your information  
• Request account deletion  
• Opt-out of promotional emails  
• Request a copy of your stored data  

To exercise these rights, contact us at:  
support@examoncourse.com

------------------------------------------
7. Children’s Privacy  
------------------------------------------

Our platform is designed for users aged 13 and above.  
If we discover any account created by a child below 13, we will delete it immediately.

------------------------------------------
8. Third-Party Links  
------------------------------------------

Some pages may contain links to external websites.  
We are not responsible for their content, policies, or security practices.

------------------------------------------
9. Policy Updates  
------------------------------------------

We may update this Privacy Policy to reflect legal or business changes.  
You will be notified of major updates through email or dashboard notification.

------------------------------------------
10. Contact Us  
------------------------------------------

For any privacy-related inquiries, reach out at:

Examon Course – Support Team  
Email: support@examoncourse.com

------------------------------------------
Thank you for trusting Examon Course with your learning journey.
------------------------------------------
`;

  return (
    <div className="w-full min-h-screen text-(--primary-color) py-10  px-4 md:px-10">

      <h2 className="text-4xl font-extrabold mb-6">
        Privacy Policy
      </h2>

      <div className="leading-7 whitespace-pre-line text-lg">
        {policy}
      </div>

    </div>
  );
}
