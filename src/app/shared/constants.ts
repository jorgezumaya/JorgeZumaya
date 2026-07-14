export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/in/jorgezumaya/',
  github: 'https://github.com/jorgezumaya',
  email: 'jorge.juarez87@me.com',
} as const;

export const WHATSAPP_NUMBER = '18178225269';

export interface NavLink {
  label: string;
  path: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Experience', path: '/experience' },
  { label: 'Work', path: '/work' },
  { label: 'Gallery', path: '/gallery' },
];

/** One is picked at random on each load — see App's favicon swap. */
export const FAVICONS = ['favicon-j.svg', 'favicon-jz.svg'] as const;
