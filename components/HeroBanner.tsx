"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Truck, ShieldCheck, RotateCcw, ArrowDown } from "lucide-react";
import HBimg1 from "../public/img/HB_img1.png";
import HBimg2 from "../public/img/HB_img2.png";
import HBimg3 from "../public/img/HB_img3.png";
import HBimg4 from "../public/img/HB_img4.png";
import HBimg5 from "../public/img/HB_img5.png";

const images = [HBimg1, HBimg2, HBimg3, HBimg4, HBimg5];

export function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const scrollToProducts = () => {
    const catalog =
      document.getElementById("products") || document.getElementById("catalog");
    if (catalog) {
      catalog.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 600, behavior: "smooth" });
    }
  };

  return (
    <div className="mb-8 w-full space-y-3">
      <div className="relative overflow-hidden rounded-[5px] border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="space-y-4 text-center sm:text-left lg:col-span-6">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
              Featured Products
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-6xl">
              Tech & Workstation Gear
            </h1>
            <p className="max-w-md text-xs leading-relaxed text-zinc-400 sm:text-sm">
              High-performance hardware, accessories, and minimalist desktop
              setup essentials engineered for daily workflow.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={scrollToProducts}
                className="inline-flex items-center cursor-pointer gap-2 rounded-[5px] border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 font-mono text-xs font-medium text-emerald-400 transition-all hover:bg-emerald-500/20 active:scale-95"
              >
                <span>Start shopping</span>
                <ArrowDown size={13} />
              </button>
            </div>
          </div>

          <div className="relative flex flex-col items-center justify-center lg:col-span-6">
            <div className="absolute h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            <div className="relative h-72 w-full sm:h-96 shrink-0">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
                    index === currentIndex
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Product Showcase ${index + 1}`}
                    fill
                    className="object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)]"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            <div className="relative z-10 mt-2 flex items-center gap-3">
              <span className="font-mono text-[10px] text-zinc-500">
                0{currentIndex + 1} / 0{images.length}
              </span>
              <div className="flex gap-1.5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-6 bg-emerald-400"
                        : "w-2 bg-zinc-700 hover:bg-zinc-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 rounded-[5px] border border-zinc-800/80 bg-zinc-900/20 p-3.5 sm:grid-cols-3">
        <div className="flex items-center gap-3 px-3 py-1.5">
          <Truck size={16} className="text-emerald-400 shrink-0" />
          <span className="font-mono text-xs text-zinc-300">
            Fast Express Shipping
          </span>
        </div>
        <div className="flex items-center gap-3 px-3 py-1.5 border-t sm:border-t-0 sm:border-l border-zinc-800/80">
          <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
          <span className="font-mono text-xs text-zinc-300">
            Verified Authentic Items
          </span>
        </div>
        <div className="flex items-center gap-3 px-3 py-1.5 border-t sm:border-t-0 sm:border-l border-zinc-800/80">
          <RotateCcw size={16} className="text-emerald-400 shrink-0" />
          <span className="font-mono text-xs text-zinc-300">
            30-Day Returns
          </span>
        </div>
      </div>
    </div>
  );
}
