import React from "react";
import AvailabilityCard from "@/components/hero/AvailabilityCard";
import AmenitiesCard from "@/components/hero/AmenitiesCard";
import { BookNowCard, SuggestionCard } from "@/components/hero/ActionWidgets";
import ImageGallery from "@/components/hero/ImageGallery";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="min-h-screen overflow-x-hidden bg-[#121212] px-4 pb-12 font-sans text-[#ededed] selection:bg-white selection:text-black sm:px-8 lg:pb-0"
    >
      <div className="relative mx-auto flex w-full max-w-[720px] flex-col gap-6 lg:block lg:h-[780px] lg:w-[1050px] lg:max-w-none lg:gap-0 min-[1024px]:[zoom:0.88] min-[1130px]:[zoom:1] min-[1400px]:[zoom:1.15] min-[1700px]:[zoom:1.3] min-[2000px]:[zoom:1.5]">
        <div className="lg:absolute lg:left-0 lg:top-[118px]">
          <h2 className="text-[clamp(36px,9vw,56px)] font-light leading-none text-[#ededed]">
            Find Your
          </h2>
          <h1 className="mt-[14px] text-[clamp(52px,15vw,108px)] font-normal uppercase leading-none tracking-[-0.01em] text-[#ededed] lg:mt-[18px]">
            Kosan
          </h1>
        </div>

        <div className="mx-auto w-[356px] max-[392px]:[zoom:0.92] max-[359px]:[zoom:0.8] lg:absolute lg:left-[694px] lg:top-[33px] lg:mx-0">
          <ImageGallery />
        </div>

        <p className="max-w-md text-[14px] font-light leading-[1.6] text-[#9c9c9c] lg:absolute lg:left-[300px] lg:top-[358px] lg:w-[260px] lg:text-[13px]">
          Ngekost.id helps students and young professionals find verified
          boarding houses near campuses and offices, with prices and facilities
          side by side.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:contents">
          <div className="h-[364px] w-[276px] justify-self-center lg:absolute lg:left-0 lg:top-[362px]">
            <AvailabilityCard />
          </div>

          <div className="h-[262px] w-full max-w-[360px] justify-self-center lg:absolute lg:left-[286px] lg:top-[471px] lg:w-[276px] lg:max-w-none">
            <AmenitiesCard />
          </div>

          <div className="h-auto w-full max-w-[360px] justify-center flex items-center lg:absolute lg:left-[570px] lg:top-[608px] lg:w-[297px] lg:max-w-none">
            <BookNowCard />
          </div>

          <div className="h-[80px] w-full max-w-[360px] justify-self-center lg:absolute lg:left-[876px] lg:top-[650px] lg:w-[174px] lg:max-w-none">
            <SuggestionCard />
          </div>
        </div>
      </div>
    </section>
  );
}
