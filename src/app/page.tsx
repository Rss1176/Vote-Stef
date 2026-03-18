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
function Sparkle({ top, left, delay, size, color = "#00b4d8" }: { top: string; left: string; delay: number; size: number; color?: string }) {
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
        duration: 2.5,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z"
          fill={color}
          fillOpacity={0.8}
        />
      </svg>
    </motion.div>
  );
}

/* ───────── Scrolling Banner ───────── */
function ScrollingBanner({ text, direction = "left", speed = "normal", variant = "orange" }: { text: string; direction?: "left" | "right"; speed?: "normal" | "fast"; variant?: "orange" | "blue" }) {
  const repeated = Array(12).fill(text).join(" ★ ");
  const bg = variant === "orange"
    ? "bg-gradient-to-r from-[#ff6b2b] via-[#ff9a5c] to-[#ff6b2b]"
    : "bg-gradient-to-r from-[#00b4d8] via-[#48cae4] to-[#00b4d8]";
  const textColor = variant === "orange" ? "text-white" : "text-[#0d1b2a]";
  return (
    <div className={`overflow-hidden whitespace-nowrap py-3 ${bg} font-black ${textColor} text-lg tracking-widest uppercase select-none`}>
      <div className={direction === "left" ? "animate-scroll-left" : "animate-scroll-right"} style={{ animationDuration: speed === "fast" ? "12s" : "20s" }}>
        <span className="inline-block pr-8">{repeated}</span>
        <span className="inline-block pr-8">{repeated}</span>
      </div>
    </div>
  );
}

/* ───────── Animated Counter ───────── */
function AnimatedCounter({ target, label, suffix = "%" }: { target: number; label: string; suffix?: string }) {
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
        className="text-5xl md:text-7xl font-black bg-gradient-to-r from-[#ff6b2b] via-[#ff9a5c] to-[#00b4d8] bg-clip-text text-transparent"
        animate={started ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, delay: 2 }}
      >
        {count}{suffix}
      </motion.div>
      <p className="text-sm md:text-base mt-2 text-[#90e0ef] uppercase tracking-widest font-semibold">{label}</p>
    </div>
  );
}

/* ───────── Value Card ───────── */
function ValueCard({ icon, title, text, index }: { icon: string; title: string; text: string; index: number }) {
  return (
    <motion.div
      className="relative flex gap-6 items-start p-6 md:p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-[#00b4d8]/20 hover:border-[#ff6b2b]/60 transition-all duration-500 group overflow-hidden"
      initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6, type: "spring" }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div
          className="absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          style={{ animation: "shine 2s ease-in-out infinite" }}
        />
      </div>

      <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-[#ff6b2b] to-[#00b4d8] flex items-center justify-center text-2xl md:text-3xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/20">
        {icon}
      </div>
      <div>
        <h3 className="text-xl md:text-2xl font-black text-white mb-2 tracking-wide uppercase">{title}</h3>
        <p className="text-[#90e0ef] text-base md:text-lg leading-relaxed">{text}</p>
      </div>
    </motion.div>
  );
}

