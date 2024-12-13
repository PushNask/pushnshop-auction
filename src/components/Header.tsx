import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
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
                  <li>
                    <Link to="/">
                      <Button variant="ghost" className="w-full justify-start">{t('nav.home')}</Button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/auth?mode=signup">
                      <Button variant="ghost" className="w-full justify-start">{t('nav.signup')}</Button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/auth?mode=login">
                      <Button variant="ghost" className="w-full justify-start">{t('nav.login')}</Button>
                    </Link>
                  </li>
                </ul>
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" className="text-xl font-bold">PushNshop</Link>

          <nav className="hidden lg:flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost">{t('nav.home')}</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button variant="ghost">{t('nav.signup')}</Button>
            </Link>
            <Link to="/auth?mode=login">
              <Button variant="ghost">{t('nav.login')}</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};