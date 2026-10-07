import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import grainImg from './assets/grain.png';

// ============================================================================
// CLIENT-SIDE RATE LIMITING (Max 2 submissions per visitor)
// NOTE: This submission limit is implemented purely on the client side without
// a backend or authentication server. While it uses multi-store synchronization
// (localStorage, long-lived cookie, and IndexedDB), browser fingerprinting, and
// a tamper-evident checksum to deter casual abuse, NO client-side-only mechanism
// can be 100% tamper-proof against users switching browsers, using incognito,
// or intentionally purging all client data simultaneously.
// ============================================================================
const MAX_MESSAGES = 2;
const STORAGE_KEY = '_sys_metrics_session';
const COOKIE_KEY = '__app_v2_metric';
const DB_NAME = '_app_sync_db';
const DB_STORE = 'app_metrics';
const DB_KEY = 'sub_metric_payload';
const SALT = 'ag_v2_contact_metric_98a7c!';

function getFingerprint() {
  if (typeof window === 'undefined') return '';
  const ua = navigator.userAgent || '';
  const lang = navigator.language || '';
  const screenRes = window.screen ? `${window.screen.width}x${window.screen.height}` : '';
  let tz = '';
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch (e) {
    tz = '';
  }
  return `${ua}:::${lang}:::${screenRes}:::${tz}`;
}

function computeHash(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}

function generateSignature(count) {
  return computeHash(`${count}:${SALT}:${getFingerprint()}`);
}

function encodePayload(count) {
  const payload = {
    c: count,
    sig: generateSignature(count),
    t: Date.now(),
  };
  try {
    return btoa(JSON.stringify(payload));
  } catch (e) {
    return '';
  }
}

function decodeAndValidate(raw) {
  if (!raw || typeof raw !== 'string') return null;
  try {
    const jsonStr = atob(raw);
    const parsed = JSON.parse(jsonStr);
    if (!parsed || typeof parsed !== 'object') {
      return { count: MAX_MESSAGES, tampered: true };
    }
    const { c, sig } = parsed;
    if (typeof c !== 'number' || isNaN(c) || c < 0) {
      return { count: MAX_MESSAGES, tampered: true };
    }
    const expectedSig = generateSignature(c);
    if (sig !== expectedSig) {
      return { count: MAX_MESSAGES, tampered: true };
    }
    return { count: c, tampered: false };
  } catch (e) {
    return { count: MAX_MESSAGES, tampered: true };
  }
}

function getLocalStorage() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

function setLocalStorage(val) {
  try {
    localStorage.setItem(STORAGE_KEY, val);
  } catch (e) {}
}

function getCookie() {
  try {
    const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + COOKIE_KEY + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  } catch (e) {
    return null;
  }
}

function setCookie(val) {
  try {
    document.cookie = `${COOKIE_KEY}=${encodeURIComponent(val)}; max-age=315360000; path=/; SameSite=Strict`;
  } catch (e) {}
}

function openDB() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return resolve(null);
    }
    try {
      const request = window.indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(DB_STORE)) {
          db.createObjectStore(DB_STORE);
        }
      };
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}

async function getIndexedDB() {
  try {
    const db = await openDB();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(DB_STORE, 'readonly');
        const store = tx.objectStore(DB_STORE);
        const req = store.get(DB_KEY);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  } catch (e) {
    return null;
  }
}

async function setIndexedDB(val) {
  try {
    const db = await openDB();
    if (!db) return;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(DB_STORE, 'readwrite');
        const store = tx.objectStore(DB_STORE);
        const req = store.put(val, DB_KEY);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  } catch (e) {}
}

