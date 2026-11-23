'use client';

import React, { useEffect, useState } from 'react';
import { PenLine, Star } from 'lucide-react';
import { type ReviewItem } from '@/components/listing-detail/reviews-data';
import * as testimonialApi from '@/components/admin/testimonials/api';

const palette = ['#2f6f5e', '#7a4b8a', '#9a6b2f', '#3c5f9a', '#a2465a', '#4d7a3a'];
const MAX_LEN = 500;
const MIN_LEN = 10;

const field =
  'w-full rounded-xl border border-white/10 bg-[#222222] px-4 py-2.5 text-[13px] text-white outline-none transition-colors placeholder:text-[#777] focus:border-white/40';

function Stars({ value, className = 'h-4 w-4' }: { value: number; className?: string }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${className} ${
            i <= Math.round(value) ? 'fill-[#f5b301] text-[#f5b301]' : 'text-[#444]'
          }`}
        />
      ))}
    </span>
  );
}

function Avatar({ name, photo }: { name: string; photo?: string }) {
  if (photo) return <img src={photo} alt="" className="h-10 w-10 rounded-full object-cover" />;
  const color = palette[name.charCodeAt(0) % palette.length];
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-medium text-white"
      style={{ background: color }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

type Props = {
  boardingHouseId?: number;
  baseRating?: number;
  baseCount?: number;
};

export default function ReviewSection({ boardingHouseId, baseRating = 5, baseCount = 0 }: Props) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [length, setLength] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [thanks, setThanks] = useState(false);

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = boardingHouseId
          ? await testimonialApi.fetchTestimonialsByHouse(boardingHouseId)
          : await testimonialApi.fetchAllTestimonials();

        const mapped: ReviewItem[] = data.map((t) => ({
          id: t.id,
          name: t.name,
          photo: t.avatar || undefined,
          rating: t.rating,
          content: t.content,
          date: t.createdAt
            ? new Date(t.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : 'Recently',
        }));
        setReviews(mapped);
      } catch (e) {
        console.error('Gagal memuat ulasan:', e);
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, [boardingHouseId]);

  const count = reviews.length > 0 ? reviews.length : baseCount;
  const average =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : baseRating;
  const visible = showAll ? reviews : reviews.slice(0, 4);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const f = new FormData(form);
    const name = String(f.get('name')).trim();
    const content = String(f.get('content')).trim();

    if (!name) return setError('Please enter your name.');
    if (rating === 0) return setError('Please choose a star rating.');
    if (content.length < MIN_LEN)
      return setError(`Your review should be at least ${MIN_LEN} characters.`);

    setSubmitting(true);
    try {
      const created = await testimonialApi.createTestimonial({
        boardingHouseId,
        name,
        rating,
        content,
      });

      setReviews((p) => [
        {
          id: created.id,
          name: created.name,
          rating: created.rating,
          content: created.content,
          date: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
        },
        ...p,
      ]);

      form.reset();
      setRating(0);
      setHover(0);
      setLength(0);
      setError('');
      setOpen(false);
      setThanks(true);
      setTimeout(() => setThanks(false), 3500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim ulasan.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-[44px] font-light leading-none text-white">
            {average.toFixed(1)}
          </span>
          <div>
            <Stars value={average} className="h-5 w-5" />
            <p className="mt-1 text-[13px] text-[#9c9c9c]">{count} reviews</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="review-form"
          className="inline-flex items-center gap-2 rounded-full bg-[#ededed] px-5 py-3 text-[14px] font-medium text-[#111] transition-colors hover:bg-white"
        >
          <PenLine className="h-4 w-4" />
          Write a review
        </button>
      </div>

      {thanks && (
        <p
          role="status"
          className="mt-4 rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 text-[13px] text-[#cfcfcf]"
        >
          Thanks! Your review has been added.
        </p>
      )}

      {open && (
        <form
          id="review-form"
          onSubmit={handleSubmit}
          noValidate
          className="mt-5 grid gap-4 rounded-2xl border border-white/10 bg-[#1a1a1a] p-5"
        >
          <label className="grid gap-2 text-[13px] text-[#cfcfcf]">
            Your name
            <input
              name="name"
              maxLength={60}
              autoComplete="name"
              placeholder="e.g. Rizky Aditya"
              className={field}
            />
          </label>

          <div className="grid gap-2 text-[13px] text-[#cfcfcf]">
            <span id="rating-label">Your rating</span>
            <div
              role="radiogroup"
              aria-labelledby="rating-label"
              className="flex gap-1"
              onMouseLeave={() => setHover(0)}
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  role="radio"
                  aria-checked={rating === i}
                  aria-label={`${i} star${i > 1 ? 's' : ''}`}
                  onClick={() => setRating(i)}
                  onMouseEnter={() => setHover(i)}
                  className="rounded-md p-0.5 transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  <Star
                    className={`h-7 w-7 ${
                      i <= (hover || rating) ? 'fill-[#f5b301] text-[#f5b301]' : 'text-[#555]'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <label className="grid gap-2 text-[13px] text-[#cfcfcf]">
            Your review
            <textarea
              name="content"
              rows={4}
              maxLength={MAX_LEN}
              onChange={(e) => setLength(e.target.value.length)}
              placeholder="Share what you liked, and what could be better."
              className={`${field} resize-none`}
            />
            <span className="text-right text-[11px] text-[#777]">
              {length}/{MAX_LEN}
            </span>
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-[#5c2420] bg-[#2a1413] px-4 py-2.5 text-[12px] text-[#ff9a90]"
            >
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setError('');
              }}
              className="rounded-full border border-white/15 px-5 py-2.5 text-[13px] text-[#cfcfcf] transition-colors hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-[#ededed] px-6 py-2.5 text-[13px] font-medium text-[#111] transition-colors hover:bg-white disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit review'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/15 border-t-[#ededed]" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="mt-6 text-[13px] text-[#8a8a86]">
          Belum ada ulasan untuk kosan ini. Jadilah yang pertama memberikan ulasan!
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {visible.map((r) => (
            <li
              key={r.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#1a1a1a] p-4"
            >
              <div className="flex items-center gap-3">
                <Avatar name={r.name} photo={r.photo} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium text-white">{r.name}</p>
                  <p className="text-[11px] text-[#9c9c9c]">{r.date}</p>
                </div>
                <Stars value={r.rating} className="h-3.5 w-3.5" />
              </div>
              <p className="text-[13px] leading-relaxed text-[#cfcfcf]">{r.content}</p>
            </li>
          ))}
        </ul>
      )}

      {reviews.length > 4 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-5 rounded-full border border-white/15 px-5 py-2.5 text-[13px] text-[#ededed] transition-colors hover:bg-white/5"
        >
          {showAll ? 'Show fewer reviews' : `Show all ${reviews.length} reviews`}
        </button>
      )}
    </div>
  );
}