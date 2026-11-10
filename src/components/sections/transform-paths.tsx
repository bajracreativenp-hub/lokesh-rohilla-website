import { Container, SectionHeading } from "@/components/ui/layout";
import { SerifText } from "@/components/ui/serif-text";
import { PathSelector } from "@/components/sections/path-selector";
import { transformPaths } from "@/lib/content";

/**
 * SECTION 5 - WHAT I HELP TRANSFORM
 *
 * Heading stays a Server Component; only the interactive selector is a client
 * leaf. The visitor picks by naming their own situation, and the destination
 * organisation is the last thing they read, not the heading. That ordering is
 * the whole point: Lokesh is the entry point, the organisations are where a path
 * ends up.
 *
 * This replaced the former "The Work I've Built" section. Business Doctor and
 * The Bookwishes Club are reached through these three paths, through the
 * initiative rail in section 2, and through the footer.
 */
export function TransformPaths({
  pathImages,
}: {
  pathImages?: [string | undefined, string | undefined, string | undefined];
} = {}) {
  const customPaths = transformPaths.paths.map((path, index) => {
    const customSrc = pathImages?.[index];
    if (!customSrc) return path;
    return {
      ...path,
      image: {
        ...path.image,
        src: customSrc,
      },
    };
  });

  return (
    <section>
      <Container className="section-y">
        <SectionHeading
          eyebrow={transformPaths.eyebrow}
          headline={<SerifText text={transformPaths.headline} />}
          lede={transformPaths.lede}
          size="lg"
        />

        <PathSelector paths={customPaths} />
      </Container>
    </section>
  );
}
