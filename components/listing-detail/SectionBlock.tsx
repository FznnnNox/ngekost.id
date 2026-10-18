import React from 'react';

type Props = {
  title: string;
  children: React.ReactNode;
};

/** Pembungkus tiap bagian detail: garis pemisah + judul + isi */
export default function SectionBlock({ title, children }: Props) {
  return (
    <section className="border-t border-white/10 pt-8">
      <h3 className="text-[17px] font-medium text-white">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}