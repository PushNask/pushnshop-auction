import { useState } from 'react';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <nav className="fixed w-full top-0 z-50 glass-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-accent">
              PushNshop
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">{t('nav.home')}</Link>
            <Link to="/products" className="nav-link">{t('nav.products')}</Link>
            <Link to="/sell" className="nav-link">{t('nav.sell')}</Link>
            <Link to="/about" className="nav-link">{t('nav.about')}</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 hover:text-primary transition-colors">
              <ShoppingBag className="h-6 w-6" />
            </button>
            <button className="p-2 hover:text-primary transition-colors">
              <User className="h-6 w-6" />
            </button>
            <LanguageSwitcher />
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-accent hover:text-primary transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="glass-card px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/products"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.products')}
            </Link>
            <Link
              to="/sell"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.sell')}
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.about')}
            </Link>
            <div className="px-3 py-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};