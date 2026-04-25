import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-pink-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <span className="font-accent text-3xl text-pink-600">Herwall</span>
            <p className="mt-3 text-sm text-gray-500 max-w-xs leading-relaxed">
              Premium K-Pop poster printing service. Bring your favorite artists to life with our high-quality prints delivered across Nepal.
            </p>
            <div className="flex gap-4 mt-4">
              {['instagram', 'facebook', 'tiktok'].map(s => (
                <a key={s} href={`https://${s}.com`} target="_blank" rel="noreferrer"
                  className="w-9 h-9 bg-pink-50 hover:bg-pink-100 rounded-full flex items-center justify-center text-pink-500 transition-colors capitalize text-xs font-bold">
                  {s[0].toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              {[['/', 'Home'], ['/shop', 'Shop'], ['/track', 'Track Order'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-pink-600 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                hello@herwall.com
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                +977 98XX-XXXXXX
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Kathmandu, Nepal
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Herwall. All rights reserved. Made with 🌸 in Nepal</p>
          <div className="flex items-center gap-4">
            <span className="bg-pink-50 text-pink-600 px-2 py-0.5 rounded font-medium">eSewa</span>
            <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded font-medium">Khalti</span>
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
