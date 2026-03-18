"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

/* ───────── Confetti Particle ───────── */
function ConfettiPiece({ delay, left, color, size }: { delay: number; left: string; color: string; size: number }) {
  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left,
        top: "-5vh",
        width: size,
        height: size * 0.4,
        background: color,
        borderRadius: 2,
        animation: `confetti-fall ${4 + Math.random() * 4}s linear ${delay}s infinite`,
      }}
    />
  );
}

/* ───────── Floating Sparkle ───────── */
function Sparkle({ top, left, delay, size }: { top: string; left: string; delay: number; size: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ top, left }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z"
          fill="#ffd700"
        />
      </svg>
    </motion.div>
  );
}

/* ───────── Scrolling Banner ───────── */
function ScrollingBanner({ text, direction = "left", speed = "normal" }: { text: string; direction?: "left" | "right"; speed?: "normal" | "fast" }) {
  const repeated = Array(12).fill(text).join(" ★ ");
  return (
    <div className="overflow-hidden whitespace-nowrap py-3 bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 font-black text-black text-lg tracking-widest uppercase select-none">
      <div className={direction === "left" ? "animate-scroll-left" : "animate-scroll-right"} style={{ animationDuration: speed === "fast" ? "12s" : "20s" }}>
        <span className="inline-block pr-8">{repeated}</span>
        <span className="inline-block pr-8">{repeated}</span>
      </div>
    </div>
  );
}

/* ───────── Animated Counter ───────── */
function AnimatedCounter({ target, label }: { target: number; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [started, target]);

  return (
    <div ref={ref} className="text-center">
      <motion.div
        className="text-5xl md:text-7xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent"
        animate={started ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, delay: 2 }}
      >
        {count}%
      </motion.div>
      <p className="text-sm md:text-base mt-2 text-blue-200 uppercase tracking-widest font-semibold">{label}</p>
    </div>
  );
}

