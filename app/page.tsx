"use client";

import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { motion, AnimatePresence, useScroll, useInView } from "framer-motion";
import { Analytics } from "@vercel/analytics/next"

// Icons
import { SiPython, SiReact, SiJavascript, SiNodedotjs, SiMongodb, SiFirebase, SiStreamlit } from "react-icons/si";
import { FaShieldAlt, FaNetworkWired, FaSearch, FaGithub, FaLinkedin, FaMapMarkerAlt, FaTerminal, FaVolumeUp, FaVolumeMute, FaTimes } from "react-icons/fa";

// --- TYPES ---
type ProjectType = {
  title: string;
  subtitle: string;
  tech: string[];
  link: string;
  description: string;
};

// --- AUDIO SYSTEM ---
const playSound = (type: "hover" | "click", enabled: boolean) => {
  if (!enabled) return;
  try {
    const audio = new Audio(`/${type}.mp3`);
    audio.volume = type === "hover" ? 0.2 : 0.5;
    audio.play().catch(() => {});
  } catch {}
};

// --- 1. Tactical Custom Cursor ---
function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 border border-cyan-500/50 rounded-full pointer-events-none z-999999 hidden md:flex items-center justify-center mix-blend-screen"
      animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16 }}
      transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
    >
      <div className="w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]" />
    </motion.div>
  );
}

// --- 2. Magnetic UI Wrapper ---
function Magnetic({ children, soundEnabled }: { children: React.ReactNode, soundEnabled: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    if (!ref.current) return;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onMouseEnter={() => playSound("hover", soundEnabled)}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="w-fit"
    >
      {children}
    </motion.div>
  );
}

// --- 3. Cryptographic Text Reveal ---
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
function DecryptText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(() =>
        text.split("").map((letter, index) => {
          if (index < iteration) return text[index];
          return LETTERS[Math.floor(Math.random() * 26)];
        }).join("")
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3; 
    }, 30);
    return () => clearInterval(interval);
  }, [isInView, text]);

  return <span ref={ref}>{display}</span>;
}

// --- 4. 3D Camera Parallax Rig ---
function CameraRig() {
  const { scrollYProgress } = useScroll();
  useFrame((state) => {
    const scrollZ = THREE.MathUtils.lerp(9, -5, scrollYProgress.get() * 1.5);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, scrollZ, 0.1);
  });
  return null;
}

function TacticalCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[2.5, 0]} />
        <meshStandardMaterial color="#0ea5e9" wireframe emissive="#0284c7" emissiveIntensity={0.3} />
      </mesh>
    </Float>
  );
}

// --- Data Arrays ---
const projects: ProjectType[] = [
  {
    title: "Smart Spider", subtitle: "AI Technical SEO Auditor", tech: ["Python", "Streamlit", "AI"], link: "https://smartspider.streamlit.app/@",
    description: "Custom Python & Streamlit crawler automating Technical SEO auditing. Detects missing tags and generates precise alt-text via AI. Designed to reduce manual reporting time drastically."
  },
  {
    title: "Simplatic", subtitle: "AI Dev Docs Generator", tech: ["AI", "GitHub API", "Firebase"], link: "https://github.com/harshparikh2004/simplaticc.git",
    description: "AI-based system auto-generating Software Requirement Specifications (SRS) and test cases directly from GitHub inputs. Integrated Firebase for secure authentication and data storage."
  },
  {
    title: "Black Fortress", subtitle: "Secure Login System", tech: ["JWT", "reCAPTCHA v3", "Security"], link: "https://black-fortress-frex.onrender.com/",
    description: "Production-ready authentication using JWT and reCAPTCHA v3. Mitigated brute-force and SQL injection attacks through rigorous secure input validation logic."
  },
  {
    title: "Autobots", subtitle: "Car Servicing Platform", tech: ["React.js", "Firebase", "JS"], link: "https://autobots-f6c49.web.app",
    description: "Full-stack comprehensive platform utilizing React.js, JavaScript, and Firebase. Developed vendor dashboards, service listings, and scalable customer booking flows."
  }
];

const skills = [
  { name: "Python", icon: SiPython }, { name: "React.js", icon: SiReact }, { name: "JavaScript", icon: SiJavascript },
  { name: "Node.js", icon: SiNodedotjs }, { name: "MongoDB", icon: SiMongodb }, { name: "Firebase", icon: SiFirebase },
  { name: "Streamlit", icon: SiStreamlit }, { name: "Cybersecurity", icon: FaShieldAlt }, { name: "Networking", icon: FaNetworkWired }, { name: "SEO", icon: FaSearch }
];

const certifications = [
  { title: "Cybersecurity Analyst", issuer: "TATA Forage", date: "08/2025" },
  { title: "Introduction to Networking", issuer: "Nvidia", date: "01/2025" },
  { title: "Security Analyst", issuer: "Reliance Foundation", date: "08/2025" }
];

