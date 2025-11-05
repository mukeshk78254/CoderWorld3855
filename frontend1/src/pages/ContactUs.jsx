import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="text-cyan-400 hover:text-cyan-300 mb-8 inline-block">
            ← Back to Home
          </Link>

          <h1 className="text-4xl font-bold mb-4 text-cyan-400">Contact Us</h1>
          <p className="text-slate-400 mb-12 text-lg">
            Have questions? We're here to help! Reach out to us through any of the methods below.
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-white">Get in Touch</h2>
                
                <div className="space-y-6">
                  <motion.div 
                    className="bg-slate-800 p-6 rounded-lg border border-slate-700"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-cyan-900/30 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Email Support</h3>
                        <p className="text-slate-300 mb-2">For general inquiries and support</p>
                        <a href="mailto:support@coder-world3855.vercel.app" className="text-cyan-400 hover:text-cyan-300">
                          support@coder-world3855.vercel.app
                        </a>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="bg-slate-800 p-6 rounded-lg border border-slate-700"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-cyan-900/30 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Business & Partnerships</h3>
                        <p className="text-slate-300 mb-2">For business inquiries and collaborations</p>
                        <a href="mailto:business@coder-world3855.vercel.app" className="text-cyan-400 hover:text-cyan-300">
                          business@coder-world3855.vercel.app
                        </a>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="bg-slate-800 p-6 rounded-lg border border-slate-700"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-cyan-900/30 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Privacy & Legal</h3>
                        <p className="text-slate-300 mb-2">For privacy concerns and legal matters</p>
                        <a href="mailto:legal@coder-world3855.vercel.app" className="text-cyan-400 hover:text-cyan-300">
                          legal@coder-world3855.vercel.app
                        </a>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="bg-slate-800 p-6 rounded-lg border border-slate-700"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-cyan-900/30 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Payment & Refunds</h3>
                        <p className="text-slate-300 mb-2">For billing, payments, and refund requests</p>
                        <a href="mailto:payments@coder-world3855.vercel.app" className="text-cyan-400 hover:text-cyan-300">
                          payments@coder-world3855.vercel.app
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="bg-cyan-900/20 border border-cyan-700/50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Office Hours</h3>
                <div className="space-y-2 text-slate-300">
                  <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM IST</p>
                  <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM IST</p>
                  <p><strong>Sunday:</strong> Closed</p>
                  <p className="text-sm text-slate-400 mt-4">
                    * Email support available 24/7. We aim to respond within 24 hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-white">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-500"
                    placeholder="Mukesh Kumar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-500"
                    placeholder="mukesh@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Subject *
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="refund">Refund Request</option>
                    <option value="account">Account Issues</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-500 resize-none"
                    placeholder="Please describe your inquiry in detail..."
                  />
                </div>

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-900/30 border border-green-700 text-green-300 px-4 py-3 rounded-lg"
                  >
                    ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
                  </motion.div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Send Message
                </button>
              </form>

              <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                <p className="text-sm text-slate-400">
                  <strong className="text-slate-300">Note:</strong> For urgent issues, please email us directly at 
                  <a href="mailto:support@coder-world3855.vercel.app" className="text-cyan-400 hover:text-cyan-300 ml-1">
                    support@coder-world3855.vercel.app
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <Link to="/privacy" className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-cyan-500 transition-all">
              <h3 className="text-lg font-semibold text-white mb-2">Privacy Policy</h3>
              <p className="text-slate-400 text-sm">Learn how we protect your data</p>
            </Link>
            <Link to="/terms" className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-cyan-500 transition-all">
              <h3 className="text-lg font-semibold text-white mb-2">Terms & Conditions</h3>
              <p className="text-slate-400 text-sm">Read our terms of service</p>
            </Link>
            <Link to="/refund" className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-cyan-500 transition-all">
              <h3 className="text-lg font-semibold text-white mb-2">Refund Policy</h3>
              <p className="text-slate-400 text-sm">Understand our refund process</p>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;
