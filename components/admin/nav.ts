export type NavLink = { label: string; href: string };
export type NavItem = NavLink & { children?: NavLink[] };

export const dashboardNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Boarding Houses', href: '/admin/boarding-houses' },
  { label: 'Transactions', href: '/admin/transactions' },
  { label: 'Testimonials', href: '/admin/testimonials' },
  {
    label: 'Master Data',
    href: '/dashboard/master',
    children: [
      { label: 'Cities', href: '/admin/cities' },
      { label: 'Categories', href: '/admin/categories' },
      { label: 'Users', href: '/admin/users' },
    ],
  },
];

export const isActivePath = (pathname: string, href: string) =>
  href === '/dashboard' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

export const isItemActive = (pathname: string, item: NavItem) =>
  item.children ? item.children.some((c) => isActivePath(pathname, c.href)) : isActivePath(pathname, item.href);