'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Heart } from 'lucide-react';
import { getSettings, getInitiatives, getFooterLinks } from '@/lib/api';
import type { SiteSettings, Initiative, FooterLink } from '@/lib/api';
import { useDonateModal } from '@/contexts/DonateModalContext';

export default function Header() {
  const { open: openDonateModal } = useDonateModal();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [connectExtraLinks, setConnectExtraLinks] = useState<FooterLink[]>([]);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch((err) => {
        console.error('Failed to load settings:', err);
      });

    getInitiatives()
      .then(setInitiatives)
      .catch(console.error);

    // Extra "Connect With Us" menu items an admin can add from Admin → Footer
    // & Menu Links, beyond the fixed built-in ones below.
    getFooterLinks()
      .then((links) => {
        setConnectExtraLinks(
          links.filter((l) => l.section === 'HEADER_CONNECT').sort((a, b) => a.order - b.order)
        );
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleDropdownOpen = (name: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setOpenDropdown(name);
  };

  const handleDropdownClose = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
    setMobileOpenDropdown(null);
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-white border-b transition-shadow ${
        isScrolled ? 'shadow-md border-transparent' : 'border-gray-100'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={dropdownRef}>
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            {settings?.logo && (
              <Image
                src={settings.logo}
                alt="Win Foundations logo"
                width={100}
                height={100}
                className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 object-contain shrink-0"
                priority
              />
            )}
            <span className="font-bold text-base sm:text-2xl lg:text-3xl leading-tight text-gray-900 truncate">
              Win Foundations
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-0.5">
            <NavLink href="/">Home</NavLink>

            {/* About Us Dropdown */}
            <div
              className="group relative"
              onMouseEnter={() => handleDropdownOpen('about')}
              onMouseLeave={handleDropdownClose}
            >
              <button
                onClick={() => setOpenDropdown(openDropdown === 'about' ? null : 'about')}
                className={`relative px-2.5 py-2 text-sm font-medium whitespace-nowrap flex items-center gap-1 transition-colors ${
                  openDropdown === 'about' ? 'text-blue-700' : 'text-gray-700 hover:text-blue-700'
                }`}
              >
                About Us
                <ChevronDown size={16} className={`transition-transform ${openDropdown === 'about' ? 'rotate-180' : ''}`} />
                <span
                  className={`absolute left-2.5 right-2.5 -bottom-0.5 h-0.5 bg-amber-400 transition-transform duration-300 origin-left ${
                    openDropdown === 'about' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </button>

              {openDropdown === 'about' && (
                <div className="absolute left-0 mt-0 w-48 bg-white rounded-md shadow-lg z-50">
                  <Link href="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-blue-700 transition-colors">
                    Who We Are
                  </Link>
                  <Link href="/about#story" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-blue-700 transition-colors">
                    Our Story
                  </Link>
                  <Link href="/team" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-blue-700 transition-colors">
                    Our Team
                  </Link>
                </div>
              )}
            </div>

            {/* Initiatives Dropdown */}
            <div
              className="group relative"
              onMouseEnter={() => handleDropdownOpen('initiatives')}
              onMouseLeave={handleDropdownClose}
            >
              <button
                onClick={() => setOpenDropdown(openDropdown === 'initiatives' ? null : 'initiatives')}
                className={`relative px-2.5 py-2 text-sm font-medium whitespace-nowrap flex items-center gap-1 transition-colors ${
                  openDropdown === 'initiatives' ? 'text-blue-700' : 'text-gray-700 hover:text-blue-700'
                }`}
              >
                Initiatives
                <ChevronDown size={16} className={`transition-transform ${openDropdown === 'initiatives' ? 'rotate-180' : ''}`} />
                <span
                  className={`absolute left-2.5 right-2.5 -bottom-0.5 h-0.5 bg-amber-400 transition-transform duration-300 origin-left ${
                    openDropdown === 'initiatives' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </button>

              {openDropdown === 'initiatives' && (
                <div className="absolute left-0 mt-0 w-56 bg-white rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                  {initiatives.length > 0 ? (
                    initiatives.map((init) => (
                      <Link
                        key={init.id}
                        href={`/initiatives/${init.slug}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-blue-700 transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {init.title}
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">Loading initiatives...</div>
                  )}
                </div>
              )}
            </div>

            {/* Connect With Us Dropdown */}
            <div
              className="group relative"
              onMouseEnter={() => handleDropdownOpen('connect')}
              onMouseLeave={handleDropdownClose}
            >
              <button
                onClick={() => setOpenDropdown(openDropdown === 'connect' ? null : 'connect')}
                className={`relative px-2.5 py-2 text-sm font-medium whitespace-nowrap flex items-center gap-1 transition-colors ${
                  openDropdown === 'connect' ? 'text-blue-700' : 'text-gray-700 hover:text-blue-700'
                }`}
              >
                Connect With Us
                <ChevronDown size={16} className={`transition-transform ${openDropdown === 'connect' ? 'rotate-180' : ''}`} />
                <span
                  className={`absolute left-2.5 right-2.5 -bottom-0.5 h-0.5 bg-amber-400 transition-transform duration-300 origin-left ${
                    openDropdown === 'connect' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </button>

              {openDropdown === 'connect' && (
                <div className="absolute left-0 mt-0 w-56 bg-white rounded-md shadow-lg z-50">
                  <Link href="/campaigns" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-blue-700 transition-colors">
                    Campaigns List
                  </Link>
                  <Link href="/partner" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-blue-700 transition-colors">
                    Become a Partner
                  </Link>
                  <Link href="/internship" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-blue-700 transition-colors">
                    Internship
                  </Link>
                  <Link href="/volunteer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-blue-700 transition-colors">
                    Volunteer
                  </Link>
                  <Link href="/cv-building" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-blue-700 transition-colors">
                    CV Building
                  </Link>
                  <Link href="/faq" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-blue-700 transition-colors">
                    FAQ
                  </Link>
                  {connectExtraLinks.map((link) => (
                    <Link
                      key={link.id}
                      href={link.url}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-blue-700 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavLink href="/updates">Updates</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/gallery">Gallery</NavLink>
            <NavLink href="/contact">Contact Us</NavLink>
          </div>

          {/* Donate Button & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Desktop/tablet Donate button */}
            <button
              onClick={openDonateModal}
              className="hidden lg:flex group items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full font-bold text-sm whitespace-nowrap shadow-md hover:shadow-lg hover:bg-green-600 active:bg-green-600 active:translate-y-0 transition-all duration-150"
            >
              <Heart size={16} className="fill-white transition-colors duration-300 shrink-0" />
              Donate Now
            </button>

            {/* Mobile-only compact donate icon — full "Donate Now" CTA lives inside the slide-in menu instead */}
            <button
              onClick={openDonateModal}
              aria-label="Donate"
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white shadow-md active:bg-green-600 active:scale-95 transition-all duration-150"
            >
              <Heart size={18} className="fill-white" />
            </button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 -mr-2 shrink-0"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu — full-screen slide-in overlay, intentionally distinct from the
          desktop bar (its own header, large tap targets, prominent Donate CTA up top)
          rather than an inline dropdown that just pushes page content down. */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl flex flex-col transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2 min-w-0">
              {settings?.logo && (
                <Image
                  src={settings.logo}
                  alt="Win Foundations logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain shrink-0"
                />
              )}
              <span className="font-bold text-base text-gray-900 truncate">Win Foundations</span>
            </Link>
            <button
              onClick={closeMobileMenu}
              aria-label="Close menu"
              className="p-2 -mr-2 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="px-5 pt-4 pb-2 shrink-0">
            <button
              onClick={() => { closeMobileMenu(); openDonateModal(); }}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full font-bold text-sm shadow-md hover:bg-green-600 active:bg-green-600 active:scale-[0.98] transition-all duration-150"
            >
              <Heart size={16} className="fill-white" />
              Donate Now
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
            <MobileNavLink href="/" onClick={closeMobileMenu}>Home</MobileNavLink>

            {/* Mobile About Us Accordion */}
            <div>
              <button
                onClick={() => setMobileOpenDropdown(mobileOpenDropdown === 'about' ? null : 'about')}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <span>About Us</span>
                  <ChevronDown size={16} className={`transition-transform ${mobileOpenDropdown === 'about' ? 'rotate-180' : ''}`} />
                </div>
              </button>
              {mobileOpenDropdown === 'about' && (
                <div className="pl-4 space-y-2">
                  <MobileNavLink href="/about" onClick={closeMobileMenu}>Who We Are</MobileNavLink>
                  <MobileNavLink href="/about#story" onClick={closeMobileMenu}>Our Story</MobileNavLink>
                  <MobileNavLink href="/team" onClick={closeMobileMenu}>Our Team</MobileNavLink>
                </div>
              )}
            </div>

            {/* Mobile Initiatives Accordion */}
            <div>
              <button
                onClick={() => setMobileOpenDropdown(mobileOpenDropdown === 'initiatives' ? null : 'initiatives')}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <span>Initiatives</span>
                  <ChevronDown size={16} className={`transition-transform ${mobileOpenDropdown === 'initiatives' ? 'rotate-180' : ''}`} />
                </div>
              </button>
              {mobileOpenDropdown === 'initiatives' && (
                <div className="pl-4 space-y-2 max-h-64 overflow-y-auto">
                  {initiatives.map((init) => (
                    <MobileNavLink key={init.id} href={`/initiatives/${init.slug}`} onClick={closeMobileMenu}>
                      {init.title}
                    </MobileNavLink>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Connect With Us Accordion */}
            <div>
              <button
                onClick={() => setMobileOpenDropdown(mobileOpenDropdown === 'connect' ? null : 'connect')}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <span>Connect With Us</span>
                  <ChevronDown size={16} className={`transition-transform ${mobileOpenDropdown === 'connect' ? 'rotate-180' : ''}`} />
                </div>
              </button>
              {mobileOpenDropdown === 'connect' && (
                <div className="pl-4 space-y-2">
                  <MobileNavLink href="/campaigns" onClick={closeMobileMenu}>Campaigns List</MobileNavLink>
                  <MobileNavLink href="/partner" onClick={closeMobileMenu}>Become a Partner</MobileNavLink>
                  <MobileNavLink href="/internship" onClick={closeMobileMenu}>Internship</MobileNavLink>
                  <MobileNavLink href="/volunteer" onClick={closeMobileMenu}>Volunteer</MobileNavLink>
                  <MobileNavLink href="/cv-building" onClick={closeMobileMenu}>CV Building</MobileNavLink>
                  <MobileNavLink href="/faq" onClick={closeMobileMenu}>FAQ</MobileNavLink>
                  {connectExtraLinks.map((link) => (
                    <MobileNavLink key={link.id} href={link.url} onClick={closeMobileMenu}>
                      {link.label}
                    </MobileNavLink>
                  ))}
                </div>
              )}
            </div>

            <MobileNavLink href="/updates" onClick={closeMobileMenu}>Updates</MobileNavLink>
            <MobileNavLink href="/blog" onClick={closeMobileMenu}>Blog</MobileNavLink>
            <MobileNavLink href="/gallery" onClick={closeMobileMenu}>Gallery</MobileNavLink>
            <MobileNavLink href="/contact" onClick={closeMobileMenu}>Contact Us</MobileNavLink>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative px-2.5 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 whitespace-nowrap transition-colors ${className}`}
    >
      {children}
      <span className="absolute left-2.5 right-2.5 -bottom-0.5 h-0.5 bg-amber-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
    >
      {children}
    </Link>
  );
}
