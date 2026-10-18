export type StepId = 'search' | 'survey' | 'movein';

export type Preview =
  | { type: 'chips'; label: string; items: string[]; active?: number }
  | { type: 'checklist'; label: string; items: string[] };

export type Step = {
  id: StepId;
  title: string;
  desc: string;
  tone: 'dark' | 'light';
  preview: Preview;
};

export const steps: Step[] = [
  {
    id: 'search',
    title: 'Search & Compare',
    desc: 'Filter by area, budget, and facilities. See prices and photos side by side.',
    tone: 'dark',
    preview: { type: 'chips', label: 'Your filters', items: ['Near campus', 'Under Rp 1.5M', 'Wi-Fi', 'AC'] },
  },
  {
    id: 'survey',
    title: 'Book a Free Survey',
    desc: 'Pick a time and visit the room with the owner. No payment needed to look.',
    tone: 'light',
    preview: { type: 'chips', label: 'Available slots', items: ['Sat · 10:00', 'Sat · 16:00', 'Sun · 09:00'], active: 1 },
  },
  {
    id: 'movein',
    title: 'Pay & Move In',
    desc: 'Confirm with secure payment, get your digital key, and move in on your date.',
    tone: 'dark',
    preview: { type: 'checklist', label: 'Move-in status', items: ['Payment confirmed', 'Digital key sent'] },
  },
];