import { useState, useEffect } from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { mainNavItems, authNavItems } from '@/config/navigation';
import { useTheme } from 'next-themes';
import { LanguageSwitcher } from './LanguageSwitcher';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [session, setSession] = useState<any>(null);

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

  const isAdmin = session?.user?.user_metadata?.role === 'admin';

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>{t('nav.menu')}</SheetTitle>
              </SheetHeader>
              <nav className="mt-4">
                <ul className="space-y-2">
                  {mainNavItems.map((item) => (
                    <li key={item.href}>
                      <Link to={item.href}>
                        <Button variant="ghost" className="w-full justify-start gap-2">
                          {item.icon && <item.icon size={20} />}
                          {t(item.title)}
                        </Button>
                      </Link>
                    </li>
                  ))}
                  {authNavItems
                    .filter(item => (!item.adminOnly || isAdmin) && (!item.requiresAuth || session))
                    .map((item) => (
                      <li key={item.href}>
                        <Link to={item.href}>
                          <Button variant="ghost" className="w-full justify-start gap-2">
                            {item.icon && <item.icon size={20} />}
                            {t(item.title)}
                          </Button>
                        </Link>
                      </li>
                    ))}
                  {!session && (
                    <>
                      <li>
                        <Link to="/auth?mode=login">
                          <Button variant="ghost" className="w-full justify-start">{t('nav.login')}</Button>
                        </Link>
                      </li>
                      <li>
                        <Link to="/auth?mode=signup">
                          <Button variant="ghost" className="w-full justify-start">{t('nav.signup')}</Button>
                        </Link>
                      </li>
                    </>
                  )}
                  {session && (
                    <li>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={handleLogout}
                      >
                        {t('nav.logout')}
                      </Button>
                    </li>
                  )}
                </ul>
              </nav>
              <div className="mt-4 flex items-center justify-between px-2">
                <LanguageSwitcher />
                <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo/Home Link */}
          <Link to="/" className="text-xl font-bold">
            <Button variant="ghost">PushNshop</Button>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4">
            {mainNavItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button variant="ghost" className="gap-2">
                  {item.icon && <item.icon size={20} />}
                  {t(item.title)}
                </Button>
              </Link>
            ))}
            {authNavItems
              .filter(item => (!item.adminOnly || isAdmin) && (!item.requiresAuth || session))
              .map((item) => (
                <Link key={item.href} to={item.href}>
                  <Button variant="ghost" className="gap-2">
                    {item.icon && <item.icon size={20} />}
                    {t(item.title)}
                  </Button>
                </Link>
              ))}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <LanguageSwitcher />
              {!session ? (
                <>
                  <Link to="/auth?mode=login">
                    <Button variant="ghost">{t('nav.login')}</Button>
                  </Link>
                  <Link to="/auth?mode=signup">
                    <Button variant="ghost">{t('nav.signup')}</Button>
                  </Link>
                </>
              ) : (
                <Button variant="ghost" onClick={handleLogout}>
                  {t('nav.logout')}
                </Button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};