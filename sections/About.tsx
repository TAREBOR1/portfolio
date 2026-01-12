"use client";

import { useRef } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { AnimatedTextLines } from "../components/AnimatedTextLines";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const text = `Passionate about clean architecture
I build scalable, high-performance solutions
from prototype to production`;

  const aboutText = `Obsessed with building fast, intuitive apps—from pixel-perfect React UIs to bulletproof serverless backends. Every line of code is a promise: quality that users feel.
When I’m not shipping:
⚡️ Open-sourcing my latest experiment (or hacking on yours)
🎥 Teaching devs on Twitch/YouTube—because rising tides lift all ships
🧗 Rock climbing (problem-solving with real stakes)
🎸 Strumming chords while CI pipelines pass (multitasking at its finest)`;

  const sectionRef = useRef<HTMLElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useGSAP(() => {
    if (!sectionRef.current || !imgRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(sectionRef.current, {
        scale: 0.95,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "bottom 80%",
          end: "bottom 20%",
          scrub: true,
        },
      });

      gsap.set(imgRef.current, {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
      });

      gsap.to(imgRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: imgRef.current,
        },
      });
    }, sectionRef);

    return () => ctx.revert(); // ✅ correct cleanup for useGSAP
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="min-h-screen bg-black rounded-b-4xl"
    >
      <AnimatedHeaderSection
        subTitle="Code with purpose, Built to scale"
        title="About"
        text={text}
        textColor="text-white"
        withScrollTrigger
      />

      <div className="flex flex-col items-center justify-between gap-16 px-10 pb-16 text-xl font-light tracking-wide lg:flex-row md:text-2xl lg:text-3xl text-white/60">
        <img
          ref={imgRef}
          src="/images/man.jpg"
          alt="man"
          className="w-md rounded-3xl"
        />

        <AnimatedTextLines text={aboutText} className="w-full" />
      </div>
    </section>
  );
};

export default About;
