import type { LucideIcon } from 'lucide-react';
import { BadgeCheck, HeartHandshake, Wallet } from 'lucide-react';

export const story = [
  'KosFinder started with a simple frustration: finding a decent kosan in Serang meant asking around, scrolling through scattered posts, and visiting rooms that looked nothing like their photos.',
  'We bring verified listings, honest prices, and a real map into one place, so students and young professionals can choose a home with confidence instead of guesswork.',
];

export const stats = [
  { value: '2K+', label: 'Kosan listed' },
  { value: '15K+', label: 'Happy tenants' },
  { value: '100%', label: 'Verified owners' },
  { value: '4.8', label: 'Average rating' },
];

export type Value = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

export const values: Value[] = [
  {
    icon: BadgeCheck,
    title: 'Verified, always',
    desc: 'Every owner and room is checked by our team before it goes live, so what you see is what you get.',
  },
  {
    icon: Wallet,
    title: 'Honest pricing',
    desc: 'Monthly prices, deposits, and what is included are shown upfront. No surprise fees after you move in.',
  },
  {
    icon: HeartHandshake,
    title: 'Local support',
    desc: 'We are based in Serang and know the neighborhoods, so we can help you find the right area, not just a room.',
  },
];