async function syncAllStores(targetCount = null) {
  const rawLocal = getLocalStorage();
  const rawCookie = getCookie();
  const rawIdb = await getIndexedDB();

  const resLocal = rawLocal ? decodeAndValidate(rawLocal) : null;
  const resCookie = rawCookie ? decodeAndValidate(rawCookie) : null;
  const resIdb = rawIdb ? decodeAndValidate(rawIdb) : null;

  if (
    (resLocal && resLocal.tampered) ||
    (resCookie && resCookie.tampered) ||
    (resIdb && resIdb.tampered)
  ) {
    const lockedPayload = encodePayload(MAX_MESSAGES);
    setLocalStorage(lockedPayload);
    setCookie(lockedPayload);
    await setIndexedDB(lockedPayload);
    return MAX_MESSAGES;
  }

  let highestCount = 0;
  if (resLocal && resLocal.count > highestCount) highestCount = resLocal.count;
  if (resCookie && resCookie.count > highestCount) highestCount = resCookie.count;
  if (resIdb && resIdb.count > highestCount) highestCount = resIdb.count;

  if (targetCount !== null && targetCount > highestCount) {
    highestCount = targetCount;
  }

  if (highestCount > MAX_MESSAGES) {
    highestCount = MAX_MESSAGES;
  }

  const freshPayload = encodePayload(highestCount);
  if (rawLocal !== freshPayload) setLocalStorage(freshPayload);
  if (rawCookie !== freshPayload) setCookie(freshPayload);
  if (rawIdb !== freshPayload) await setIndexedDB(freshPayload);

  return highestCount;
}

function getInitialCount() {
  const rawLocal = getLocalStorage();
  const rawCookie = getCookie();
  const resLocal = rawLocal ? decodeAndValidate(rawLocal) : null;
  const resCookie = rawCookie ? decodeAndValidate(rawCookie) : null;
  if ((resLocal && resLocal.tampered) || (resCookie && resCookie.tampered)) {
    return MAX_MESSAGES;
  }
  return Math.max(resLocal ? resLocal.count : 0, resCookie ? resCookie.count : 0);
}

const SOCIAL_LINKS = [
  {
    name: 'X',
    url: 'https://x.com/aryankumar_04',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    url: 'https://github.com/aryankumar-04',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/aryankumargupta04',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    name: 'Reddit',
    url: 'https://www.reddit.com/user/aryankumar04/',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 8c2.648 0 5.028 .826 6.675 2.14a2.5 2.5 0 0 1 2.326 4.36c0 3.59 -4.03 6.5 -9 6.5c-4.875 0 -8.845 -2.8 -9 -6.294l-1 -.206a2.5 2.5 0 0 1 2.326 -4.36c1.646 -1.313 4.026 -2.14 6.674 -2.14l.999 0" />
        <path d="M12 8l1 -5l6 1" />
        <circle cx="19" cy="4" r="1.25" fill="currentColor" stroke="none" />
        <circle cx="9" cy="13" r="1.25" fill="currentColor" stroke="none" />
        <circle cx="15" cy="13" r="1.25" fill="currentColor" stroke="none" />
        <path d="M10 17c.667 .333 1.333 .5 2 .5s1.333 -.167 2 -.5" />
      </svg>
    ),
  },
];

