export const faqCategories = ['All', 'Booking', 'Payment', 'Staying'] as const;
export type FaqCategory = Exclude<(typeof faqCategories)[number], 'All'>;

export type Faq = {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
};

export const WHATSAPP_URL = 'https://wa.me/6281200000000';

export const faqs: Faq[] = [
  {
    id: 'book',
    category: 'Booking',
    question: 'How do I book a kosan on KosFinder?',
    answer:
      'Search or browse the listings, pick the room you like, and press "Book now". You can reserve a survey slot first, or confirm the room right away if you are sure.',
  },
  {
    id: 'visit',
    category: 'Booking',
    question: 'Can I visit the room before I pay?',
    answer:
      'Yes. Every listing offers a free survey. Choose a time, meet the owner at the kosan, and only pay once you are happy with the room.',
  },
  {
    id: 'verified',
    category: 'Booking',
    question: 'Are the listings and owners verified?',
    answer:
      'Our team checks each owner and room before a listing goes live, so the photos, price, and facilities you see match what is on site.',
  },
  {
    id: 'deposit',
    category: 'Payment',
    question: 'How much is the deposit?',
    answer:
      'It depends on the owner, but most kosan ask for one month of rent as a deposit. The exact amount is always shown on the listing before you book.',
  },
  {
    id: 'safe',
    category: 'Payment',
    question: 'Is paying through KosFinder safe?',
    answer:
      'Payments are held securely and released to the owner after you move in, so your money is protected if something does not match the listing.',
  },
  {
    id: 'monthly',
    category: 'Payment',
    question: 'Can I pay monthly instead of upfront?',
    answer:
      'Yes. Monthly payment is the default for most kosan. Some owners also give a discount if you pay for three or six months at once.',
  },
  {
    id: 'utilities',
    category: 'Staying',
    question: 'Are electricity and Wi-Fi included in the price?',
    answer:
      'Each listing shows what is included. Many kosan on KosFinder include Wi-Fi and utilities, and the facility tags on every card tell you at a glance.',
  },
  {
    id: 'minimum',
    category: 'Staying',
    question: 'Is there a minimum length of stay?',
    answer:
      'Most owners ask for a minimum of one month. Longer stays are usually cheaper per month, so check the listing details before booking.',
  },
];