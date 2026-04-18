'use client';

import { useStore } from '@/lib/store';
import { 
  Send,
  ExternalLink,
  ShieldCheck,
  Truck,
  RotateCcw,
  Globe,
  Mail,
  MessageSquare,
  Info
} from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const { darkMode } = useStore();

  const sections = [
    {
      title: 'Shop',
      links: [
        { label: 'All Products', href: '/' },
        { label: 'Featured', href: '/' },
        { label: 'New Arrivals', href: '/' },
        { label: 'Offers', href: '/' },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/' },
        { label: 'Track Order', href: '/' },
        { label: 'Returns', href: '/' },
        { label: 'Shipping Info', href: '/' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/' },
        { label: 'Careers', href: '/' },
        { label: 'Store Locations', href: '/' },
        { label: 'Contact Us', href: '/' },
      ]
    }
  ];

  return (
    <footer className={`mt-20 border-t ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-100'}`}>
      {/* Top Value Props */}
      <div className={`border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Free Delivery</h4>
                <p className="text-xs text-gray-500">On all orders in Kigali</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Secure Payment</h4>
                <p className="text-xs text-gray-500">100% secure checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Easy Returns</h4>
                <p className="text-xs text-gray-500">7-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <span className="text-white font-black text-xl">S</span>
              </div>
              <div>
                <div className={`font-black text-lg leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Simba</div>
                <div className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">Supermarket</div>
              </div>
            </div>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Rwanda&apos;s leading online supermarket. We bring quality, freshness, and convenience to your doorstep in Kigali.
            </p>
            <div className="flex items-center gap-3">
              {[Globe, Mail, MessageSquare, Info].map((Icon, i) => (
                <button 
                  key={i} 
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    darkMode ? 'bg-gray-800 text-gray-400 hover:bg-orange-500 hover:text-white' : 'bg-gray-50 text-gray-500 hover:bg-orange-500 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className={`font-bold text-base mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className={`text-sm transition-colors flex items-center group gap-1 ${
                        darkMode ? 'text-gray-400 hover:text-orange-500' : 'text-gray-500 hover:text-orange-500'
                      }`}
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>Stay Updated</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Subscribe to our newsletter for exclusive deals and updates.
            </p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Your email address"
                className={`w-full pl-4 pr-12 py-3 rounded-2xl border outline-none transition-all ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-orange-500'
                }`}
              />
              <button className="absolute right-1.5 top-1.5 w-9 h-9 bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6 ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="flex flex-wrap justify-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Link key={item} href="/" className={`text-xs hover:text-orange-500 transition-colors ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {item}
              </Link>
            ))}
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              © 2026 Simba Supermarket. All rights reserved.
            </p>
            <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               <div className="h-6 w-10 bg-gray-400/20 rounded-md"></div>
               <div className="h-6 w-10 bg-gray-400/20 rounded-md"></div>
               <div className="h-6 w-10 bg-gray-400/20 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
