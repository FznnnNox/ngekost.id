import React from 'react';
import { CalendarCheck, Eye, Footprints, ConciergeBell, Tag } from 'lucide-react';

/**
 * Komposit: kartu gelap (availability) + peta berbentuk "L".
 * Ukuran referensi: 276 x 364 px.
 * Tiga sudut pada peta (lihat "corner masks") dibuat dengan gradient radial
 * berwarna sama dengan background halaman (#121212).
 */
const PAGE_BG = '#121212';
const R = 24;

const hLines = Array.from({ length: 16 }, (_, i) => -110 + i * 38);
const vLines = Array.from({ length: 16 }, (_, i) => -170 + i * 46);

function TargetPin({ x, y, halo }: { x: number; y: number; halo?: string }) {
  return (
    <g>
      {halo && <circle cx={x} cy={y} r="13" fill={halo} opacity=".75" />}
      <circle cx={x} cy={y} r="8.2" fill="#161616" />
      <circle cx={x} cy={y} r="4.8" fill="#f3f3f1" />
      <circle cx={x} cy={y} r="2" fill="#161616" />
    </g>
  );
}

export default function AvailabilityCard() {
  return (
    <div className="relative h-full w-full">
      {/* ===== Peta ===== */}
      <div className="absolute inset-0 overflow-hidden bg-[#efefed]" style={{ borderRadius: R }}>
        <svg viewBox="0 0 276 364" className="h-full w-full" fill="none">
          {/* grid jalan (dirotasi) */}
          <g transform="rotate(32 138 182)" strokeLinecap="round">
            {hLines.map((y) => (
              <line key={`ho${y}`} x1="-320" x2="620" y1={y} y2={y} stroke="#d9d9d6" strokeWidth="6.4" />
            ))}
            {vLines.map((x) => (
              <line key={`vo${x}`} y1="-320" y2="620" x1={x} x2={x} stroke="#d9d9d6" strokeWidth="6.4" />
            ))}
            {hLines.map((y) => (
              <line key={`hi${y}`} x1="-320" x2="620" y1={y} y2={y} stroke="#fafaf8" strokeWidth="4.6" />
            ))}
            {vLines.map((x) => (
              <line key={`vi${x}`} y1="-320" y2="620" x1={x} x2={x} stroke="#fafaf8" strokeWidth="4.6" />
            ))}
          </g>

          {/* nama jalan */}
          <g fill="#aeaeab" fontSize="9" letterSpacing=".4">
            <text transform="translate(116 214) rotate(30)">College Ave</text>
            <text transform="translate(236 292) rotate(-62)">Library St</text>
            <text transform="translate(254 78) rotate(-58)">Market St</text>
          </g>

          {/* area label */}
          <g fill="#a9a9a6" fontSize="11" letterSpacing="2.2">
            <text x="22" y="289">CAMPUS</text>
            <text x="22" y="306">AREA</text>
          </g>

          {/* titik lokasi */}
          <TargetPin x={71.5} y={249.5} halo="#f7cfae" />
          <TargetPin x={242} y={242.5} />
          <TargetPin x={96} y={329} halo="#d9efc2" />

          {/* rute */}
          <polyline
            points="237,92 123,283.5 176,307"
            stroke="#161616"
            strokeWidth="2.6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* pin awal */}
          <circle cx="237" cy="92" r="9" fill="#161616" />
          <circle cx="237" cy="91" r="2.8" fill="#f3f3f1" />
          {/* pin akhir + bayangan */}
          <ellipse cx="176" cy="318" rx="7" ry="6" fill="#d2d2cf" />
          <circle cx="176" cy="307" r="7.6" fill="#161616" />
          <circle cx="176" cy="306.5" r="2.4" fill="#f3f3f1" />
        </svg>

        {/* Pill jarak */}
        <div className="absolute left-[178px] top-[10px] flex h-8 w-[84px] items-center justify-center gap-2 rounded-[10px] bg-[#1d1d1d] text-[12px] text-white">
          <Footprints className="h-4 w-4" strokeWidth={1.5} />
          5 min
        </div>
      </div>

      {/* ===== Corner masks (sudut cembung peta) ===== */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: 158,
          top: 0,
          width: R,
          height: R,
          background: `radial-gradient(circle at 100% 100%, transparent ${R - 0.5}px, ${PAGE_BG} ${R}px)`,
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          left: 0,
          top: 190,
          width: R,
          height: R,
          background: `radial-gradient(circle at 100% 100%, transparent ${R - 0.5}px, ${PAGE_BG} ${R}px)`,
        }}
      />

      {/* ===== Bingkai + kartu gelap ===== */}
      <div
        className="absolute left-0 top-0 h-[190px] w-[158px]"
        style={{ background: PAGE_BG, borderBottomRightRadius: 32 }}
      >
        <div className="relative h-[182px] w-[149px] bg-[#1d1d1d] text-white" style={{ borderRadius: R }}>
          {/* judul */}
          <div className="absolute left-5 top-[11px] text-[10px] leading-none text-[#d2d2d2]">Room Availability</div>

          {/* Row 1 */}
          <div className="absolute left-5 top-[31px] flex h-6 items-center gap-[9px]">
            <span className="flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[#f3e86b] text-black">
              <CalendarCheck className="h-[9px] w-[9px]" strokeWidth={2.2} />
            </span>
            <div className="leading-none">
              <div className="text-[13px] font-medium">Move in</div>
              <div className="mt-[3px] text-[7px] font-medium text-[#cfcfcf]">Nov 1, 09:00</div>
            </div>
          </div>

          {/* titik-titik penghubung */}
          <div className="absolute left-[27px] top-[56px] flex flex-col gap-[4px]">
            <span className="h-[2px] w-[2px] rounded-full bg-white" />
            <span className="h-[2px] w-[2px] rounded-full bg-white" />
            <span className="h-[2px] w-[2px] rounded-full bg-white" />
            <span className="h-[2px] w-[2px] rounded-full bg-white" />
          </div>

          {/* Row 2 */}
          <div className="absolute left-5 top-[81px] flex h-6 items-center gap-[9px]">
            <span className="flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[#b78cf3] text-black">
              <Eye className="h-[9px] w-[9px]" strokeWidth={2.2} />
            </span>
            <div className="leading-none">
              <div className="text-[13px] font-medium">Free Survey</div>
              <div className="mt-[3px] text-[7px] font-medium text-[#cfcfcf]">Nov 3, 16:00</div>
            </div>
          </div>

          {/* divider */}
          <div className="absolute left-[21px] right-[18px] top-[116px] h-px bg-white/25" />

          {/* stats */}
          <div className="absolute left-[21px] top-[129px]">
            <div className="flex items-center gap-[5px] text-[8px] leading-none text-[#d2d2d2]">
              <span className="flex h-[11px] w-[11px] items-center justify-center rounded-full bg-[#f0a35e] text-white">
                <ConciergeBell className="h-[7px] w-[7px]" strokeWidth={2.4} />
              </span>
              Listings
            </div>
            <div className="mt-[7px] text-[18px] font-bold leading-none">2K+</div>
          </div>

          <div className="absolute left-[86px] top-[129px]">
            <div className="flex items-center gap-[5px] text-[8px] leading-none text-[#d2d2d2]">
              <span className="flex h-[11px] w-[11px] items-center justify-center rounded-full bg-[#ee6b78] text-white">
                <Tag className="h-[7px] w-[7px]" strokeWidth={2.4} />
              </span>
              Price/mo
            </div>
            <div className="mt-[7px] text-[18px] font-bold leading-none">500K</div>
          </div>
        </div>
      </div>
    </div>
  );
}