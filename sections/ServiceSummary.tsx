"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const ServiceSummary = () => {
  useGSAP(() => {
    gsap.to("#title-service-1", {
      x: 40,
      scrollTrigger: {
        trigger: "#title-service-1",
        scrub: true,
      },
    });

    gsap.to("#title-service-2", {
      x: -40,
      scrollTrigger: {
        trigger: "#title-service-2",
        scrub: true,
      },
    });

    gsap.to("#title-service-3", {
      x: 40,
      scrollTrigger: {
        trigger: "#title-service-3",
        scrub: true,
      },
    });

    gsap.to("#title-service-4", {
      x: -40,
      scrollTrigger: {
        trigger: "#title-service-4",
        scrub: true,
      },
    });
  });

  return (
    <section className="mt-20 overflow-hidden font-light leading-snug text-center mb-42 contact-text-responsive">
      <div id="title-service-1">
        <p>Architecture</p>
      </div>

      <div
        id="title-service-2"
        className="flex items-center justify-center gap-3"
      >
        <p className="font-normal">Development</p>
        <div className="w-10 h-1 md:w-32 bg-gold" />
        <p>Deployment</p>
      </div>

      <div
        id="title-service-3"
        className="flex items-center justify-center gap-3"
      >
        <p>APIs</p>
        <div className="w-10 h-1 md:w-32 bg-gold" />
        <p className="italic">Frontends</p>
        <div className="w-10 h-1 md:w-32 bg-gold" />
        <p>Scalability</p>
      </div>

      <div id="title-service-4">
        <p>Databases</p>
      </div>
    </section>
  );
};

export default ServiceSummary;