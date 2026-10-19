"use client";

import { useEffect, useState } from "react";
import { Play, X } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "motion/react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoSrc?: string;
}

export function VideoModal({ isOpen, onClose, title, videoSrc }: VideoModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 bg-neutral-950/80">
              <span className="text-sm font-bold text-white tracking-wide truncate pr-4">
                {title}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close video"
                className="inline-flex size-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 active:scale-95"
              >
                <X weight="bold" className="size-4" />
              </button>
            </div>

            {/* Video Frame */}
            <div className="relative aspect-video w-full bg-black">
              {videoSrc ? (
                <iframe
                  src={videoSrc}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center text-white/70">
                  <div className="flex size-14 items-center justify-center rounded-full bg-accent/20 border border-accent/40 text-accent">
                    <Play weight="fill" className="size-6 ml-0.5" />
                  </div>
                  <p className="text-base font-semibold text-white">{title}</p>
                  <p className="max-w-md text-xs text-neutral-400">
                    Live keynote and strategy session archive. Preview recording available on consultation request.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
