import { useEffect, useLayoutEffect, useState } from 'react';
import { RegionProvider } from './hooks/useRegion';
import { BookingProvider } from './hooks/useBooking';
import { ScrollTrigger, goTo } from './lib/motion';
import Gate from './components/Gate';
import Nav from './components/Nav';
import Hero from './components/Hero';
import { Credentials, Marquee, Statement } from './components/Intro';
import Practice from './components/Practice';
import Scales from './components/Scales';
import Evaluator from './components/Evaluator';
import Quiz from './components/Quiz';
import Cases from './components/Cases';
import Insights from './components/Insights';
import Process from './components/Process';
import Intake from './components/Intake';
import Consult from './components/Consult';
import Footer from './components/Footer';
import Effects from './components/Effects';
import LoadingOverlay from './components/LoadingOverlay';
import FloatingSignature from './components/FloatingSignature';

const KEY = 'gateOk';
const seen = () => { try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; } };

export default function App() {
  const [entered, setEntered] = useState(seen);
  const [loading, setLoading] = useState(true);

  // Lock scrolling behind the gate; re-measure pinned sections once it lifts.
  useLayoutEffect(() => {
    document.body.classList.toggle('locked', !entered || loading);
    if (entered && !loading) ScrollTrigger.refresh();
  }, [entered, loading]);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    // In-page anchors use the GSAP scroller so they respect the fixed header.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      const h = a?.getAttribute('href');
      if (!a || !h || h.length < 2) return;
      e.preventDefault();
      goTo(h);
    };
    document.addEventListener('click', onClick);
    return () => { window.removeEventListener('load', refresh); document.removeEventListener('click', onClick); };
  }, []);

  const enter = () => { try { sessionStorage.setItem(KEY, '1'); } catch { /* ignore */ } setEntered(true); };

  return (
    <RegionProvider>
      <BookingProvider>
        {loading && <LoadingOverlay onDone={() => setLoading(false)} />}
        {!entered && <Gate onEnter={enter} />}
        <Effects active={entered && !loading} />
        <FloatingSignature active={entered && !loading} />
        <Nav />
        <main id="top">
          <Hero go={entered && !loading} />
          <Credentials />
          <Marquee />
          <Statement />
          <Practice />
          <Scales />
          <Evaluator />
          <Quiz />
          <Cases />
          <Insights />
          <Process />
          <Intake />
          <Consult />
        </main>
        <Footer />
      </BookingProvider>
    </RegionProvider>
  );
}
