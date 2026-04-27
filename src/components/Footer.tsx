'use client';

import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
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
  const { darkMode, language } = useStore();
  const T = (key: string) => t(language, key);

  const sections = [
    {
      titleKey: 'shop',
      links: [
        { labelKey: 'allProducts', href: '/' },
        { labelKey: 'featured', href: '/' },
        { labelKey: 'newArrivals', href: '/' },
        { labelKey: 'offers', href: '/' },
      ]
    },
    {
      titleKey: 'support',
      links: [
        { labelKey: 'helpCenter', href: '/' },
        { labelKey: 'trackOrder', href: '/' },
        { labelKey: 'returns', href: '/' },
        { labelKey: 'shippingInfo', href: '/' },
      ]
    },
    {
      titleKey: 'company',
      links: [
        { labelKey: 'aboutUs', href: '/' },
        { labelKey: 'careers', href: '/' },
        { labelKey: 'storeLocations', href: '/' },
        { labelKey: 'contactUs', href: '/' },
      ]
    }
  ];

  return (
    <footer className={`mt-20 border-t ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-100'}`}>
      {/* Top Value Props */}
      <div className={`border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className="max-w-[1600px] mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{T('freeDelivery')}</h4>
                <p className="text-xs text-gray-500">{T('freeDeliveryDesc')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{T('securePayment')}</h4>
                <p className="text-xs text-gray-500">{T('securePaymentDesc')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{T('easyReturns')}</h4>
                <p className="text-xs text-gray-500">{T('easyReturnsDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <div className={`font-bold text-base leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Simba</div>
                <div className="text-[10px] text-orange-500 font-bold uppercase tracking-tighter leading-tight">Supermarket</div>
              </div>
            </div>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {T('footerTagline')}
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
            <div key={section.titleKey}>
              <h4 className={`font-bold text-base mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{T(section.titleKey)}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      href={link.href}
                      className={`text-sm transition-colors flex items-center group gap-1 ${
                        darkMode ? 'text-gray-400 hover:text-orange-500' : 'text-gray-500 hover:text-orange-500'
                      }`}
                    >
                      {T(link.labelKey)}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>{T('stayUpdated')}</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {T('subscribeNewsletter')}
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder={T('footerEmailPlaceholder')}
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
            {(['privacyPolicy', 'termsOfService', 'cookiePolicy'] as const).map((key) => (
              <Link key={key} href="/" className={`text-xs hover:text-orange-500 transition-colors ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {T(key)}
              </Link>
            ))}
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              © 2026 Simba Supermarket. {T('allRightsReserved')}
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
