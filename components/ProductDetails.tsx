import { motion } from "motion/react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Framework = {
  name: string;
};

type ProjectDetailsProps = {
  title: string;
  description: string;
  image: string;
  frameworks: Framework[];
  href: string;
  closeModal: () => void;
};

type IconState = "none" | "down" | "up";

const ProjectDetails = ({
  title,
  description,
  image,
  frameworks,
  href,
  closeModal,
}: ProjectDetailsProps) => {
  
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [iconState, setIconState] = useState<IconState>("none");

  // Lock background scroll
  useEffect(() => {
    const scrollY = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.position = "static";
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Detect scroll + overflow
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const checkScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      const hasOverflow = scrollHeight > clientHeight + 5;
      const atBottom =
        scrollHeight - scrollTop <= clientHeight + 5;

      if (!hasOverflow) {
        setIconState("none");
      } else if (atBottom) {
        setIconState("up");
      } else {
        setIconState("down");
      }
    };

    checkScroll();

    container.addEventListener("scroll", checkScroll);

    return () => {
      container.removeEventListener("scroll", checkScroll);
    };
  }, []);

  // Scroll Down
  const scrollDown = () => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollBy({
      top: container.clientHeight * 0.6,
      behavior: "smooth",
    });
  };

  // Scroll Up
  const scrollUp = () => {
    scrollRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={closeModal}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl md:max-w-3xl w-full h-[80vh] md:h-[90vh] flex flex-col border shadow-sm rounded-2xl bg-gradient-to-l from-midnight to-navy border-white/10 overflow-hidden"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
      >

        {/* Close Button */}
        <X
          onClick={closeModal}
          className="w-12 h-12 absolute p-2 text-white rounded-full top-5 right-5 bg-midnight hover:bg-gray-500 cursor-pointer z-10"
        />

        {/* Image */}
        <img
          src={image}
          alt={title}
          className="w-full rounded-t-2xl"
        />

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className="p-5 overflow-y-auto bg-black flex-1"
        >
          <h5 className="mb-2 text-2xl font-bold text-white">
            {title}
          </h5>

          <p className="mb-3 font-normal text-neutral-400">
            {description}
          </p>

          <div className="flex flex-row gap-3 items-center flex-wrap">
            {frameworks.map((subDesc, index) => (
              <p
                key={index}
                className="mb-3 font-normal text-neutral-400"
              >
                {subDesc.name}
              </p>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white inline-flex items-center gap-1 font-medium cursor-pointer hover-animation"
            >
              View Project
              <img
                src="assets/arrow-up.svg"
                className="size-4"
              />
            </a>
          </div>
        </div>

        {/* Scroll Down Icon */}
        {iconState === "down" && (
          <motion.div
            onClick={scrollDown}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 cursor-pointer bg-white/10 p-2 rounded-full backdrop-blur-md"
          >
            <ChevronDown className="text-white w-6 h-6" />
          </motion.div>
        )}

        {/* Scroll Up Icon */}
        {iconState === "up" && (
          <motion.div
            onClick={scrollUp}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 cursor-pointer bg-white/10 p-2 rounded-full backdrop-blur-md"
          >
            <ChevronUp className="text-white w-6 h-6" />
          </motion.div>
        )}

      </motion.div>
    </div>
  );
};

export default ProjectDetails;