import { useLayoutEffect, useRef } from 'react';
import { gsap, reduceMotion } from '../lib/motion';
import { useSectionMotion } from '../hooks/useSectionMotion';
import { Words } from '../lib/ui';

const CASES = [
  { cls: 'c1', n: '01', meta: ['UK · IN · Fintech', 'Pre-Series A'], title: 'How a UK–India fintech secured its proprietary algorithms before Series A.', cols: [['Challenge', 'Core risk-scoring code was written by contractors in two countries with no assignment terms — a red flag in investor due diligence.'], ['Strategy', 'Confirmatory IP assignments under Indian and English law, a trade-secret protocol for the model, and Class 9 and 36 filings through Madrid.'], ['Outcome', 'A clean chain of title delivered inside the diligence window. The round closed on schedule.']] },
  { cls: 'c2', n: '02', meta: ['IN · Consumer goods', 'Post-launch'], title: 'How a D2C skincare brand took its name back from marketplace copycats.', cols: [['Challenge', 'Lookalike listings using the brand’s mark appeared across three marketplaces within weeks of launch.'], ['Strategy', 'Expedited registration, coordinated platform takedowns and a cease-and-desist programme against repeat sellers.'], ['Outcome', 'Infringing listings removed, and a watch service that now flags conflicting filings before they publish.']] },
  { cls: 'c3', n: '03', meta: ['UK · Software & AI', 'Licensing deal'], title: 'How a generative-AI studio clarified who owns its model’s output before a UK licensing deal.', cols: [['Challenge', 'A UK licensee wanted ownership warranties over AI-generated assets that the studio could not yet give.'], ['Strategy', 'Mapped human authorship in the pipeline against s.9(3) CDPA, audited training-data licences and restructured the warranty package.'], ['Outcome', 'Warranties the studio could stand behind, and a licence signed without price concessions.']] }
];

export default function Cases() {
  const root = useRef<HTMLElement>(null);
  useSectionMotion(root);

  // Earlier cards recede as the next one slides over them.
  useLayoutEffect(() => {
    if (reduceMotion()) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.case');
      cards.forEach((c, i) => {
        const next = cards[i + 1];
        if (next) gsap.to(c, { scale: 0.94, filter: 'brightness(0.45)', ease: 'none', scrollTrigger: { trigger: next, start: 'top 85%', end: 'top 25%', scrub: true } });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="sec dark cases" id="cases" ref={root}>
      <div className="tool-head" style={{ marginBottom: 0 }}>
        <div>
          <div className="eyebrow"><span>§ 04 &nbsp;Matters · anonymised</span></div>
          <h2 className="display h2"><Words text="Real problems." /><br /><Words text="Resolved." em /></h2>
        </div>
        <p className="lead" style={{ marginBottom: 8 }}>Client details are withheld. Each matter sets out the problem, the strategy and what it protected.</p>
      </div>
      <div className="stack">
        {CASES.map(c => (
          <article key={c.n} className={'case ' + c.cls}>
            <div className="case-top"><span>Matter {c.n}</span><span>{c.meta[0]}</span><span>{c.meta[1]}</span></div>
            <h3>{c.title}</h3>
            <div className="case-cols">{c.cols.map(([h, p]) => <div key={h}><h6>{h}</h6><p>{p}</p></div>)}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
