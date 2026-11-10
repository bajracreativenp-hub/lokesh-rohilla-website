"use client";

import { useEffect } from "react";
import { Play, X } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "motion/react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoSrc?: string;
}

function resolveVideoEmbed(raw?: string): { kind: "iframe" | "video" | "empty"; url: string } {
  if (!raw || !raw.trim()) return { kind: "empty", url: "" };
  const src = raw.trim();

  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(src) || src.startsWith("/media/")) {
    return { kind: "video", url: src };
  }

  try {
    const parsed = new URL(src, "https://lokeshrohilla.com");
    if (parsed.hostname.includes("youtube.com")) {
      const v = parsed.searchParams.get("v");
      if (v) return { kind: "iframe", url: `https://www.youtube.com/embed/${v}?autoplay=1` };
      const shortsMatch = parsed.pathname.match(/\/shorts\/([^/?]+)/);
      if (shortsMatch?.[1]) {
        return { kind: "iframe", url: `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1` };
      }
    }
    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.replace(/^\//, "");
      if (id) return { kind: "iframe", url: `https://www.youtube.com/embed/${id}?autoplay=1` };
    }
    if (parsed.hostname.includes("vimeo.com") && !parsed.hostname.includes("player.vimeo.com")) {
      const id = parsed.pathname.replace(/^\//, "").split("/")[0];
      if (id && /^\d+$/.test(id)) {
        return { kind: "iframe", url: `https://player.vimeo.com/video/${id}?autoplay=1` };
      }
    }
  } catch {
    // Keep original URL if parsing fails
  }

  return { kind: "iframe", url: src };
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

  const resolved = resolveVideoEmbed(videoSrc);

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
              {resolved.kind === "video" ? (
                <video
                  src={resolved.url}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full object-contain"
                />
              ) : resolved.kind === "iframe" ? (
                <iframe
                  src={resolved.url}
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
                    Live keynote and strategy session archive. Add a YouTube, Vimeo, or MP4 video URL in Admin → Appearance &amp; Landing Page to stream directly.
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
