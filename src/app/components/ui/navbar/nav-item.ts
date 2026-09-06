type Badge = {
  text: string;
  color?: string;
};

type NavChildren = (NavLink | NavDivider)[]; 

export type NavGroup = {
  type: 'group';
  label: string;
  badge?: Badge;
  children: NavChildren;
};

export type NavLink = {
  type: 'link';
  label: string;
  to: string;
  badge?: Badge;
  exact?: boolean;
  children?: NavChildren;
};

export type NavDivider = {
  type: 'divider';
};

export type NavItem = NavGroup | NavLink | NavDivider;