/* ───────── Main Page ───────── */
export default function Home() {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const confettiColors = ["#ffd700", "#ff2d95", "#00b4ff", "#ff6b35", "#00ff88", "#8b00ff", "#ff0000", "#00ffff"];

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ===== CONFETTI RAIN ===== */}
      {mounted && confettiColors.map((color, i) =>
        Array.from({ length: 4 }).map((_, j) => (
          <ConfettiPiece
            key={`${i}-${j}`}
            delay={Math.random() * 5}
            left={`${Math.random() * 100}%`}
            color={color}
            size={8 + Math.random() * 8}
          />
        ))
      )}

      {/* ===== TOP SCROLLING BANNER ===== */}
      <ScrollingBanner text="VOTE STEF" direction="left" speed="fast" />
      <ScrollingBanner text="YOUR VOICE MATTERS" direction="right" />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 animate-gradient-bg opacity-30"
          style={{
            background: "linear-gradient(135deg, #0a1628, #1a0a3e, #0a2848, #2a0a28, #0a1628)",
            y: backgroundY,
          }}
        />

        {/* Radial glow behind heading */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl" />

        {/* Sparkles */}
        {mounted && (
          <>
            <Sparkle top="10%" left="5%" delay={0} size={30} />
            <Sparkle top="20%" left="85%" delay={0.5} size={24} />
            <Sparkle top="60%" left="10%" delay={1} size={20} />
            <Sparkle top="40%" left="90%" delay={1.5} size={28} />
            <Sparkle top="75%" left="80%" delay={0.8} size={22} />
            <Sparkle top="15%" left="50%" delay={2} size={18} />
            <Sparkle top="85%" left="30%" delay={0.3} size={26} />
            <Sparkle top="50%" left="15%" delay={1.2} size={32} />
          </>
        )}

        {/* Rotating decorative ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] animate-spin-slow pointer-events-none">
          <div className="w-full h-full rounded-full border-2 border-dashed border-yellow-400/20" />
        </div>

        {/* Main heading */}
        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
          >
            <h1 className="text-7xl md:text-[10rem] font-black leading-none tracking-tighter animate-text-glow">
              VOTE
            </h1>
            <h1 className="text-8xl md:text-[12rem] font-black leading-none tracking-tighter bg-gradient-to-r from-yellow-300 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-pulse-ring">
              STEF
            </h1>
          </motion.div>

          <motion.p
            className="mt-6 text-xl md:text-3xl font-bold text-blue-200 tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            WORK COUNCIL CANDIDATE 2026
          </motion.p>

          {/* Glowing divider */}
          <motion.div
            className="mx-auto mt-8 h-1 rounded-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
            initial={{ width: 0 }}
            animate={{ width: "80%" }}
            transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
          />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1.5">
            <motion.div
              className="w-1.5 h-3 bg-yellow-400 rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ===== MIDDLE BANNER ===== */}
      <ScrollingBanner text="TOGETHER WE RISE" direction="left" />

      {/* ===== INTRO SECTION ===== */}
      <section className="relative py-24 px-6 md:px-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="relative p-8 md:p-12 rounded-2xl animate-box-glow bg-white/5 backdrop-blur-sm"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <motion.h2
              className="text-4xl md:text-6xl font-black mb-8 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              WHO IS STEF?
            </motion.h2>
            <motion.div
              className="text-lg md:text-xl leading-relaxed text-blue-100 space-y-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {/* ====== PLACEHOLDER — REPLACE WITH REAL INTRO ====== */}
              <p>
                <span className="text-yellow-400 font-bold text-2xl">&ldquo;</span>
                Intro text goes here. Tell the people who Stef is, what drives them, and why they&apos;re running for the Work Council. Make it personal, make it powerful.
                <span className="text-yellow-400 font-bold text-2xl">&rdquo;</span>
              </p>
              {/* ====== END PLACEHOLDER ====== */}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <AnimatedCounter target={100} label="Commitment" />
          <AnimatedCounter target={100} label="Dedication" />
          <AnimatedCounter target={100} label="Passion" />
          <AnimatedCounter target={0} label="Broken Promises" />
        </div>
      </section>

      {/* ===== MANIFESTO SECTION ===== */}
      <section className="relative py-24 px-6 md:px-16">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2
            className="text-5xl md:text-7xl font-black text-center mb-16 animate-text-glow"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
          >
            THE MANIFESTO
          </motion.h2>

          <div className="space-y-8">
            {/* ====== PLACEHOLDER — REPLACE WITH REAL MANIFESTO POINTS ====== */}
            {[
              { icon: "🔥", title: "Manifesto Point 1", text: "Replace this with the first key manifesto point." },
              { icon: "⚡", title: "Manifesto Point 2", text: "Replace this with the second key manifesto point." },
              { icon: "🌟", title: "Manifesto Point 3", text: "Replace this with the third key manifesto point." },
              { icon: "💪", title: "Manifesto Point 4", text: "Replace this with the fourth key manifesto point." },
              { icon: "🎯", title: "Manifesto Point 5", text: "Replace this with the fifth key manifesto point." },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex gap-6 items-start p-6 md:p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-yellow-400/50 transition-all duration-300 group"
                initial={{ opacity: 0, x: i % 2 === 0 ? -80 : 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, type: "spring" }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <span className="text-4xl md:text-5xl flex-shrink-0 group-hover:animate-bounce">{item.icon}</span>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-yellow-400 mb-2">{item.title}</h3>
                  <p className="text-blue-200 text-base md:text-lg leading-relaxed">{item.text}</p>
                </div>
              </motion.div>
            ))}
            {/* ====== END PLACEHOLDER ====== */}
          </div>
        </div>
      </section>

      {/* ===== CALL TO ACTION ===== */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        {/* Animated background circles */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {[300, 450, 600].map((size, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-yellow-400/20"
              style={{ width: size, height: size }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
            />
          ))}
        </motion.div>

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-8xl font-black mb-6 animate-text-glow">
            MAKE YOUR VOICE HEARD
          </h2>
          <p className="text-xl md:text-2xl text-blue-200 mb-12 max-w-2xl mx-auto">
            The future of our workplace starts with your vote. Stand with Stef.
          </p>

          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className="relative px-16 py-6 text-2xl md:text-3xl font-black rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-black uppercase tracking-widest cursor-default animate-rainbow-border"
            >
              <span className="relative z-10">VOTE STEF</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 blur-lg opacity-50" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== BOTTOM BANNERS ===== */}
      <ScrollingBanner text="THE PEOPLE'S CHOICE" direction="right" speed="fast" />
      <ScrollingBanner text="VOTE STEF — WORK COUNCIL 2026" direction="left" />

      {/* ===== FOOTER ===== */}
      <footer className="py-8 text-center text-sm text-blue-300/50 border-t border-white/5">
        <p>STEF FOR WORK COUNCIL 2026 — ALL RIGHTS RESERVED</p>
      </footer>

      {/* ===== SCANLINE OVERLAY (retro vibes) ===== */}
      <div
        className="fixed inset-0 pointer-events-none z-40 opacity-[0.03]"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
        }}
      />
    </main>
  );
}
