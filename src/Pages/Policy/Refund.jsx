export default function Refund() {
  const refundPolicy = `
Examon Course – Refund & Cancellation Policy
Last Updated: January 2025

We appreciate your trust in Examon Course. This Refund Policy explains the rules, conditions, and eligibility for refunds on course purchases made on our educational platform.

------------------------------------------
1. General Refund Terms
------------------------------------------
• All purchases made on Examon Course are final.  
• Refunds are provided only under specific conditions mentioned below.  
• Refunds, if approved, will be processed to the original payment method.  
• Processing time may take 7–14 working days depending on the payment gateway.

------------------------------------------
2. Refund Eligibility
------------------------------------------
You may be eligible for a refund only if:

• You purchased the wrong course by mistake AND have not accessed more than 10% of the content.  
• There were technical issues on our platform that prevented course access for more than 48 hours.  
• Duplicate payments were made due to gateway errors.  

Refunds will NOT be granted if:

• The course has been accessed or used significantly.  
• You completed a large portion of content, tests, or downloaded materials.  
• You changed your mind or no longer wish to study the course.  
• Your exam plans changed or you failed the exam.  
• Course access expired due to non-usage.

------------------------------------------
3. Non-Refundable Items
------------------------------------------
The following are strictly non-refundable:

• Subscription plans after activation  
• Mock tests once attempted  
• Downloadable PDFs, study materials, or notes  
• Offers, bundles, and discounted packages  
• Courses purchased through special promotions  

------------------------------------------
4. Cancellation Policy
------------------------------------------
• Orders cannot be cancelled once the course is activated.  
• If a cancellation request is made before activation, only partial refunds may be issued (payment gateway fees deducted).  
• Cancellation is not allowed after accessing any course content.

------------------------------------------
5. Technical Issues
------------------------------------------
If you face technical issues such as:

• Login errors  
• Course not loading  
• Payment deducted but access not granted  

You must contact support within **24–48 hours** with screenshots.

We will resolve the issue or provide a suitable solution (not always a refund).

------------------------------------------
6. Duplicate or Failed Transactions
------------------------------------------
In case of accidental duplicate payments:

• The extra amount will be refunded  
• Refund initiation time: 3–5 working days  
• Reflection time: depends on your bank/payment gateway  

------------------------------------------
7. How to Request a Refund
------------------------------------------
To apply for a refund, email us at:

support@examoncourse.com

Include the following:

• Registered name & email  
• Course purchased  
• Payment ID / transaction screenshot  
• Reason for refund request  
• Any technical issue evidence (if applicable)

Incomplete requests may be rejected.

------------------------------------------
8. Our Decision on Refund Requests
------------------------------------------
All refund decisions are made after:

• Verifying usage  
• Checking system logs  
• Reviewing eligibility  
• Confirming payment details  

Our decision is final and binding.

------------------------------------------
9. Changes to Refund Policy
------------------------------------------
We may update this Refund Policy at any time.  
Significant changes will be notified via email or dashboard alerts.

------------------------------------------
10. Contact Us
------------------------------------------
For any refund or billing concerns, contact:

Examon Course – Support Team  
Email: support@examoncourse.com

------------------------------------------
Thank you for understanding and supporting our learning platform.
------------------------------------------
`;

  return (
    <div className="w-full min-h-screen bg-(--primary-color) text-white py-16 px-4 md:px-10">
      <h2 className="text-4xl font-bold mb-6">
        Refund Policy
      </h2>

      <div className="space-y-4 text-lg leading-relaxed whitespace-pre-line">
        {refundPolicy}
      </div>
    </div>
  );
}