/* ───────── Main Page ───────── */
export default function Home() {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const confettiColors = ["#ff6b2b", "#ff9a5c", "#00b4d8", "#48cae4", "#90e0ef", "#d4520f", "#ffa07a", "#00d4ff"];

  const values = [
    {
      icon: "🤝",
      title: "Trust",
      text: "I believe the Works Council should be something people actually feel — not just a structure that exists in the background. It means creating genuine confidence that when you raise a concern, it goes somewhere.",
    },
    {
      icon: "🔍",
      title: "Transparency",
      text: "That starts with better communication and visibility, so that every employee knows what the council is doing and why it matters. No more conversations that go in circles — a firm focus on outcomes.",
    },
    {
      icon: "🌐",
      title: "Collaboration",
      text: "I'm committed to active listening across all groups — employees, academics, managers, remote workers, and on-site teams. I want to act as a bridge between long-standing colleagues and those newer to DXC. Both matter. Both deserve a seat at the table.",
    },
    {
      icon: "📢",
      title: "Advocacy",
      text: "I want to be a proactive advocate for the workforce, not someone who waits for problems to land on their desk. Your voice deserves to be heard before it becomes a complaint.",
    },
    {
      icon: "💙",
      title: "Empathy",
      text: "I lead with honesty and empathy — I'm not someone who tells people what they want to hear, but I'll always make sure they feel heard. That's the kind of representation I want to bring to the Works Council.",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ===== CONFETTI RAIN ===== */}
      {mounted && confettiColors.map((color, i) =>
        Array.from({ length: 3 }).map((_, j) => (
          <ConfettiPiece
            key={`${i}-${j}`}
            delay={Math.random() * 6}
            left={`${Math.random() * 100}%`}
            color={color}
            size={6 + Math.random() * 8}
          />
        ))
      )}

      {/* ===== TOP SCROLLING BANNERS ===== */}
      <ScrollingBanner text="VOTE STEF" direction="left" speed="fast" variant="orange" />
      <ScrollingBanner text="TRUST · TRANSPARENCY · COLLABORATION · ADVOCACY · EMPATHY" direction="right" variant="blue" />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 animate-gradient-bg opacity-40"
          style={{
            background: "linear-gradient(135deg, #0d1b2a, #1b2838, #0d1b2a, #162030, #0d1b2a)",
            y: backgroundY,
          }}
        />

        {/* Large radial glow — orange */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-15"
          style={{ background: "radial-gradient(circle, rgba(255,107,43,0.6) 0%, transparent 70%)" }}
        />
        {/* Large radial glow — blue */}
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-15"
          style={{ background: "radial-gradient(circle, rgba(0,180,216,0.6) 0%, transparent 70%)" }}
        />

        {/* Sparkles */}
        {mounted && (
          <>
            <Sparkle top="10%" left="5%" delay={0} size={30} color="#ff6b2b" />
            <Sparkle top="20%" left="88%" delay={0.5} size={24} color="#00b4d8" />
            <Sparkle top="60%" left="8%" delay={1} size={20} color="#48cae4" />
            <Sparkle top="40%" left="92%" delay={1.5} size={28} color="#ff9a5c" />
            <Sparkle top="75%" left="82%" delay={0.8} size={22} color="#00b4d8" />
            <Sparkle top="15%" left="50%" delay={2} size={18} color="#ff6b2b" />
            <Sparkle top="85%" left="25%" delay={0.3} size={26} color="#48cae4" />
            <Sparkle top="50%" left="12%" delay={1.2} size={32} color="#ff9a5c" />
          </>
        )}

        {/* Rotating decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] animate-spin-slow pointer-events-none">
          <div className="w-full h-full rounded-full border-2 border-dashed border-[#ff6b2b]/15" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[550px] md:h-[550px] pointer-events-none" style={{ animation: "spin-slow 30s linear infinite reverse" }}>
          <div className="w-full h-full rounded-full border border-dashed border-[#00b4d8]/10" />
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
            <h1 className="text-8xl md:text-[12rem] font-black leading-none tracking-tighter bg-gradient-to-r from-[#ff6b2b] via-[#ff9a5c] to-[#00b4d8] bg-clip-text text-transparent animate-pulse-ring">
              STEF
            </h1>
          </motion.div>

          <motion.p
            className="mt-6 text-xl md:text-3xl font-bold text-[#90e0ef] tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            DXC WORKS COUNCIL CANDIDATE
          </motion.p>

          <motion.p
            className="mt-2 text-base md:text-lg text-[#48cae4]/60 tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            Stefano Clemente
          </motion.p>

          {/* Glowing divider */}
          <motion.div
            className="mx-auto mt-8 h-1 rounded-full bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent"
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
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5">
            <motion.div
              className="w-1.5 h-3 bg-[#ff6b2b] rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ===== MIDDLE BANNER ===== */}
      <ScrollingBanner text="YOUR VOICE MATTERS" direction="left" variant="orange" />

      {/* ===== INTRO SECTION ===== */}
      <section className="relative py-24 px-6 md:px-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="relative p-8 md:p-12 rounded-2xl animate-box-glow bg-white/[0.03] backdrop-blur-sm border border-[#00b4d8]/20"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <motion.h2
              className="text-4xl md:text-6xl font-black mb-8 bg-gradient-to-r from-[#ff6b2b] via-[#ff9a5c] to-[#00b4d8] bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              MEET STEF
            </motion.h2>
            <motion.div
              className="text-lg md:text-xl leading-relaxed text-[#90e0ef]/90 space-y-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <p>
                <span className="text-[#ff6b2b] font-bold text-3xl leading-none">&ldquo;</span>
                My name is <span className="text-white font-bold">Stefano Clemente</span>. I&apos;ve spent <span className="text-white font-bold">10 years at DXC</span>, moving from Business Operations into people management — and that journey has helped me understand what people genuinely need from the organisation they work for. I now work within the <span className="text-white font-bold">UKI Academic Programme</span>, where HR, culture, and engagement aren&apos;t just buzzwords — they&apos;re the job. I&apos;m standing for the Works Council because I think I can make a real difference, and I&apos;d rather try than wonder.
                <span className="text-[#ff6b2b] font-bold text-3xl leading-none">&rdquo;</span>
              </p>
              <p>
                In my current role I work across the full breadth of the academic cohort — from graduates and apprentices through to managers — supporting people at every stage of their DXC journey. I invest a lot of time mentoring and coaching the people around me, which gives me a real sense of where people are thriving and where they need more support. I lead with honesty and empathy — I&apos;m not someone who tells people what they want to hear, but I&apos;ll always make sure they feel heard. That&apos;s the kind of representation I want to bring to the Works Council.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <AnimatedCounter target={10} label="Years at DXC" suffix="+" />
          <AnimatedCounter target={100} label="Commitment" />
          <AnimatedCounter target={100} label="Dedication" />
          <AnimatedCounter target={0} label="Broken Promises" />
        </div>
      </section>

      {/* ===== BANNER ===== */}
      <ScrollingBanner text="TOGETHER WE RISE" direction="right" speed="fast" variant="blue" />

      {/* ===== VALUES / MANIFESTO SECTION ===== */}
      <section className="relative py-24 px-6 md:px-16">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#ff6b2b]/8 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#00b4d8]/8 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2
            className="text-5xl md:text-7xl font-black text-center mb-6 animate-text-glow"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
          >
            THE MANIFESTO
          </motion.h2>

          <motion.p
            className="text-center text-[#90e0ef]/60 text-lg md:text-xl mb-16 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Five values I try to live by, not just talk about.
          </motion.p>

          {/* Values cards */}
          <div className="space-y-6">
            {values.map((item, i) => (
              <ValueCard key={i} icon={item.icon} title={item.title} text={item.text} index={i} />
            ))}
          </div>

          {/* Values pill strip */}
          <motion.div
            className="mt-16 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {["TRUST", "TRANSPARENCY", "COLLABORATION", "ADVOCACY", "EMPATHY"].map((val, i) => (
              <motion.span
                key={val}
                className="px-5 py-2 rounded-full text-sm md:text-base font-black tracking-widest text-white shadow-lg"
                style={{
                  background: i % 2 === 0
                    ? "linear-gradient(135deg, #ff6b2b, #d4520f)"
                    : "linear-gradient(135deg, #00b4d8, #0096c7)",
                  boxShadow: i % 2 === 0
                    ? "0 4px 20px rgba(255,107,43,0.3)"
                    : "0 4px 20px rgba(0,180,216,0.3)",
                }}
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
              >
                {val}
              </motion.span>
            ))}
          </motion.div>
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
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                border: `1px solid ${i % 2 === 0 ? "rgba(255,107,43,0.15)" : "rgba(0,180,216,0.15)"}`,
              }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.35, 0.15] }}
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
            MAKE YOUR
            <br />
            VOICE HEARD
          </h2>
          <p className="text-xl md:text-2xl text-[#90e0ef] mb-12 max-w-2xl mx-auto leading-relaxed">
            The future of our workplace starts with your vote.
            <br />
            <span className="font-bold text-white">Stand with Stef.</span>
          </p>

          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative px-14 py-6 text-2xl md:text-3xl font-black rounded-full bg-gradient-to-r from-[#ff6b2b] via-[#ff9a5c] to-[#00b4d8] text-white uppercase tracking-widest cursor-default border-2 border-white/20">
              <span className="relative z-10">VOTE STEF</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff6b2b] via-[#ff9a5c] to-[#00b4d8] blur-xl opacity-40" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== BOTTOM BANNERS ===== */}
      <ScrollingBanner text="THE PEOPLE'S CHOICE" direction="right" speed="fast" variant="orange" />
      <ScrollingBanner text="VOTE STEF — DXC WORKS COUNCIL" direction="left" variant="blue" />

      {/* ===== FOOTER ===== */}
      <footer className="py-8 text-center text-sm text-[#48cae4]/30 border-t border-[#00b4d8]/10">
        <p>STEFANO CLEMENTE — DXC WORKS COUNCIL CANDIDATE</p>
      </footer>

      {/* ===== SCANLINE OVERLAY (subtle retro vibes) ===== */}
      <div
        className="fixed inset-0 pointer-events-none z-40 opacity-[0.015]"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,180,216,0.1) 2px, rgba(0,180,216,0.1) 4px)",
        }}
      />
    </main>
  );
}
