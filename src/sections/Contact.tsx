import emailjs from '@emailjs/browser';
import { useRef, useState, useEffect } from 'react';

import useAlert from '../hooks/useAlert.ts';
import Alert from '../components/Alert.tsx';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const { alert, showAlert, hideAlert } = useAlert();
  const [loading, setLoading] = useState<boolean>(false);

  const [form, setForm] = useState<FormData>({ name: '', email: '', message: '' });

  const handleChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [name]: value });
  };

  useEffect(() => {
    const { VITE_PORTFOLIO_EMAILJS_PUBLIC_KEY: PUBLIC_KEY } = import.meta.env;
    if (PUBLIC_KEY) {
      // ensure EmailJS is initialized
      try {
        emailjs.init(PUBLIC_KEY);
        console.log('EmailJS Initialized');
      } catch (err) {
        console.warn('EmailJS init warning:', err);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        VITE_PORTFOLIO_EMAILJS_SERVICE_ID: SERVICE_ID,
        VITE_PORTFOLIO_EMAILJS_TEMPLATE_ID: TEMPLATE_ID,
        VITE_PORTFOLIO_EMAILJS_PUBLIC_KEY: PUBLIC_KEY,
      } = import.meta.env;

      if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        //console.error('Missing EmailJS env variables', { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY });
        setLoading(false);
        showAlert({
          show: true,
          text: 'Email service is not configured. Check env vars.',
          type: 'danger',
        });
        return;
      }

      const templateParams = {
        from_name: form.name,
        to_name: 'Mushtaq',
        from_email: form.email,
        to_email: 'mushtaquok70@gmail.com',
        message: form.message,
      };

      //console.log('templateParams:', templateParams);

      const res = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      console.log('EmailJS send success:', res);

      setLoading(false);
      showAlert({
        show: true,
        text: 'Thanks for your message!',
        type: 'success',
      });

      setTimeout(() => {
        hideAlert(false);
        setForm({ name: '', email: '', message: '' });
      }, 3000);
    } catch (error: unknown) {
      setLoading(false);

      console.error('EmailJS send failed:', error);
      try {
        console.error('error as JSON:', JSON.stringify(error));
      } catch (e) {
        console.error('error stringify failed:', e);
      }

      const err = error as { status?: number; text?: string; message?: string; response?: { text?: () => Promise<string> } };
      if (err?.status) console.error('status:', err.status);
      if (err?.text) console.error('text:', err.text);
      if (err?.message) console.error('message:', err.message);

      // trying to read body 
      if (err?.response && typeof err.response.text === 'function') {
        try {
          const body = await err.response.text();
          console.error('error.response.text():', body);
        } catch (e) {
          console.error('reading error.response.text() failed', e);
        }
      }

      showAlert({
        show: true,
        text: "I didn't receive your message",
        type: 'danger',
      });
    }
  };

  return (
    <section className="c-space my-20" id="contact">
      {alert.show && <Alert {...alert} />}

      <div className="relative min-h-screen flex items-center justify-center flex-col">

        {/** Terminal Container */}
        <div className="terminal-shell relative z-10 w-full max-w-2xl mx-auto">
          {/** Terminal Header */}
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className='dot red' />
              <span className='dot yellow' />
              <span className='dot green' />
            </div>
            <div className="terminal-plus">+</div>
          </div>

          {/** Terminal Body */}
        
          <div className="terminal-body">
            <h3 className="head-text">Let's talk</h3>
            <p className="text-lg text-white-600 mt-3">
              Let's turn your vision into user-friendly, hight-performance reality that drives results.
            </p>

            <form ref={formRef} onSubmit={handleSubmit} className="mt-12 flex flex-col space-y-7">
              <label className="space-y-3">
                <span className="field-label">Full Name</span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="field-input"
                  placeholder="John Doe"
                />
              </label>

              <label className="space-y-3">
                <span className="field-label">Email address</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="field-input"
                  placeholder="johndoe@gmail.com"
                />
              </label>

              <label className="space-y-3">
                <span className="field-label">Your message</span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="field-input"
                  placeholder="Let's turn your vision into user-friendly, high-performance reality that drives results."
                />
              </label>

              <button className="field-btn" type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}

                <img src="/assets/arrow-up.png" alt="arrow-up" className="field-btn_arrow" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
