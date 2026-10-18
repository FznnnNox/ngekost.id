import React from 'react';
import { MapPin, Star } from 'lucide-react';

type Props = {
  title: string;
  location: string;
  rating: number;
  reviewsCount: number;
};

export default function ListingHeader({ title, location, rating, reviewsCount }: Props) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-4 text-[13px] text-[#9c9c9c]">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-[#cfcfcf]" />
          {location}
        </span>
        <span className="flex items-center gap-1 text-[#ededed]">
          <Star className="h-4 w-4 fill-[#f3c53b] text-[#f3c53b]" />
          {rating} ({reviewsCount} reviews)
        </span>
      </div>
    </div>
  );
}