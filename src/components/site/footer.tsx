import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";
import { PENDING } from "@/lib/content";
import { footerGroups } from "@/lib/site";

/**
 * Dark band footer, a near-black closing section. The
 * band class repaints the subtree through the semantic custom properties, so no
 * element needs a dark variant.
 */
export function Footer() {
  return (
    <footer className="band-dark">
      <Container className="section-y">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-md flex-col gap-5">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-white text-[0.8125rem] font-extrabold text-canvas"
              >
                LR
              </span>
              <span className="text-[0.9375rem] font-extrabold">Lokesh Rohilla</span>
            </div>
            <p className="text-sm leading-relaxed text-ink-muted">
              Business Consultant, Mentor, Transformation Leader. Helping businesses,
              leaders and individuals turn complexity into systems that hold.
            </p>
            <ButtonLink href="/contact" variant="primary" size="md">
              Work With Lokesh
            </ButtonLink>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <nav key={group.label} aria-label={`Footer ${group.label}`}>
                <p className="eyebrow mb-4">{group.label}</p>
                <ul className="flex flex-col gap-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-ink-muted transition-colors duration-200 ease-brand hover:text-accent"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 rounded-card bg-surface px-5 py-4">
          <p className="text-xs text-ink-muted">
            <span className="eyebrow mr-2">Pending</span>
            {PENDING.contact}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-hairline pt-8 text-xs text-ink-muted md:flex-row md:items-center md:justify-between">
          <p>Lokesh Rohilla. Business Doctor and The Bookwishes Club are his work.</p>
          <p>Built as a personal brand first.</p>
        </div>
      </Container>
    </footer>
  );
}
