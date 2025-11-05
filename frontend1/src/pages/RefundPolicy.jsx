import { motion } from 'framer-motion';
import { Link } from 'react-router';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="text-cyan-400 hover:text-cyan-300 mb-8 inline-block">
            ← Back to Home
          </Link>

          <h1 className="text-4xl font-bold mb-8 text-cyan-400">Refund & Cancellation Policy</h1>
          
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p className="text-sm text-slate-400">Last Updated: November 5, 2025</p>

            <section className="bg-cyan-900/20 border border-cyan-700/50 p-6 rounded-lg">
              <p className="text-lg">
                At CoderWorld, we strive to provide the best learning experience. This policy outlines 
                the terms and conditions for refunds and cancellations of our premium subscription services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Refund Eligibility</h2>
              <div className="space-y-4">
                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                  <h3 className="text-xl font-semibold text-cyan-300 mb-3">7-Day Money-Back Guarantee</h3>
                  <p className="mb-4">
                    We offer a 7-day money-back guarantee for first-time premium subscribers.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Applicable only to first-time premium subscriptions</li>
                    <li>Must be requested within 7 days of initial purchase</li>
                    <li>Available for both monthly and annual plans</li>
                    <li>Refund processed within 5-7 business days</li>
                  </ul>
                </div>

                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                  <h3 className="text-xl font-semibold text-cyan-300 mb-3">Conditions for Refund</h3>
                  <p className="mb-4">To be eligible for a refund, the following conditions must be met:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Request submitted within 7 days of purchase</li>
                    <li>Valid reason provided for refund request</li>
                    <li>No violation of Terms and Conditions</li>
                    <li>Account in good standing with no fraudulent activity</li>
                    <li>Original payment method available for refund</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Non-Refundable Situations</h2>
              <p className="mb-4">Refunds will NOT be provided in the following cases:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>After 7 days from the date of purchase</li>
                <li>Renewal of existing subscriptions</li>
                <li>Account suspension or termination due to Terms violation</li>
                <li>Change of mind after the 7-day period</li>
                <li>Fraudulent or abusive account activity</li>
                <li>Partial month/year subscription periods</li>
                <li>Special promotional or discounted subscriptions (unless specified)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Subscription Cancellation</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-cyan-300 mb-2">3.1 How to Cancel</h3>
                  <p className="mb-4">You can cancel your subscription at any time through:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Your account settings dashboard</li>
                    <li>Contacting our support team at support@coder-world3855.vercel.app</li>
                    <li>Using the "Cancel Subscription" button in your profile</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-cyan-300 mb-2">3.2 Effect of Cancellation</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Premium features remain active until the end of the billing period</li>
                    <li>No charges for subsequent billing cycles</li>
                    <li>Access to free features continues after cancellation</li>
                    <li>Your progress and data are retained</li>
                    <li>You can reactivate your subscription at any time</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Refund Process</h2>
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>Submit Request:</strong> Email support@coder-world3855.vercel.app with:
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Your registered email address</li>
                      <li>Order/Transaction ID</li>
                      <li>Reason for refund request</li>
                      <li>Date of purchase</li>
                    </ul>
                  </li>
                  <li><strong>Review:</strong> Our team will review your request within 2-3 business days</li>
                  <li><strong>Approval:</strong> If approved, refund will be initiated to your original payment method</li>
                  <li><strong>Processing Time:</strong> Refund appears in your account within 5-7 business days</li>
                  <li><strong>Notification:</strong> You will receive email confirmation once refund is processed</li>
                </ol>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Payment Gateway Fees</h2>
              <p>
                Refunds are processed through Razorpay. While we refund the full subscription amount, 
                please note that payment gateway processing fees (if any) charged by banks or card 
                issuers are non-refundable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Failed or Duplicate Payments</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-cyan-300 mb-2">Failed Payments</h3>
                  <p>
                    If a payment fails but amount is deducted from your account, please contact us 
                    immediately at support@coder-world3855.vercel.app with transaction details. We will investigate 
                    and process a full refund if confirmed.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-cyan-300 mb-2">Duplicate Charges</h3>
                  <p>
                    In case of accidental duplicate charges, contact us within 7 days with proof of 
                    duplicate transaction. Full refund will be processed for the duplicate charge.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Annual Subscription Refunds</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>7-day money-back guarantee applies to annual plans</li>
                <li>After 7 days, annual subscriptions are non-refundable</li>
                <li>Cancellation effective at the end of annual period</li>
                <li>No pro-rated refunds for unused months</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Promotional Offers and Discounts</h2>
              <p>
                Subscriptions purchased using promotional codes or during special offers may have 
                different refund terms. Specific conditions will be mentioned at the time of purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Service Issues</h2>
              <p className="mb-4">
                If you experience technical issues or service disruptions:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contact support immediately for resolution</li>
                <li>We will extend your subscription for the affected period</li>
                <li>Refunds may be considered on a case-by-case basis for extended outages</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Auto-Renewal</h2>
              <div className="bg-yellow-900/20 border border-yellow-700/50 p-6 rounded-lg">
                <p className="mb-4">
                  <strong>Important:</strong> All subscriptions auto-renew unless cancelled before the 
                  renewal date.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Renewal reminder sent 7 days before charge date</li>
                  <li>Cancel anytime before renewal to avoid charges</li>
                  <li>Auto-renewal charges are non-refundable</li>
                  <li>Manage auto-renewal settings in your account</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Contact for Refund Requests</h2>
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <p className="mb-4">For refund requests or questions about this policy:</p>
                <p><strong>Email:</strong> support@coder-world3855.vercel.app</p>
                <p><strong>Subject:</strong> "Refund Request - [Your Name]"</p>
                <p><strong>Response Time:</strong> Within 48 hours</p>
                <p className="mt-4">
                  <Link to="/contact" className="text-cyan-400 hover:text-cyan-300">
                    Contact Us Page →
                  </Link>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Policy Updates</h2>
              <p>
                We reserve the right to modify this Refund Policy at any time. Changes will be effective 
                immediately upon posting. Continued use of our services after changes constitutes 
                acceptance of the updated policy.
              </p>
            </section>

            <section className="bg-cyan-900/20 border border-cyan-700/50 p-6 rounded-lg mt-8">
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Fair Refund Commitment</h2>
              <p>
                CoderWorld is committed to fair and transparent refund practices. We process all 
                legitimate refund requests promptly and in good faith. Our goal is your satisfaction 
                and a positive learning experience.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RefundPolicy;
