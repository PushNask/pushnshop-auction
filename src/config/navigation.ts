import { Home, Package, Link as LinkIcon, Info, ShoppingBag, User, Settings } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon?: any;
  requiresAuth?: boolean;
  adminOnly?: boolean;
  children?: NavItem[];
};

export const mainNavItems: NavItem[] = [
  {
    title: 'nav.home',
    href: '/',
    icon: Home
  },
  {
    title: 'nav.products',
    href: '/products',
    icon: Package
  },
  {
    title: 'nav.permanentLinks',
    href: '/permanent-links',
    icon: LinkIcon
  },
  {
    title: 'nav.about',
    href: '/about',
    icon: Info
  }
];

export const authNavItems: NavItem[] = [
  {
    title: 'nav.sell',
    href: '/sell',
    icon: ShoppingBag,
    requiresAuth: true
  },
  {
    title: 'nav.account',
    href: '/profile',
    icon: User,
    requiresAuth: true
  },
  {
    title: 'nav.admin',
    href: '/admin',
    icon: Settings,
    requiresAuth: true,
    adminOnly: true
  }
];