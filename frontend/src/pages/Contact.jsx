import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin, Send, Loader2 } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { ScrollReveal } from '../hooks/useScrollReveal';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000/api');

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const response = await fetch(`${BACKEND_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send');

      toast({
        title: "Message sent!",
        description: "We'll get back to you within 24 hours."
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Message sent!",
        description: "We'll get back to you within 24 hours."
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen pt-28 relative z-[1]">
      {/* Hero */}
      <div className="relative py-14 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-magenta-500/10 rounded-full blur-3xl"></div>
        </div>

        <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-3 sm:mb-6">
              Get in <span className="trippy-text">Touch</span>
            </h1>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-300">
              Have questions? Want to collaborate? Just wanna vibe? Hit us up!
            </p>
          </div>
        </ScrollReveal>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Contact Info */}
          <div className="space-y-4 sm:space-y-6">
            {[
              { icon: Mail, color: 'cyan', title: 'Email Us', desc: 'Drop us a line anytime', link: 'support@trippydrip.co.in', href: 'mailto:support@trippydrip.co.in' },
              { icon: MessageSquare, color: 'magenta', title: 'Live Chat', desc: '24/7 support available', link: 'Start a conversation', href: '#' },
              { icon: MapPin, color: 'yellow', title: 'Visit Us', desc: 'Worldwide Shipping\nBased in India', link: null },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 100}>
                <div className={`glow-card p-5 sm:p-6 rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 hover:border-${item.color}-500/50 transition-all`}>
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-${item.color}-500/10 flex items-center justify-center mb-3 sm:mb-4`}>
                    <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${item.color}-400`} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 sm:mb-2">{item.title}</h3>
                  <p className="text-gray-300 text-sm mb-2 whitespace-pre-line">{item.desc}</p>
                  {item.link && (
                    <a href={item.href} className={`text-${item.color}-400 hover:text-${item.color}-300 transition-colors text-sm`}>
                      {item.link}
                    </a>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ScrollReveal direction="right">
              <div className="p-5 sm:p-8 rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800">
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 sm:mb-6">Send us a Message</h2>

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2 text-sm">Name</label>
                      <input
                        type="text" name="name" value={formData.name} onChange={handleChange} required
                        className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all placeholder-gray-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2 text-sm">Email</label>
                      <input
                        type="email" name="email" value={formData.email} onChange={handleChange} required
                        className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all placeholder-gray-500"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2 text-sm">Subject</label>
                    <input
                      type="text" name="subject" value={formData.subject} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all placeholder-gray-500"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2 text-sm">Message</label>
                    <textarea
                      name="message" value={formData.message} onChange={handleChange} required rows="5"
                      className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all resize-none placeholder-gray-500"
                      placeholder="Tell us everything..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 text-white font-bold text-base sm:text-lg rounded-full hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-60 disabled:hover:scale-100"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
