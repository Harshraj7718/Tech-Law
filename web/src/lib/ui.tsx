export const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const Search = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const Download = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M12 4v12M6 11l6 6 6-6M4 20h16" /></svg>
);

/** Renders text as masked words so GSAP can slide each one up (.wm > span). */
export function Words({ text, em }: { text: string; em?: boolean }) {
  const words = text.split(/\s+/).filter(Boolean).map((w, i) => (
    <span key={i}><span className="wm"><span>{w}</span></span>{' '}</span>
  ));
  return em ? <em>{words}</em> : <>{words}</>;
}

/** Splits text into per-character spans (words stay unbroken) so GSAP can stagger letters. */
export function Chars({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span key={i} className="cw">{Array.from(w).map((c, j) => <span key={j} className="ch">{c}</span>)}</span>
      ))}
    </>
  );
}
