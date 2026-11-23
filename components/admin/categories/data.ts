export type Category = {
  id: number;
  name: string;
  slug: string;
  created_at?: string;
};

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');