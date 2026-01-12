"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import gsap from "gsap";
import { Observer } from "gsap/all";
import { useEffect, useRef } from "react";

gsap.registerPlugin(Observer);

/* ------------------ TYPES ------------------ */

interface MarqueeProps {
  items: string[];
  className?: string;
  icon?: string;
  iconClassName?: string;
  reverse?: boolean;
}

type HorizontalLoopConfig = {
  repeat?: number;
  paused?: boolean;
  speed?: number;
  snap?: number | false;
  paddingRight?: number;
  reversed?: boolean;
};

interface HorizontalLoopTimeline extends gsap.core.Timeline {
  next?: (vars?: gsap.TweenVars) => gsap.core.Tween;
  previous?: (vars?: gsap.TweenVars) => gsap.core.Tween;
  current?: () => number;
  toIndex?: (index: number, vars?: gsap.TweenVars) => gsap.core.Tween;
  times?: number[];
}

/* ------------------ COMPONENT ------------------ */

const Marquee: React.FC<MarqueeProps> = ({
  items,
  className = "text-white bg-black",
  icon = "mdi:star-four-points",
  iconClassName = "",
  reverse = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<(HTMLSpanElement | null)[]>([]);

  function horizontalLoop(
    elements: (HTMLElement | null)[],
    config: HorizontalLoopConfig = {}
  ) {
    // Filter out null elements
    const items = elements.filter((el): el is HTMLElement => el !== null);
    
    if (items.length === 0) return null;

    let tl = gsap.timeline({
        repeat: config.repeat,
        paused: config.paused,
        defaults: { ease: "none" },
        onReverseComplete: () => {
          if (tl.totalTime() !== undefined) {
            tl.totalTime(tl.rawTime() + tl.duration() * 100);
          }
        }
      }) as HorizontalLoopTimeline,
      length = items.length,
      startX = items[0].offsetLeft,
      times: number[] = [],
      widths: number[] = [],
      xPercents: number[] = [],
      curIndex = 0,
      pixelsPerSecond = (config.speed || 1) * 100,
      snap =
        config.snap === false
          ? (v: number) => v
          : gsap.utils.snap(config.snap || 1),
      totalWidth: number,
      curX: number,
      distanceToStart: number,
      distanceToLoop: number,
      item: HTMLElement,
      i: number;

    // Initialize items
    gsap.set(items, {
      xPercent: (i: number, el: HTMLElement) => {
        let w = (widths[i] = parseFloat(
          gsap.getProperty(el, "width", "px") as string
        ));
        const xValue = parseFloat(gsap.getProperty(el, "x", "px") as string) || 0;
        const xPercentValue = gsap.getProperty(el, "xPercent") as number || 0;
        xPercents[i] = snap(
          (xValue / w) * 100 + xPercentValue
        );
        return xPercents[i];
      },
    });

    gsap.set(items, { x: 0 });

    const lastItem = items[length - 1];
    const lastItemScaleX = gsap.getProperty(lastItem, "scaleX") as number || 1;
    
    totalWidth =
      lastItem.offsetLeft +
      (xPercents[length - 1] / 100) * widths[length - 1] -
      startX +
      lastItem.offsetWidth * lastItemScaleX +
      (config.paddingRight || 0);

    for (i = 0; i < length; i++) {
      item = items[i];
      curX = (xPercents[i] / 100) * widths[i];
      distanceToStart = item.offsetLeft + curX - startX;
      const itemScaleX = gsap.getProperty(item, "scaleX") as number || 1;
      distanceToLoop =
        distanceToStart +
        widths[i] * itemScaleX;

      tl.to(
        item,
        {
          xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
          duration: distanceToLoop / pixelsPerSecond,
        },
        0
      )
        .fromTo(
          item,
          {
            xPercent: snap(
              ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
            ),
          },
          {
            xPercent: xPercents[i],
            duration:
              (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
            immediateRender: false,
          },
          distanceToLoop / pixelsPerSecond
        )
        .add("label" + i, distanceToStart / pixelsPerSecond);

      times[i] = distanceToStart / pixelsPerSecond;
    }

    function toIndex(index: number, vars: gsap.TweenVars = {}) {
      const newIndex = gsap.utils.wrap(0, length, index);
      let time = times[newIndex];

      if (time > tl.time() !== (index > curIndex)) {
        vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
        time += tl.duration() * (index > curIndex ? 1 : -1);
      }

      curIndex = newIndex;
      vars.overwrite = true;

      return tl.tweenTo(time, vars);
    }

    tl.next = (vars?: gsap.TweenVars) => toIndex(curIndex + 1, vars);
    tl.previous = (vars?: gsap.TweenVars) => toIndex(curIndex - 1, vars);
    tl.current = () => curIndex;
    tl.toIndex = (index: number, vars?: gsap.TweenVars) => toIndex(index, vars);
    tl.times = times;

    tl.progress(1, true).progress(0, true);

    if (config.reversed) {
      if (tl.vars && typeof tl.vars === 'object' && 'onReverseComplete' in tl.vars) {
        (tl.vars as any).onReverseComplete?.();
      }
      tl.reverse();
    }

    return tl;
  }

  useEffect(() => {
    // Filter out null refs
    const validItems = itemsRef.current.filter((el): el is HTMLSpanElement => el !== null);
    
    if (validItems.length === 0) return;

    const tl = horizontalLoop(validItems, {
      repeat: -1,
      paddingRight: 30,
      reversed: reverse,
    });

    if (!tl) return;

    const observer = Observer.create({
      onChangeY(self: Observer) {
        let factor = 2.5;
        if ((!reverse && self.deltaY < 0) || (reverse && self.deltaY > 0)) {
          factor *= -1;
        }

        gsap
          .timeline({ defaults: { ease: "none" } })
          .to(tl, { timeScale: factor * 2.5, duration: 0.2, overwrite: true })
          .to(tl, { timeScale: factor / 2.5, duration: 1 }, "+=0.3");
      },
    });

    return () => {
      observer.kill();
      tl.kill();
    };
  }, [items, reverse]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden w-full h-20 md:h-25 flex items-center marquee-text-responsive font-light uppercase whitespace-nowrap ${className}`}
    >
      <div className="flex">
        {items.map((text, index) => (
          <span
            key={index}
            ref={(el) => {
              if (el) {
                itemsRef.current[index] = el;
              }
            }}
            className="flex items-center px-16 gap-x-32"
          >
            {text} <Icon icon={icon} className={iconClassName} />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;