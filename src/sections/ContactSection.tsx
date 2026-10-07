import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2 } from 'lucide-react';
import { SocialIcon } from '../components/SocialIcon';
import { FormButton } from '../components/FormButton';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate interactive submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', project: '' });
    }, 1000);
  };

  return (
    <section id="contact" className="w-full bg-cream py-24 md:py-36 scroll-mt-20">
      <div className="max-w-framer mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 flex flex-col justify-between gap-12"
          >
            <div>
              <span className="font-sans text-xs tracking-widest uppercase font-semibold text-dark/40">
                Initiate Project
              </span>
              <h2 className="framer-h2 font-semibold text-dark mt-2 tracking-tight">
                Have an idea? Let’s bring it to life.
              </h2>
              <p className="mt-6 text-dark/70 framer-body-18 max-w-md font-sans leading-relaxed">
                Whether you’re looking to launch a standout Framer website, migrate an existing product, or engineer custom React interactions, I’d love to hear about it.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <a
                  href="mailto:contact@templyo.io"
                  className="inline-flex items-center gap-2 text-dark font-semibold text-lg hover:underline underline-offset-4"
                >
                  <Mail className="w-5 h-5 text-dark/60" />
                  <span>contact@templyo.io</span>
                </a>
              </div>
            </div>

            {/* Social Icons row */}
            <div className="flex flex-col gap-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-dark/40">
                Connect Directly
              </span>
              <div className="flex items-center gap-3">
                <SocialIcon platform="x" url="https://x.com/aryankumar_04" />
                <SocialIcon platform="github" url="https://github.com/aryankumar-04" />
                <SocialIcon platform="linkedin" url="https://www.linkedin.com/in/aryankumargupta04" />
                <SocialIcon platform="reddit" url="https://www.reddit.com/user/aryankumar04/" />
              </div>
            </div>
          </motion.div>

          {/* Right Column: Framer Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-6"
          >
            <div className="w-full max-w-[500px] lg:ml-auto p-8 sm:p-10 rounded-16 bg-dark text-cream shadow-2xl">
              {isSubmitted ? (
                <div className="py-12 flex flex-col items-center justify-center text-center gap-4">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce" />
                  <h3 className="framer-h4 font-medium text-cream">
                    Message Dispatched!
                  </h3>
                  <p className="text-cream/70 text-sm max-w-xs">
                    Thank you for reaching out. I’ll review your details and respond within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 px-6 py-2 rounded-full border border-cream/20 text-xs font-semibold hover:border-cream text-cream transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {/* Name field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold tracking-wide uppercase text-cream/70">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3.5 rounded-lg bg-cream/5 border border-cream/15 text-cream placeholder-cream/30 text-sm focus:outline-none focus:border-cream/60 focus:bg-cream/10 transition-all font-sans"
                    />
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold tracking-wide uppercase text-cream/70">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="jane@company.com"
                      className="w-full px-4 py-3.5 rounded-lg bg-cream/5 border border-cream/15 text-cream placeholder-cream/30 text-sm focus:outline-none focus:border-cream/60 focus:bg-cream/10 transition-all font-sans"
                    />
                  </div>

                  {/* Project description field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold tracking-wide uppercase text-cream/70">
                      Your Project
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.project}
                      onChange={(e) =>
                        setFormData({ ...formData, project: e.target.value })
                      }
                      placeholder="Tell me about your timeline, scope, and objectives..."
                      className="w-full px-4 py-3.5 rounded-lg bg-cream/5 border border-cream/15 text-cream placeholder-cream/30 text-sm focus:outline-none focus:border-cream/60 focus:bg-cream/10 transition-all font-sans resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <FormButton
                      text="Send Inquiry"
                      loading={isSubmitting}
                    />
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
