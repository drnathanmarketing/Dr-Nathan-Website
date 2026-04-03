import useScrollOffset from "@hooks/useScrollOffet";
import scrollToElement from "src/utils/scrollToElement";
import NavbarContent from "./NavbarContent";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const Navbar = () => {
  const scrollY: number = useScrollOffset();
  const navbarRef = useRef(null);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    const target = document.getElementById("navbar_hide_trigger");

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            gsap.to(navbarRef.current, { y: -80, duration: 0.8 });
          } else {
            gsap.to(navbarRef.current, { y: 0, duration: 0.8 });
          }
        });
      }
    );

    if (target) observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
    };
  }, []);

  return (
    <nav
      ref={navbarRef}
      className={`fixed top-0 left-0 w-full z-30  ${
        scrollY > 14
          ? "bg-opacity-60 backdrop-blur-lg backdrop-filter bg-white sm:shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 ">
        <img
          src="/assets/logo/logo.png"
          className="h-10 hover:cursor-pointer"
          alt="Dr. Nathan Logo"
          onClick={() => scrollToElement("hero")}
        />
        <div
          className={`${showCard ? "" : "hidden"} absolute w-[100vw] h-[100vh]`}
          onClick={() => setShowCard(false)}
        ></div>
        <div
          className="block md:hidden relative"
          onClick={() => setShowCard(true)}
        >
          <div
            className={`${
              showCard ? "inline-block" : "hidden"
            } absolute right-0 bg-white rounded-sm shadow-md p-6 top-[56px] w-64 z-10`}
          >
            <div className="flex flex-col gap-4">
              <NavbarContent />
            </div>
          </div>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-10 h-10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <line
                x1="5"
                y1="7"
                x2="19"
                y2="7"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></line>
              <line
                x1="5"
                y1="12"
                x2="19"
                y2="12"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></line>
              <line
                x1="5"
                y1="17"
                x2="19"
                y2="17"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></line>
            </g>
          </svg>
        </div>

        <div className=" hidden flex-row gap-8  md:flex">
          <NavbarContent />
          {/* <div className="group">
            <div className="flex flex-row items-center hover:text-primary-900 ">
              <p className="text-base tracking-wide font-semibold">Services</p>
              <svg
                className="w-2.5 h-2.5 ms-2.5 transition-transform transform origin-center group-hover:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </div>
            <span className="hidden group-hover:inline-block absolute">
              Hovered Content
            </span>
          </div> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
