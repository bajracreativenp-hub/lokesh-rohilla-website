import { Fragment } from "react";

/**
 * SERIF LETTERS INSIDE A SANS HEADING
 *
 * Single letters inside a heading are swapped for a serif italic, so "Collaborate"
 * is set with a serif "a", "Hire" with a serif "r", "one" with a serif "n".
 *
 * Read at a glance the heading looks like one consistent sans. Look closely and
 * the wordforms disagree with each other, which is what makes it read as
 * considered rather than defaulted. It is the most recognisable thing about this
 * direction and it costs one utility.
 *
 * MARKUP, NOT MAGIC
 *
 * Letters are marked with `|` in the source string: `"Tu|rning"`. The alternative,
 * hand writing a `<span>` around every letter in the JSX, was tried and it is
 * unreadable: a two line headline becomes twenty lines of markup, and nobody can
 * tell at a glance which letters are meant to be swapped. A delimiter keeps the
 * headline readable as a sentence in the source, which is the thing a writer
 * actually edits.
 *
 * ONLY THE SERIF LETTER IS WRAPPED. Everything else stays a bare text node.
 * Wrapping every fragment in a span would let some screen readers insert a space
 * at each boundary and read "Tu r ning" as three words, which would be a real
 * regression in exchange for tidier code. A single span around a single letter
 * does not break the word for any reader.
 */
export function SerifText({ text }: { text: string }) {
  const parts = text.split("|");

  // No markers, or markers at the edges: return the string untouched rather than
  // splitting it for nothing.
  if (parts.length === 1) return <>{text}</>;

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="serif-letter">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}