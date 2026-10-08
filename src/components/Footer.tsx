'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { getSettings, getFooterLinks, getSiteConfig } from '@/lib/api';
import type { SiteSettings, FooterLink } from '@/lib/api';

const DEFAULT_TAGLINE = 'Creating positive impact through education, health, and community empowerment.';

const MAP_URL = 'https://maps.app.goo.gl/j5bXhnQBgcpVFtCc7';

// Whatever background color an admin picks for the footer, the text needs to
// stay readable — so text/icon/border colors switch between light-on-dark and
// dark-on-light based on the actual chosen color's brightness, instead of
// assuming the background is always dark.
function isLightColor(hex: string): boolean {
  const m = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(m)) return false;
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  // Standard relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231ZM17.083 19.77h1.833L7.084 4.126H5.117Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.9 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77a4.9 4.9 0 0 1 1.77-1.15c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 1.8c-2.67 0-2.99.01-4.04.06-.87.04-1.34.18-1.65.3-.42.16-.71.35-1.02.66-.31.31-.5.6-.66 1.02-.12.31-.26.78-.3 1.65C4.28 9.01 4.27 9.33 4.27 12s.01 2.99.06 4.04c.04.87.18 1.34.3 1.65.16.42.35.71.66 1.02.31.31.6.5 1.02.66.31.12.78.26 1.65.3 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.87-.04 1.34-.18 1.65-.3.42-.16.71-.35 1.02-.66.31-.31.5-.6.66-1.02.12-.31.26-.78.3-1.65.05-1.05.06-1.37.06-4.04s-.01-2.99-.06-4.04c-.04-.87-.18-1.34-.3-1.65a2.74 2.74 0 0 0-.66-1.02 2.74 2.74 0 0 0-1.02-.66c-.31-.12-.78-.26-1.65-.3C14.99 3.81 14.67 3.8 12 3.8Zm0 3.05a5.15 5.15 0 1 1 0 10.3 5.15 5.15 0 0 1 0-10.3Zm0 1.8a3.35 3.35 0 1 0 0 6.7 3.35 3.35 0 0 0 0-6.7Zm5.35-1.98a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />
    </svg>
  );
}

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [footerBgColor, setFooterBgColor] = useState('');

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch((err) => {
        console.error('Failed to load settings:', err);
      });

    getFooterLinks()
      .then(setFooterLinks)
      .catch((err) => {
        console.error('Failed to load footer links:', err);
      });

    getSiteConfig()
      .then((config) => {
        if (config.footerBgColor) setFooterBgColor(config.footerBgColor);
      })
      .catch((err) => {
        console.error('Failed to load footer appearance:', err);
      });
  }, []);

  const socialLinks = settings?.socialLinks || {};
  const currentYear = new Date().getFullYear();
  const isLight = footerBgColor ? isLightColor(footerBgColor) : false;

  const textMuted = isLight ? 'text-gray-600' : 'text-gray-300';
  const textFaint = isLight ? 'text-gray-500' : 'text-gray-400';
  const textFaintHover = isLight ? 'text-gray-500 hover:text-gray-900' : 'text-gray-400 hover:text-white';
  const linkHover = isLight ? 'hover:text-gray-900' : 'hover:text-white';
  const borderColor = isLight ? 'border-black/10' : 'border-white/10';

  const quickLinks = footerLinks
    .filter((link) => link.section === 'QUICK_LINKS')
    .sort((a, b) => a.order - b.order);

  const getInvolvedLinks = footerLinks
    .filter((link) => link.section === 'GET_INVOLVED')
    .sort((a, b) => a.order - b.order);

  return (
    <footer
      className={`bg-green-900 ${isLight ? 'text-gray-900' : 'text-white'}`}
      style={footerBgColor ? { backgroundColor: footerBgColor } : undefined}
    >
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-bold">Win Foundations</h3>
            </div>
            <p className={`${textMuted} text-sm`}>
              {settings?.footerTagline || DEFAULT_TAGLINE}
            </p>
            <div className="flex -ml-2.5 mt-4">
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 ${textFaintHover} transition`}
                  title="Facebook"
                >
                  <FacebookIcon />
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 ${textFaintHover} transition`}
                  title="X (Twitter)"
                >
                  <XIcon />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 ${textFaintHover} transition`}
                  title="LinkedIn"
                >
                  <LinkedinIcon />
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 ${textFaintHover} transition`}
                  title="Instagram"
                >
                  <InstagramIcon />
                </a>
              )}
            </div>
            {settings?.logo && (
              <Image
                src={settings.logo}
                alt="Win Foundations logo"
                width={160}
                height={160}
                className="h-32 w-32 object-contain bg-white rounded-xl p-2 mt-6"
              />
            )}
          </div>

          {/* Quick Links */}
          {quickLinks.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-4">Quick Links</h4>
              <ul className={`space-y-2 text-sm ${textMuted}`}>
                {quickLinks.map((link) => (
                  <li key={link.id}>
                    <Link href={link.url} className={`${linkHover} transition`}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Get Involved */}
          {getInvolvedLinks.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-4">Get Involved</h4>
              <ul className={`space-y-2 text-sm ${textMuted}`}>
                {getInvolvedLinks.map((link) => (
                  <li key={link.id}>
                    <Link href={link.url} className={`${linkHover} transition`}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact & Legal */}
          <div>
            <h4 className="text-md font-semibold mb-4">Contact</h4>
            <div className={`space-y-3 text-sm ${textMuted}`}>
              {settings?.address && (
                <div className="flex items-start space-x-2">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                  <a
                    href={MAP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkHover}
                  >
                    {settings.address}
                  </a>
                </div>
              )}
              {settings?.phone && (
                <div className="flex items-center space-x-2">
                  <Phone size={16} />
                  <a href={`tel:${settings.phone}`} className={linkHover}>
                    {settings.phone}
                  </a>
                </div>
              )}
              {settings?.email && (
                <div className="flex items-center space-x-2">
                  <Mail size={16} />
                  <a href={`mailto:${settings.email}`} className={linkHover}>
                    {settings.email}
                  </a>
                </div>
              )}
            </div>
            {(settings?.trust12A || settings?.trust80G) && (
              <div className="mt-6">
                <p className={`text-xs ${textFaint}`}>
                  {settings?.trust12A && (
                    <>12A Registration: {settings.trust12A}<br /></>
                  )}
                  {settings?.trust80G && (
                    <>80G Registration: {settings.trust80G}</>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t ${borderColor} mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm ${textMuted}`}>
          <p>&copy; {currentYear} Win Foundations. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy-policy" className={`${linkHover} transition`}>
              Privacy Policy
            </Link>
            <Link href="/terms-conditions" className={`${linkHover} transition`}>
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
