import React from 'react';

type Props = {
  eyebrow: string;
  title: string;
  tone?: 'dark' | 'light'; 
};

export default function SectionHeading({ eyebrow, title, tone = 'dark' }: Props) {
  const color = tone === 'light' ? 'text-[#111]' : 'text-[#ededed]';

  return (
    <div>
      <h2 className={`text-[clamp(28px,6vw,40px)] font-light leading-none ${color}`}>{eyebrow}</h2>
      <h3
        className={`mt-2 text-[clamp(44px,11vw,84px)] font-normal uppercase leading-none tracking-[-0.01em] ${color}`}
      >
        {title}
      </h3>
    </div>
  );
}