// --- 5. Main Page Component ---
export default function Home() {
  const [booting, setBooting] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState<string[]>(["SECURE TERMINAL v1.0.0", "Type 'help' to view available commands."]);
  const [activeProject, setActiveProject] = useState<ProjectType | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleTerminalSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      playSound("click", soundEnabled);
      const cmd = terminalInput.trim().toLowerCase();
      let response = "";

      switch (cmd) {
        case "help": response = "Commands: help, whoami, clear, execute [project_name]"; break;
        case "whoami": response = "Harsh M. Parikh - Computer Engineer & Cybersecurity Enthusiast."; break;
        case "clear": setTerminalOutput([]); setTerminalInput(""); return;
        case "execute smart-spider": 
          response = "Executing Smart-Spider AI Module...";
          window.open("https://smartspider.streamlit.app/@", "_blank");
          break;
        case "": return;
        default: response = `Command not found: ${cmd}`;
      }
      setTerminalOutput([...terminalOutput, `> ${cmd}`, response]);
      setTerminalInput("");
    }
  };

  return (
    <main className="relative bg-[#030712] text-white font-sans selection:bg-cyan-500/30 overflow-hidden cursor-none">
      <CustomCursor />

      {/* --- SOUND TOGGLE --- */}
      <button 
        onClick={() => { setSoundEnabled(!soundEnabled); playSound("click", !soundEnabled); }}
        className="fixed top-6 right-6 z-9999 text-gray-400 hover:text-cyan-400 transition-colors p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full cursor-none pointer-events-auto"
      >
        {soundEnabled ? <FaVolumeUp size={18} /> : <FaVolumeMute size={18} />}
      </button>

      {/* --- THE BOOT SEQUENCE --- */}
      <AnimatePresence>
        {booting && (
          <motion.div
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-999999 bg-[#030712] flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
              className="text-cyan-500 font-mono tracking-widest text-sm md:text-lg text-center"
            >
              <p>ESTABLISHING SECURE CONNECTION...</p>
              <p className="mt-2 text-indigo-400">DECRYPTING PROTOCOLS</p>
              <div className="w-48 h-px bg-cyan-500/50 mx-auto mt-6 relative overflow-hidden">
                 <motion.div 
                    initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-1/2 h-full bg-cyan-400"
                 />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HIDDEN TERMINAL (Ctrl + K) --- */}
      <AnimatePresence>
        {terminalOpen && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] md:w-150 h-87.5 bg-[#030712]/90 backdrop-blur-xl border border-cyan-500/30 rounded-lg shadow-[0_0_30px_rgba(34,211,238,0.1)] z-99999 flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-cyan-500/20 bg-cyan-900/20">
              <span className="text-cyan-400 font-mono text-xs tracking-widest flex items-center gap-2"><FaTerminal /> ROOT TERMINAL</span>
              <button onClick={() => { setTerminalOpen(false); playSound("click", soundEnabled); }} className="text-gray-400 hover:text-white font-mono text-xs cursor-none pointer-events-auto">[ ESC ]</button>
            </div>
            <div className="flex-1 p-4 font-mono text-sm text-cyan-100 overflow-y-auto pointer-events-auto flex flex-col">
              {terminalOutput.map((line, i) => (
                <div key={i} className={`mb-1 ${line.startsWith(">") ? "text-cyan-400" : "text-indigo-300"}`}>{line}</div>
              ))}
              <div className="flex gap-2 mt-2">
                <span className="text-cyan-500">{">"}</span>
                <input
                  type="text" autoFocus value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)} onKeyDown={handleTerminalSubmit}
                  className="flex-1 bg-transparent outline-none border-none text-cyan-100 caret-cyan-500 cursor-none" spellCheck="false"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- VAULT LOCK MODAL --- */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }} animate={{ opacity: 1, backdropFilter: "blur(20px)" }} exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-99999 flex items-center justify-center bg-black/60 p-6 pointer-events-auto"
            onClick={() => { setActiveProject(null); playSound("click", soundEnabled); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-[#030712] border border-cyan-500/30 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.15)] cursor-none"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none" />
              <button onClick={() => { setActiveProject(null); playSound("click", soundEnabled); }} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors cursor-none"><FaTimes size={24} /></button>
              
              <p className="text-cyan-400 font-mono text-xs tracking-widest mb-2 flex items-center gap-2"><FaShieldAlt /> AUTHENTICATION VERIFIED</p>
              <h2 className="text-4xl font-black mb-2">{activeProject.title}</h2>
              <p className="text-indigo-300 font-mono text-sm mb-6">{activeProject.subtitle}</p>
              
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8 text-gray-300 leading-relaxed">
                {activeProject.description}
              </div>

              <div className="flex justify-between items-center border-t border-white/10 pt-6">
                <div className="flex gap-2 flex-wrap">
                  {activeProject.tech.map((t: string, i: number) => <span key={i} className="px-3 py-1 text-xs font-mono rounded-sm bg-black/50 text-cyan-300 border border-cyan-500/20">{t}</span>)}
                </div>
                <a href={activeProject.link} target="_blank" rel="noopener noreferrer" onClick={() => playSound("click", soundEnabled)} className="px-6 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 rounded-md hover:bg-cyan-500 hover:text-[#030712] transition-all font-mono text-sm font-bold cursor-none pointer-events-auto">
                  EXECUTE &#8594;
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FIXED 3D BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 9], fov: 45 }}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#38bdf8" />
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
          <CameraRig />
          <TacticalCore />
        </Canvas>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pointer-events-none">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="absolute w-150 h-150 bg-cyan-600/10 blur-[150px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 2.2 }} className="text-center z-10">
          <p className="text-cyan-400 font-mono tracking-[0.3em] uppercase text-xs md:text-sm mb-6 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-cyan-400/50 block"></span> System Online <span className="w-8 h-px bg-cyan-400/50 block"></span>
          </p>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-4 text-white drop-shadow-2xl">HARSH<br/>PARIKH</h1>
          <h2 className="text-xl md:text-3xl font-light text-gray-400 mb-8 max-w-3xl mx-auto border-t border-b border-gray-800 py-4">
            Computer Engineer <span className="text-indigo-500 mx-2">|</span> Cybersecurity Enthusiast
          </h2>
          
          <div className="flex gap-8 justify-center pointer-events-auto mt-4">
            <Magnetic soundEnabled={soundEnabled}>
              <a href="https://github.com/harshparikh2004" target="_blank" rel="noopener noreferrer" className="block text-gray-500 hover:text-cyan-400 transition-colors duration-300 cursor-none"><FaGithub className="w-10 h-10" /></a>
            </Magnetic>
            <Magnetic soundEnabled={soundEnabled}>
              <a href="https://www.linkedin.com/in/harsh-parikh-442b98378/" target="_blank" rel="noopener noreferrer" className="block text-gray-500 hover:text-cyan-400 transition-colors duration-300 cursor-none"><FaLinkedin className="w-10 h-10" /></a>
            </Magnetic>
          </div>
          
          <div className="mt-12 text-gray-600 font-mono text-xs flex items-center justify-center gap-2 pointer-events-auto cursor-none" onClick={() => setTerminalOpen(true)}>
            <FaTerminal className="text-cyan-500/50" /> Press <span className="border border-gray-700 px-2 py-0.5 rounded-md text-gray-400">Ctrl + K</span> to access terminal
          </div>
        </motion.div>
      </section>

      {/* --- INFINITE SKILLS MARQUEE --- */}
      <div className="relative z-10 w-full bg-slate-950/60 border-y border-cyan-500/20 py-4 overflow-hidden backdrop-blur-md flex">
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 30 }} className="flex whitespace-nowrap gap-16 px-8">
          {[...skills, ...skills, ...skills].map((skill, i) => (
            <div key={i} className="flex items-center gap-3 text-cyan-400/80 hover:text-cyan-300 transition-colors">
              <skill.icon className="w-6 h-6" /> <span className="font-mono text-sm tracking-widest font-bold uppercase">{skill.name}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* --- BENTO BOX (IDENTITY & PHOTO) --- */}
      <section className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[200px]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:col-span-1 md:row-span-2 relative rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            <Image src="/profile.jpg" alt="Harsh Parikh" fill className="object-cover object-center" priority />
            <div className="absolute inset-0 bg-linear-to-t from-[#030712] via-[#030712]/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-2xl font-bold text-white">Harsh M. Parikh</h3>
              <p className="text-cyan-400 font-mono text-sm">Targeting Global Architecture</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: 0.1 }} className="md:col-span-2 md:row-span-1 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-8 flex flex-col justify-center hover:border-cyan-500/30 transition-colors">
            <h3 className="text-sm font-mono text-indigo-400 tracking-widest mb-3"><DecryptText text="OPERATIONAL DIRECTIVE" /></h3>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-xl font-light">
              Designing <span className="text-cyan-400 font-medium">impervious security models</span> and building scalable, AI-driven applications. Bridging the gap between aggressive analysis and robust full-stack engineering.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="md:col-span-2 md:row-span-1 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 p-8 flex flex-col justify-center hover:border-indigo-500/30 transition-colors relative overflow-hidden">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm mb-2 z-10 relative">
              <FaMapMarkerAlt /> <span>CURRENT NODE</span>
            </div>
            <div className="z-10 relative">
              <p className="text-4xl font-black text-white tracking-tight">Ahmedabad</p>
              <p className="text-indigo-300 font-mono mt-1 text-sm">Gujarat, India</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- THE ARCHITECTURE (EXPERIENCE) --- */}
      <section className="relative z-10 pt-16 pb-16 px-6 max-w-5xl mx-auto">
        <h3 className="text-5xl font-black mb-24 text-center text-cyan-500"><DecryptText text="THE ARCHITECTURE" /></h3>
        <div className="relative border-l border-cyan-500/30 pl-8 md:pl-16 space-y-20">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="relative">
            <div className="absolute -left-10.25 md:-left-18.25 top-1 w-5 h-5 bg-[#030712] border-2 border-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee]" />
            <h4 className="text-3xl font-bold">SEO Engineer Intern</h4>
            <p className="text-indigo-400 font-mono mt-1 mb-4">Emblus | Dec 2025 - Apr 2026 | On-Site, Ahmedabad</p>
            <p className="text-gray-400 leading-relaxed max-w-2xl">Engineered &quot;Smart-Spider,&quot; a custom AI-powered crawler. Automated technical analysis to detect crawl errors, drastically reducing manual reporting time and optimizing site architecture.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="relative">
            <div className="absolute -left-10.25 md:-left-18.25 top-1 w-5 h-5 bg-[#030712] border-2 border-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee]" />
            <h4 className="text-3xl font-bold">Cybersecurity Intern</h4>
            <p className="text-indigo-400 font-mono mt-1 mb-4">Vault-Tec Security | Sep 2025 - Oct 2025 | Remote</p>
            <p className="text-gray-400 leading-relaxed max-w-2xl">Executed vulnerability analysis on test systems. Designed strict Role-Based Access Control (RBAC) models and implemented reCAPTCHA protocols to shield applications from automated attacks.</p>
          </motion.div>
        </div>
      </section>

      {/* --- ACADEMICS & CERTIFICATIONS --- */}
      <section className="relative z-10 py-16 px-6 max-w-7xl mx-auto">
        <h3 className="text-5xl font-black mb-16 text-center text-cyan-500"><DecryptText text="CREDENTIALS" /></h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-500/30 transition-all">
            <h3 className="text-2xl font-black mb-8 text-cyan-500">ACADEMICS</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold">B.Tech Computer Engineering</h4>
                <p className="text-cyan-400 font-mono text-sm mt-1">U.V. Patel College of Engineering, Ganpat University</p>
                <p className="text-gray-500 font-mono text-xs mt-2">06/2022 - 07/2026 | Mehsana</p>
              </div>
              <div className="flex gap-4 border-t border-white/5 pt-4">
                <div className="bg-black/50 px-4 py-2 rounded-sm border border-cyan-500/20">
                  <span className="text-gray-400 text-xs block font-mono">LATEST SGPA</span> <span className="text-cyan-400 font-bold">7.85</span>
                </div>
                <div className="bg-black/50 px-4 py-2 rounded-sm border border-cyan-500/20">
                  <span className="text-gray-400 text-xs block font-mono">CGPA</span> <span className="text-cyan-400 font-bold">6.45</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-500/30 transition-all">
            <h3 className="text-2xl font-black mb-8 text-cyan-500">CERTIFICATIONS</h3>
            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-black/40 rounded-sm border border-white/5 hover:border-indigo-500/30 transition-colors">
                  <div>
                    <h4 className="font-bold text-gray-200">{cert.title}</h4> <p className="text-cyan-400 font-mono text-xs mt-1">{cert.issuer}</p>
                  </div>
                  <span className="text-gray-500 font-mono text-xs">{cert.date}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- THE VAULT (PROJECT GRID) --- */}
      <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto mb-20 pointer-events-auto">
        <h3 className="text-5xl font-black mb-16 text-center text-cyan-500"><DecryptText text="PROJECT VAULT" /></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Magnetic key={index} soundEnabled={soundEnabled}>
              <motion.div 
                onClick={() => { setActiveProject(project); playSound("click", soundEnabled); }}
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} 
                className="group relative p-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-500/40 flex flex-col h-full transition-all cursor-none"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full group-hover:bg-cyan-400/10 transition-all duration-500 pointer-events-none" />
                <h4 className="text-2xl font-bold mb-1 relative z-10 pointer-events-none">{project.title}</h4>
                <p className="text-cyan-400 font-mono text-sm mb-6 relative z-10 pointer-events-none">{project.subtitle}</p>
                <p className="text-gray-400 mb-8 leading-relaxed relative z-10 grow pointer-events-none">{project.description}</p>
              </motion.div>
            </Magnetic>
          ))}
        </div>
      </section>

    </main>
  );
}