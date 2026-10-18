import React from "react";
import { Asterisk } from "lucide-react";

const img =
  "h-full w-full object-cover transition-transform duration-500 hover:scale-105";

export default function ImageGallery() {
  return (
    <div className="relative h-[464px] w-[356px]">
      <div
        className="absolute left-0 top-0 h-[264px] w-[188px] overflow-hidden"
        style={{ borderRadius: "85px 4px 80px 4px" }}
      >
        <img src="/assets/image01.png" alt="Kost exterior" className={img} />
      </div>

      <div
        className="absolute left-[198px] top-[39px] h-[150px] w-[147px] overflow-hidden"
        style={{ borderRadius: "50% 50% 50% 6px" }}
      >
        <img
          src="/assets/image02.png"
          alt="Kost room interior"
          className={img}
        />
      </div>

      <div
        className="absolute left-[11px] top-[275px] h-[148px] w-[148px] overflow-hidden"
        style={{ borderRadius: "50% 6px 50% 50%" }}
      >
        <img
          src="/assets/image04.png"
          alt="Kost lounge by the window"
          className={img}
        />
      </div>

      <div
        className="absolute left-[168px] top-[200px] h-[264px] w-[188px] overflow-hidden"
        style={{ borderRadius: "80px 4px 4px 24px" }}
      >
        <img
          src="/assets/image03.png"
          alt="Modern kost building"
          className={img}
        />
      </div>
    </div>
  );
}
