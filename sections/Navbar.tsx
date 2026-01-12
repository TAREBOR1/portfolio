"use client";

import React, { useEffect, useRef, useState } from "react";
import { socials } from "../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link } from "react-scroll";

const Navbar: React.FC = () => {
  const navRef = useRef<HTMLDivElement | null>(null);
  const linksRef = useRef<(HTMLDivElement | null)[]>([]);
  const contactRef = useRef<HTMLDivElement | null>(null);
  const topLineRef = useRef<HTMLSpanElement | null>(null);
  const bottomLineRef = useRef<HTMLSpanElement | null>(null);

  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const iconTl = useRef<gsap.core.Timeline | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [showBurger, setShowBurger] = useState(true);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      if (!navRef.current) return;

      gsap.set(navRef.current, { xPercent: 100 });
      gsap.set([...linksRef.current, contactRef.current], {
        autoAlpha: 0,
        x: -20,
      });

      menuTl.current = gsap
        .timeline({ paused: true })
        .to(navRef.current, {
          xPercent: 0,
          duration: 1,
          ease: "power3.out",
        })
        .to(
          linksRef.current,
          {
            autoAlpha: 1,
            x: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "power2.out",
          },
          "<"
        )
        .to(
          contactRef.current,
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "<+0.2"
        );

      iconTl.current = gsap
        .timeline({ paused: true })
        .to(topLineRef.current, {
          rotate: 45,
          y: 3.3,
          duration: 0.3,
          ease: "power2.inOut",
        })
        .to(
          bottomLineRef.current,
          {
            rotate: -45,
            y: -3.3,
            duration: 0.3,
            ease: "power2.inOut",
          },
          "<"
        );
    }, navRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowBurger(currentScrollY <= lastScrollY || currentScrollY < 10);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    if (!menuTl.current || !iconTl.current) return;

    if (isOpen) {
      menuTl.current.reverse();
      iconTl.current.reverse();
    } else {
      menuTl.current.play();
      iconTl.current.play();
    }

    setIsOpen((v) => !v);
  };

  const closeMenu = () => {
    if (!isOpen) return;
    
    if (menuTl.current && iconTl.current) {
      menuTl.current.reverse();
      iconTl.current.reverse();
      setIsOpen(false);
    }
  };

  const handleLinkClick = (section: string) => {
    // Close the menu when any link is clicked
    closeMenu();
    
    // Optionally, you can add any additional logic here
    // like tracking analytics or other side effects
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed z-50 flex flex-col justify-between w-full h-full px-10 uppercase bg-black text-white/80 py-28 gap-y-10 md:w-1/2 md:left-1/2"
      >
        <div className="flex flex-col text-5xl gap-y-2 md:text-6xl lg:text-8xl">
          {["home", "services", "about", "work", "contact"].map(
            (section, index) => (
              <div key={index} ref={(el) => void (linksRef.current[index] = el)}>
                <Link
                  className="transition-all duration-300 cursor-pointer hover:text-white"
                  to={section}
                  smooth
                  duration={1000}
                  onClick={() => handleLinkClick(section)}
                  spy={true}
                  offset={-100}
                  activeClass="text-white font-medium"
                >
                  {section}
                </Link>
              </div>
            )
          )}
        </div>

        <div
          ref={contactRef}
          className="flex flex-col flex-wrap justify-between gap-8 md:flex-row"
        >
          <div className="font-light">
            <p className="tracking-wider text-white/50">E-mail</p>
            <p className="text-xl tracking-widest lowercase">
              JohnDoe@gmail.com
            </p>
          </div>

          <div className="font-light">
            <p className="tracking-wider text-white/50">Social Media</p>
            <div className="flex flex-col md:flex-row gap-x-2">
              {socials.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm leading-loose tracking-widest uppercase hover:text-white transition-colors duration-300"
                >
                  {"{ "}
                  {social.name}
                  {" }"}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div
        className="fixed z-50 flex flex-col items-center justify-center gap-1 transition-all duration-300 bg-black rounded-full cursor-pointer w-14 h-14 md:w-20 md:h-20 top-4 right-10"
        onClick={toggleMenu}
        style={{
          clipPath: showBurger
            ? "circle(50% at 50% 50%)"
            : "circle(0% at 50% 50%)",
        }}
      >
        <span
          ref={topLineRef}
          className="block w-8 h-0.5 bg-white rounded-full origin-center"
        />
        <span
          ref={bottomLineRef}
          className="block w-8 h-0.5 bg-white rounded-full origin-center"
        />
      </div>
    </>
  );
};

export default Navbar;