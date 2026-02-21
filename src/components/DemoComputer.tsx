import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface DemoComputerProps {
  texture: string;
}

const DemoComputer = ({ texture }: DemoComputerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { rotateY: 90 },
        { rotateY: 0, duration: 1, ease: 'power3.out' },
      );
    }
  }, [texture]);

  return (
    <div className="flex items-center justify-center h-full [perspective:800px]">
      <div
        ref={containerRef}
        className="flex flex-col items-center [transform-style:preserve-3d]"
      >
        {/* Monitor */}
        <div className="relative rounded-xl p-[3px] bg-gradient-to-b from-[#c0c0c8] via-[#a8a8b0] to-[#8e8e96] shadow-2xl shadow-black/60">
          <div className="bg-[#1c1c1c] rounded-[10px] p-2">
            <div className="w-[280px] h-[175px] sm:w-[360px] sm:h-[225px] rounded-md overflow-hidden bg-black">
              <video
                key={texture}
                src={texture}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#3a3a3a] ring-1 ring-[#555]" />
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-[#b0b0b8]" />
        </div>

        {/* Stand */}
        <div className="w-6 h-6 bg-gradient-to-b from-[#b0b0b8] to-[#909098]" />
        <div className="w-24 h-[5px] rounded-full bg-gradient-to-b from-[#b0b0b8] to-[#808088] shadow-md shadow-black/30" />

        {/* Keyboard */}
        <div className="mt-3 rounded-lg p-2.5 w-[260px] sm:w-[340px] bg-gradient-to-b from-[#c0c0c8] to-[#a0a0a8] shadow-lg shadow-black/30">
          <div className="flex flex-col gap-[3px]">
            {[12, 11, 10, 8].map((keys, row) => (
              <div key={row} className="flex gap-[2px] justify-center">
                {Array.from({ length: keys }).map((_, i) => (
                  <div key={i} className="h-[10px] flex-1 bg-[#2a2a30] rounded-[2px] shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]" />
                ))}
              </div>
            ))}
            <div className="flex gap-[2px] justify-center">
              <div className="h-[10px] w-10 bg-[#2a2a30] rounded-[2px] shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]" />
              <div className="h-[10px] flex-[3] bg-[#2a2a30] rounded-[2px] shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]" />
              <div className="h-[10px] w-10 bg-[#2a2a30] rounded-[2px] shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoComputer;
