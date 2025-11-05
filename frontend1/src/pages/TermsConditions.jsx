import { motion } from 'framer-motion';
import { Link } from 'react-router';

const TermsConditions = () => {
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

          <h1 className="text-4xl font-bold mb-8 text-cyan-400">Terms & Conditions</h1>
          
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p className="text-sm text-slate-400">Last Updated: November 5, 2025</p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using CoderWorld ("Platform," "Service," "we," "us," or "our"), you accept 
                and agree to be bound by these Terms and Conditions. If you do not agree to these terms, 
                please do not use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Eligibility</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must be at least 13 years old to use CoderWorld</li>
                <li>Users under 18 must have parental or guardian consent</li>
                <li>You must provide accurate and complete registration information</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
              <p className="mb-4">When you create an account, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Maintain the security of your password and account</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Not share your account credentials with others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Subscription and Payment</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-cyan-300 mb-2">4.1 Premium Subscription</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Premium features require a paid subscription</li>
                    <li>Subscription fees are charged in advance on a monthly or annual basis</li>
                    <li>All payments are processed securely through Razorpay</li>
                    <li>Prices are subject to change with 30 days notice</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-cyan-300 mb-2">4.2 Payment Terms</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Payments are non-refundable except as stated in our Refund Policy</li>
                    <li>You authorize us to charge your payment method on a recurring basis</li>
                    <li>Failed payments may result in suspension of premium features</li>
                    <li>You are responsible for all applicable taxes</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Acceptable Use Policy</h2>
              <p className="mb-4">You agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Share or distribute solutions to gain unfair advantage</li>
                <li>Attempt to hack, disrupt, or compromise platform security</li>
                <li>Use automated tools or bots without authorization</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Post inappropriate, offensive, or illegal content</li>
                <li>Impersonate others or misrepresent your identity</li>
                <li>Copy, modify, or distribute platform content without permission</li>
                <li>Reverse engineer or attempt to extract source code</li>
                <li>Use the platform for commercial purposes without authorization</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Intellectual Property</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-cyan-300 mb-2">6.1 Platform Content</h3>
                  <p>
                    All content, features, and functionality on CoderWorld, including but not limited to 
                    text, graphics, logos, problems, solutions, and software, are owned by CoderWorld 
                    and protected by copyright, trademark, and other intellectual property laws.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-cyan-300 mb-2">6.2 User Content</h3>
                  <p>
                    You retain ownership of your submissions and solutions. By posting content, you grant 
                    CoderWorld a non-exclusive, worldwide license to use, display, and distribute your 
                    content for platform operation and improvement.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Termination</h2>
              <p className="mb-4">
                We reserve the right to suspend or terminate your account at any time for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violation of these Terms and Conditions</li>
                <li>Fraudulent or illegal activity</li>
                <li>Violation of Acceptable Use Policy</li>
                <li>Non-payment of subscription fees</li>
                <li>At our sole discretion for any reason</li>
              </ul>
              <p className="mt-4">
                You may cancel your account at any time through your account settings. Upon termination, 
                your right to use the platform will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Disclaimers</h2>
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <p className="mb-4">
                  THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                  EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Accuracy, reliability, or completeness of content</li>
                  <li>Uninterrupted or error-free operation</li>
                  <li>Fitness for a particular purpose</li>
                  <li>Non-infringement of third-party rights</li>
                  <li>Security or freedom from viruses</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
              <p className="mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, CODERWORLD SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Service interruptions or data loss</li>
                <li>Third-party actions or content</li>
                <li>Unauthorized access to your account</li>
              </ul>
              <p className="mt-4">
                Our total liability shall not exceed the amount paid by you in the past 12 months.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless CoderWorld, its officers, directors, employees, 
                and agents from any claims, damages, losses, liabilities, and expenses arising from your 
                use of the platform or violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India, 
                without regard to its conflict of law provisions. Any disputes shall be subject to the 
                exclusive jurisdiction of the courts in [Your City], India.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of material 
                changes via email or platform notification. Continued use after changes constitutes 
                acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Contact Information</h2>
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <p className="mb-2">For questions about these Terms and Conditions:</p>
                <p><strong>Email:</strong> legal@coder-world3855.vercel.app</p>
                <p><strong>Support:</strong> support@coder-world3855.vercel.app</p>
                <p className="mt-4">
                  <Link to="/contact" className="text-cyan-400 hover:text-cyan-300">
                    Contact Us Page →
                  </Link>
                </p>
              </div>
            </section>

            <section className="bg-cyan-900/20 border border-cyan-700/50 p-6 rounded-lg mt-8">
              <p className="text-sm">
                By using CoderWorld, you acknowledge that you have read, understood, and agree to be 
                bound by these Terms and Conditions, along with our Privacy Policy and Refund Policy.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsConditions;
