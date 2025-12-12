export default function Terms() {
  const terms = `
Examon Course – Terms & Conditions
Last Updated: January 2025

Welcome to Examon Course (“we”, “our”, “us”). By accessing or using our website, learning materials, online tests, or services, you agree to follow the Terms & Conditions listed below. Please read them carefully.

------------------------------------------
1. Acceptance of Terms
------------------------------------------
By using our platform, you confirm that:
• You are at least 13 years old.
• You will use the platform legally and responsibly.
• You agree to follow all rules, policies, and updates posted by Examon Course.

If you disagree with any part of these terms, you must stop using our platform immediately.

------------------------------------------
2. Account Creation & Responsibilities
------------------------------------------
When creating an account, you agree to:
• Provide accurate and complete information.
• Keep your login details confidential.
• Be responsible for all activities done through your account.

Sharing accounts, passwords, or learning material access is strictly prohibited.

------------------------------------------
3. Use of Educational Content
------------------------------------------
All videos, notes, tests, PDFs, and course materials are the property of Examon Course.  
You may NOT:
• Copy, download, share, or resell our content  
• Upload our content to social media or other websites  
• Distribute course material without written permission  

Content access is provided only for personal learning purposes.

------------------------------------------
4. Course Access & Validity
------------------------------------------
• Course validity depends on the plan purchased.  
• After expiration, course content and tests will not be accessible.  
• Renewal or repurchase is required for extended access.

------------------------------------------
5. Payments & Billing
------------------------------------------
• All payments are final and non-transferable.  
• Payments are processed through trusted third-party gateways.  
• We do not store or access your banking/card information.  

For refund or cancellation rules, please refer to our **Refund Policy**.

------------------------------------------
6. Prohibited Activities
------------------------------------------
You agree NOT to:
• Use the platform for cheating, hacking, or mass downloading  
• Attempt to copy exam questions or reverse-engineer tests  
• Misuse doubt-solving or support features  
• Upload harmful or abusive content  

Violations may result in permanent account suspension.

------------------------------------------
7. Performance Reports & Analytics
------------------------------------------
Examon Course provides performance insights and test analytics.  
These reports are for educational improvement only and must not be misused or publicly shared.

------------------------------------------
8. Limitation of Liability
------------------------------------------
We are not responsible for:
• Loss of data due to internet or device issues  
• Score changes, exam results, or selection outcomes  
• Service interruptions due to maintenance or technical problems  

Our platform is provided “as is” without warranties regarding exam results.

------------------------------------------
9. Modifications to Service
------------------------------------------
We may update courses, features, pricing, or policies at any time.  
Major changes will be notified through email or dashboard alerts.

------------------------------------------
10. Termination
------------------------------------------
We reserve the right to suspend or delete any account that:
• Violates terms  
• Misuses content  
• Engages in harmful behavior  

No refunds will be issued for accounts terminated due to violations.

------------------------------------------
11. Governing Law
------------------------------------------
These Terms are governed by the laws of India.  
Any disputes will be handled under the jurisdiction of Indian courts.

------------------------------------------
12. Contact Us
------------------------------------------
For questions or support, contact:

Examon Course – Support Team  
Email: support@examoncourse.com

------------------------------------------
Thank you for choosing Examon Course to support your learning journey.
------------------------------------------
`;

  return (
    <div className="w-full min-h-screen text-(--primary-color)  py-16 px-4 md:px-10">

      <h2 className="text-4xl font-bold  mb-6">
        Terms & Conditions
      </h2>

      <div className=" leading-7 whitespace-pre-line text-lg">
        {terms}
      </div>

    </div>
  );
}