function SocialIconsList() {
  return (
    <nav aria-label="Social links">
      <ul className="flex items-center gap-[16px]">
        {SOCIAL_LINKS.map((social) => (
          <li key={social.name}>
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="w-[40px] h-[40px] rounded-[8px] bg-[rgba(0,0,0,0.1)] hover:bg-[rgba(0,0,0,0.18)] active:bg-[rgba(0,0,0,0.22)] text-[#111111] flex items-center justify-center transition-colors duration-200 select-none shrink-0"
            >
              {social.icon}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Contact() {
  const [submissionCount, setSubmissionCount] = useState(getInitialCount);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    syncAllStores().then((count) => {
      if (isMounted) {
        setSubmissionCount(count);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please enter your name.';
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.project.trim()) errs.project = 'Please tell us about your project.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Check rate limit across all stores before submission
    const latestCount = await syncAllStores();
    if (latestCount >= MAX_MESSAGES) {
      setSubmissionCount(latestCount);
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);
    setResult('');

    try {
      const formTarget = e.target;
      const formDataObj = new FormData(formTarget);
      formDataObj.append('access_key', import.meta.env.VITE_WEB3FORMS_ACCESS_KEY);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formDataObj,
      });

      const data = await response.json();

      if (data.success) {
        const newCount = await syncAllStores(latestCount + 1);
        setSubmissionCount(newCount);
        setIsSubmitted(true);
        setResult('');
        setFormData({ name: '', email: '', project: '' });
        setErrors({});
        formTarget.reset();
      } else {
        setResult('Error');
      }
    } catch (err) {
      setResult('Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    if (submissionCount >= MAX_MESSAGES) return;
    setIsSubmitted(false);
    setResult('');
    setFormData({ name: '', email: '', project: '' });
    setErrors({});
  };

  return (
    <section
      id="contact"
      className="w-full bg-transparent py-[60px] tablet:py-[80px] desktop:py-[120px] scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-[1180px] mx-auto px-6 tablet:px-10 desktop:px-0">
        <div className="flex flex-col tablet:flex-row tablet:justify-between tablet:items-stretch gap-[40px] w-full">
          {/* LEFT COLUMN: Heading, Paragraph, and Social Buttons */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col justify-between items-start"
          >
            {/* Title & Description: Framer gap is 10px */}
            <div className="flex flex-col gap-[10px] w-full">
              <h2 className="font-sans font-semibold font-[600] text-[#111111] text-[46px] tablet:text-[62px] desktop:text-[76px] leading-[1.2em] tablet:leading-[1em] desktop:leading-[1em] tracking-[-0.02em] select-none m-0">
                Let&rsquo;s talk.
              </h2>
              <p className="text-[#111111] font-sans font-normal font-[400] text-[18px] leading-[1.4em] tracking-[-0.04em] m-0 max-w-[540px]">
                Have a project or need help? Fill out the form, and we&rsquo;ll get
                back to you soon.
              </p>
            </div>

            {/* Social Icons: On mobile sits right under text (mt-[28px]), on tablet/desktop pins to bottom of left column (tablet:mt-auto tablet:pt-[40px]) */}
            <div className="mt-[28px] tablet:mt-auto tablet:pt-[40px]">
              <SocialIconsList />
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Form Card */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="w-full tablet:w-[440px] desktop:w-[500px] shrink-0"
          >
            <div className="relative w-full rounded-[16px] bg-[#111111] p-[16px] text-[#FAF7F3] overflow-hidden select-none">
              {/* Grain Texture */}
              <div
                className="absolute inset-0 pointer-events-none rounded-[16px]"
                style={{
                  backgroundImage: `url(${grainImg})`,
                  backgroundRepeat: 'repeat',
                  opacity: 0.12,
                  mixBlendMode: 'overlay',
                }}
              />

              <div className="relative z-[2]">
                {isSubmitted ? (
                  <div className="min-h-[395px] flex flex-col items-center justify-center text-center gap-4 py-6">
                    <div className="flex flex-col gap-2 items-center">
                      <h3 className="font-sans font-medium text-[20px] tablet:text-[22px] text-[#FAF7F3] leading-[1.3em] tracking-[-0.02em] m-0">
                        Message sent successfully!
                      </h3>
                      <p className="font-sans font-normal text-[15px] tablet:text-[16px] text-[#FAF7F3]/70 leading-[1.5em] tracking-[-0.02em] m-0 max-w-[340px]">
                        Thanks for reaching out. I&rsquo;ll get back to you soon.
                      </p>
                      {submissionCount >= MAX_MESSAGES && (
                        <p className="font-sans font-normal text-[15px] tablet:text-[16px] text-[#FAF7F3]/70 leading-[1.5em] tracking-[-0.02em] m-0 max-w-[340px] pt-1">
                          You&rsquo;ve reached the message limit. For anything else, email me at{' '}
                          <a
                            href="mailto:contact.aryankgupta@gmail.com"
                            className="text-[#FAF7F3] underline underline-offset-2 hover:opacity-80 transition-opacity"
                          >
                            contact.aryankgupta@gmail.com
                          </a>
                        </p>
                      )}
                    </div>
                    {submissionCount < MAX_MESSAGES && (
                      <div className="w-full mt-4">
                        <button
                          type="button"
                          onClick={handleResetForm}
                          className="w-full h-[44px] rounded-[8px] bg-[#FAF7F3] hover:bg-white active:scale-[0.99] text-[#111111] font-sans font-medium text-[16px] tracking-[-0.02em] flex items-center justify-center transition-colors duration-200 cursor-pointer select-none"
                        >
                          Send another message
                        </button>
                      </div>
                    )}
                  </div>
                ) : submissionCount >= MAX_MESSAGES ? (
                  <div className="min-h-[395px] flex flex-col items-center justify-center text-center gap-4 py-6">
                    <div className="flex flex-col gap-2 items-center">
                      <h3 className="font-sans font-medium text-[20px] tablet:text-[22px] text-[#FAF7F3] leading-[1.3em] tracking-[-0.02em] m-0">
                        Message limit reached
                      </h3>
                      <p className="font-sans font-normal text-[15px] tablet:text-[16px] text-[#FAF7F3]/70 leading-[1.5em] tracking-[-0.02em] m-0 max-w-[340px]">
                        You&rsquo;ve reached the message limit. For anything else, email me at{' '}
                        <a
                          href="mailto:contact.aryankgupta@gmail.com"
                          className="text-[#FAF7F3] underline underline-offset-2 hover:opacity-80 transition-opacity"
                        >
                          contact.aryankgupta@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[20px]">
                    {/* Name Field */}
                    <div className="flex flex-col gap-[8px] w-full">
                      <label
                        htmlFor="contact-name"
                        className="font-sans font-normal text-[#FAF7F3] text-[16px] leading-[1.4em] tracking-[-0.04em] block"
                      >
                        Name
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: null });
                        }}
                        placeholder="Enter your name"
                        className={`w-full h-[44px] px-[14px] rounded-[8px] bg-transparent border ${
                          errors.name ? 'border-red-400' : 'border-[#262626] focus:border-[#555555]'
                        } text-[#FAF7F3] placeholder-[rgba(250,247,243,0.35)] text-[16px] font-sans leading-[1.4em] tracking-[-0.04em] focus:outline-none focus:ring-0 transition-colors`}
                      />
                      {errors.name && (
                        <span className="text-red-400 text-[12px] font-sans">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col gap-[8px] w-full">
                      <label
                        htmlFor="contact-email"
                        className="font-sans font-normal text-[#FAF7F3] text-[16px] leading-[1.4em] tracking-[-0.04em] block"
                      >
                        Email
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: null });
                        }}
                        placeholder="Enter your email"
                        className={`w-full h-[44px] px-[14px] rounded-[8px] bg-transparent border ${
                          errors.email ? 'border-red-400' : 'border-[#262626] focus:border-[#555555]'
                        } text-[#FAF7F3] placeholder-[rgba(250,247,243,0.35)] text-[16px] font-sans leading-[1.4em] tracking-[-0.04em] focus:outline-none focus:ring-0 transition-colors`}
                      />
                      {errors.email && (
                        <span className="text-red-400 text-[12px] font-sans">
                          {errors.email}
                        </span>
                      )}
                    </div>

                    {/* Project Field */}
                    <div className="flex flex-col gap-[8px] w-full">
                      <label
                        htmlFor="contact-project"
                        className="font-sans font-normal text-[#FAF7F3] text-[16px] leading-[1.4em] tracking-[-0.04em] block"
                      >
                        Your Project
                      </label>
                      <textarea
                        id="contact-project"
                        name="message"
                        rows={3}
                        required
                        value={formData.project}
                        onChange={(e) => {
                          setFormData({ ...formData, project: e.target.value });
                          if (errors.project) setErrors({ ...errors, project: null });
                        }}
                        placeholder="Tell us about your project"
                        className={`w-full h-[112px] p-[14px] rounded-[8px] bg-transparent border resize-none ${
                          errors.project ? 'border-red-400' : 'border-[#262626] focus:border-[#555555]'
                        } text-[#FAF7F3] placeholder-[rgba(250,247,243,0.35)] text-[16px] font-sans leading-[1.4em] tracking-[-0.04em] focus:outline-none focus:ring-0 transition-colors`}
                      />
                      {errors.project && (
                        <span className="text-red-400 text-[12px] font-sans">
                          {errors.project}
                        </span>
                      )}
                    </div>

                    {errors.form && (
                      <span className="text-red-400 text-[13px] text-center font-sans">
                        {errors.form}
                      </span>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-[44px] rounded-[8px] bg-[#FAF7F3] hover:bg-white active:scale-[0.99] text-[#111111] font-sans font-medium text-[16px] tracking-[-0.02em] flex items-center justify-center transition-colors duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed select-none"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        'Submit'
                      )}
                    </button>

                    {result && (
                      <p className={`text-[13px] text-center font-sans mt-2 m-0 ${result === 'Success!' ? 'text-[#FAF7F3]' : 'text-red-400'}`}>
                        {result}
                      </p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default Contact;
