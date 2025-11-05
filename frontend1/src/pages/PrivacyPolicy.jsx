import { motion } from 'framer-motion';
import { Link } from 'react-router';

const PrivacyPolicy = () => {
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

          <h1 className="text-4xl font-bold mb-8 text-cyan-400">Privacy Policy</h1>
          
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p className="text-sm text-slate-400">Last Updated: November 5, 2025</p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                CoderWorld ("we," "our," or "us") collects the following information when you use our platform:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Personal Information:</strong> Name, email address, phone number, and profile picture</li>
                <li><strong>Account Information:</strong> Username, password (encrypted), and authentication details</li>
                <li><strong>Payment Information:</strong> Payment details processed securely through Razorpay</li>
                <li><strong>Usage Data:</strong> Problems solved, submissions, coding activity, and performance metrics</li>
                <li><strong>Technical Information:</strong> IP address, browser type, device information, and cookies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use collected information for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing and maintaining our coding platform services</li>
                <li>Processing payments and managing subscriptions</li>
                <li>Personalizing your learning experience and tracking progress</li>
                <li>Sending important updates, notifications, and educational content</li>
                <li>Improving our platform features and user experience</li>
                <li>Preventing fraud and ensuring platform security</li>
                <li>Complying with legal obligations and enforcing our Terms of Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Payment Processing</h2>
              <p className="mb-4">
                All payment transactions are processed through Razorpay, a PCI-DSS compliant payment gateway. 
                We do not store your complete credit card or debit card information on our servers. Payment data 
                is encrypted and handled securely by Razorpay in accordance with industry standards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
              <p className="mb-4">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>SSL/TLS encryption for all data transmission</li>
                <li>Secure password hashing and authentication</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and data encryption at rest</li>
                <li>Compliance with data protection regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Data Sharing and Disclosure</h2>
              <p className="mb-4">We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Payment Processors:</strong> Razorpay for processing payments</li>
                <li><strong>Service Providers:</strong> Third-party services that help operate our platform</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
              </ul>
              <p className="mt-4">
                We do not sell your personal information to third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies and Tracking</h2>
              <p className="mb-4">
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
                and maintain your session. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and review your personal information</li>
                <li>Update or correct your account details</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data in a portable format</li>
                <li>Withdraw consent for data processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Data Retention</h2>
              <p>
                We retain your personal information for as long as your account is active or as needed to 
                provide services. After account deletion, we may retain certain information for legal, 
                regulatory, or legitimate business purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Children's Privacy</h2>
              <p>
                Our platform is intended for users aged 13 and above. We do not knowingly collect personal 
                information from children under 13. If we become aware of such data collection, we will 
                take steps to delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of significant 
                changes via email or platform notifications. Continued use of our services after changes 
                constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Us</h2>
              <p className="mb-4">
                For privacy-related questions or to exercise your rights, please contact us at:
              </p>
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <p><strong>Email:</strong> privacy@coder-world3855.vercel.app</p>
                <p><strong>Support:</strong> support@coder-world3855.vercel.app</p>
                <p className="mt-2">
                  <Link to="/contact" className="text-cyan-400 hover:text-cyan-300">
                    Contact Us Page →
                  </Link>
                </p>
              </div>
            </section>

            <section className="bg-cyan-900/20 border border-cyan-700/50 p-6 rounded-lg mt-8">
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Compliance</h2>
              <p>
                CoderWorld complies with applicable data protection laws and regulations. We are committed 
                to protecting your privacy and ensuring the security of your personal information in 
                accordance with industry best practices.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
