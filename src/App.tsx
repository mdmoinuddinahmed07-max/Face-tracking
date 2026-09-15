import { useEffect, useRef, useState } from 'react';
import { useTypewriter } from '@/hooks/useTypewriter';

const NAV_LINKS = ['Labs', 'Studio', 'Openings', 'Shop'];
const PILL_LABELS = [
  'Pitch us an idea',
  'Come work here',
  'Send a brief hello',
  'See how we operate',
];
const EMAIL = 'hello@mainframe.co';
const SENSITIVITY = 0.8;

function CopyIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <rect x="3.5" y="3.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1" />
      <rect x="2.5" y="2.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="flex flex-col gap-[5px]">
      <span
        className="block w-6 h-[2px] bg-black transition-transform duration-300"
        style={{
          transform: open ? 'rotate(45deg) translateY(7px)' : 'none',
        }}
      />
      <span
        className="block w-6 h-[2px] bg-black transition-opacity duration-300"
        style={{ opacity: open ? 0 : 1 }}
      />
      <span
        className="block w-6 h-[2px] bg-black transition-transform duration-300"
        style={{
          transform: open ? 'rotate(-45deg) translateY(-7px)' : 'none',
        }}
      />
    </div>
  );
}

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const prevXRef = useRef<number | null>(null);
  const seekingRef = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const { displayed, done } = useTypewriter({
    text: 'Glad you stopped in. Good taste tends to find us. Now, what are we building?',
  });

  useEffect(() => {
    const timer = setTimeout(() => setPillsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const video = videoRef.current;
      if (!video || !video.duration || isNaN(video.duration)) return;

      const currentX = e.clientX;
      const prevX = prevXRef.current;

      if (prevX === null) {
        prevXRef.current = currentX;
        return;
      }

      const delta = currentX - prevX;
      prevXRef.current = currentX;

      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      targetTimeRef.current = Math.max(
        0,
        Math.min(video.duration, targetTimeRef.current + timeOffset)
      );

      if (!seekingRef.current) {
        seekingRef.current = true;
        video.currentTime = targetTimeRef.current;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSeeked = () => {
    const video = videoRef.current;
    if (!video) return;

    const diff = Math.abs(video.currentTime - targetTimeRef.current);
    if (diff > 0.05) {
      video.currentTime = targetTimeRef.current;
    } else {
      seekingRef.current = false;
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background video */}
      <video
        ref={videoRef}
        src="/WhatsApp_Video_2026-09-01_at_10.33.35_PM.mp4"
        muted
        playsInline
        preload="auto"
        onSeeked={handleSeeked}
        className="fixed inset-0 w-full h-full object-cover"
        style={{ zIndex: 0, objectPosition: '70% center' }}
      />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center" style={{ zIndex: 10 }}>
        {/* Logo */}
        <div className="flex flex-row gap-3 items-center">
          <span
            className="text-[21px] sm:text-[26px] tracking-tight text-black"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Mainframe&reg;
          </span>
          <span
            className="text-[25px] sm:text-[30px] text-black select-none"
            style={{ letterSpacing: '-0.02em' }}
          >
            ✳︎
          </span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex flex-row text-[23px] text-black">
          {NAV_LINKS.map((link, i) => (
            <span key={link}>
              <a href="#" className="hover:opacity-60 transition-opacity">{link}</a>
              {i < NAV_LINKS.length - 1 && <span>, </span>}
            </span>
          ))}
        </div>

        {/* Desktop CTA */}
        <a
          href="#"
          className="hidden md:block text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Get in touch
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <HamburgerIcon open={menuOpen} />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className="md:hidden fixed inset-0 bg-white/95 backdrop-blur-sm flex flex-col justify-center items-start px-8 gap-8 transition-opacity duration-300"
        style={{
          zIndex: 9,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href="#"
            className="text-[32px] font-medium text-black hover:opacity-60 transition-opacity"
            onClick={() => setMenuOpen(false)}
          >
            {link}
          </a>
        ))}
        <a
          href="#"
          className="text-[32px] font-medium text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
          onClick={() => setMenuOpen(false)}
        >
          Get in touch
        </a>
      </div>

      {/* Hero section */}
      <section
        className="h-screen flex flex-col justify-end md:justify-center md:pb-0 pb-12 px-5 sm:px-8 md:px-10 overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <div className="max-w-xl relative z-10">
          {/* Blurred intro label */}
          <div
            className="pointer-events-none select-none mb-5 sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: '1.3',
              fontWeight: 400,
              color: '#000',
              filter: 'blur(4px)',
            }}
          >
            Hey there, meet A.R.I.A,
            <br />
            Mainframe's Adaptive Response Interface Agent
          </div>

          {/* Typewriter text */}
          <p
            className="text-black mb-5 sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: '1.35',
              fontWeight: 400,
              minHeight: '54px',
            }}
          >
            {displayed}
            {!done && (
              <span
                className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px]"
                style={{ animation: 'blink 1s step-end infinite' }}
              />
            )}
          </p>

          {/* Action pill buttons */}
          <div
            className="flex flex-wrap gap-y-1"
            style={{
              opacity: pillsVisible ? 1 : 0,
              transform: pillsVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            {PILL_LABELS.map((label) => (
              <button
                key={label}
                className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] hover:bg-black hover:text-white transition-colors duration-200"
                style={{ whiteSpace: 'nowrap' }}
              >
                {label}
              </button>
            ))}
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center justify-center gap-2 sm:gap-3 text-white bg-transparent border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] hover:bg-white hover:text-black transition-colors duration-200"
              style={{ whiteSpace: 'nowrap' }}
            >
              <span>
                Reach us: <span className="underline underline-offset-1">{copied ? 'Copied!' : EMAIL}</span>
              </span>
              <CopyIcon />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
