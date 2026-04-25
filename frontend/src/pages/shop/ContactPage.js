import React, { useState } from 'react';
import API from '../../utils/api';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error('Please fill in required fields');
    setLoading(true);
    try {
      await API.post('/contact', form);
      setSent(true);
      toast.success('Message sent! 🌸');
    } catch {
      toast.error('Failed to send. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 page-enter">
      <div className="text-center mb-12">
        <h1 className="section-title">Contact Us</h1>
        <div className="pink-divider mx-auto" />
        <p className="text-gray-500 mt-2 text-sm">We'd love to hear from you! 🌸</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Info */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Get in Touch</h3>
            <div className="space-y-4">
              {[
                { icon: '📧', label: 'Email', value: 'hello@herwall.com' },
                { icon: '📱', label: 'WhatsApp', value: '+977 98XX-XXXXXX' },
                { icon: '📍', label: 'Location', value: 'Kathmandu, Nepal' },
                { icon: '🕐', label: 'Working Hours', value: 'Sun–Fri, 10 AM – 6 PM' },
              ].map(c => (
                <div key={c.label} className="flex gap-3 items-start">
                  <span className="text-xl flex-shrink-0">{c.icon}</span>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">{c.label}</p>
                    <p className="text-sm text-gray-700">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-pink-50 to-purple-50">
            <h3 className="font-semibold text-gray-900 mb-2">🌸 Custom Orders</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Want a custom size, special paper, or bulk order? Contact us and we'll make it happen!
            </p>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Follow Us</h3>
            <div className="flex gap-3">
              {[['Instagram', '📸'], ['Facebook', '👍'], ['TikTok', '🎵']].map(([s, icon]) => (
                <div key={s} className="flex items-center gap-2 bg-pink-50 px-3 py-2 rounded-xl text-sm text-pink-700 font-medium">
                  {icon} {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card p-6">
          {sent ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💌</div>
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
              <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                className="btn-outline mt-6">Send Another Message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Name *</label>
                  <input className="input" name="name" placeholder="Your name" value={form.name} onChange={handleChange} />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input className="input" name="phone" placeholder="WhatsApp number" value={form.phone} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label className="label">Email *</label>
                <input className="input" type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Subject</label>
                <input className="input" name="subject" placeholder="What's this about?" value={form.subject} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Message *</label>
                <textarea className="input resize-none" rows={5} name="message" placeholder="Tell us what you need..."
                  value={form.message} onChange={handleChange} />
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary py-3 disabled:opacity-60">
                {loading ? 'Sending...' : '💌 Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
