import React from 'react';
import { Home, Layers, Maximize2, Minus, Plus } from 'lucide-react';

type Props = {
  zoneOn: boolean;
  onFullscreen: () => void;
  onToggleZone: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRecenter: () => void;
};

const btn =
  'flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#111] shadow-md ring-1 ring-black/5 transition-colors hover:bg-[#f3f3f1]';

/** Tombol kontrol di kanan peta: layar penuh, zona, zoom, kembali ke kampus */
export default function MapControls({ zoneOn, onFullscreen, onToggleZone, onZoomIn, onZoomOut, onRecenter }: Props) {
  return (
    <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-3">
      <button type="button" onClick={onFullscreen} aria-label="Toggle fullscreen" className={btn}>
        <Maximize2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onToggleZone}
        aria-pressed={zoneOn}
        aria-label={zoneOn ? 'Hide campus zone' : 'Show campus zone'}
        className={`${btn} ${zoneOn ? 'ring-2 ring-[#0f7b62]' : ''}`}
      >
        <Layers className="h-4 w-4" />
      </button>
      <div className="flex flex-col overflow-hidden rounded-full bg-white shadow-md ring-1 ring-black/5">
        <button type="button" onClick={onZoomIn} aria-label="Zoom in" className="flex h-11 w-11 items-center justify-center hover:bg-[#f3f3f1]">
          <Plus className="h-4 w-4" />
        </button>
        <button type="button" onClick={onZoomOut} aria-label="Zoom out" className="flex h-11 w-11 items-center justify-center border-t border-black/5 hover:bg-[#f3f3f1]">
          <Minus className="h-4 w-4" />
        </button>
      </div>
      <button
        type="button"
        onClick={onRecenter}
        aria-label="Back to campus"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0f7b62] text-white shadow-lg transition-colors hover:bg-[#0c6a54]"
      >
        <Home className="h-5 w-5" />
      </button>
    </div>
  );
}