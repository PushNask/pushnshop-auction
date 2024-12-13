import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, User, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: t('auth.logoutSuccess'),
      description: t('auth.logoutMessage'),
    });
    navigate('/');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

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
            <Link to="/permanent-links" className="nav-link">{t('nav.permanentLinks')}</Link>
            {session && <Link to="/sell" className="nav-link">{t('nav.sell')}</Link>}
            {session?.user.user_metadata.role === 'admin' && (
              <Link to="/admin" className="nav-link">{t('nav.admin')}</Link>
            )}
            <Link to="/about" className="nav-link">{t('nav.about')}</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <LanguageSwitcher />
            <button className="p-2 hover:text-primary transition-colors">
              <ShoppingBag className="h-6 w-6" />
            </button>
            {session ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-6 w-6" />
                  </Button>
                </Link>
                <Button variant="outline" onClick={handleLogout}>
                  {t('nav.logout')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/auth">
                  <Button variant="outline">{t('nav.login')}</Button>
                </Link>
              </div>
            )}
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
              to="/permanent-links"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.permanentLinks')}
            </Link>
            {session && (
              <Link
                to="/sell"
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.sell')}
              </Link>
            )}
            {session?.user.user_metadata.role === 'admin' && (
              <Link
                to="/admin"
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.admin')}
              </Link>
            )}
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.about')}
            </Link>
            {!session && (
              <Link
                to="/auth"
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.login')}
              </Link>
            )}
            {session && (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {t('nav.account')}
                </Link>
                <button
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:text-primary transition-colors"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  {t('nav.logout')}
                </button>
              </>
            )}
            <div className="px-3 py-2 flex items-center justify-between">
              <LanguageSwitcher />
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};