/* empty css                                 */
import { c as createComponent, a as addAttribute, r as renderHead, b as renderComponent, d as renderSlot, e as renderTemplate, f as createAstro, m as maybeRenderHead, g as renderScript } from '../chunks/astro/server_CI4GZn7w.mjs';
import 'piccolore';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { $ as $$Image } from '../chunks/_astro_assets_DGRemBn6.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

const useScrollOffset = () => {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const scrollHandler = () => {
      setOffset(window.scrollY);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);
  return offset;
};

const scrollToElement = (id) => {
  const element = document.getElementById(id);
  if (element) element.scrollIntoView({ behavior: "auto" });
};

const NavbarContent = () => {
  const onLinkClick = (link) => {
    return () => scrollToElement(link);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "p",
      {
        className: "text-base tracking-wide font-semibold hover:text-primary-900 hover:cursor-pointer",
        onClick: onLinkClick("testimonial"),
        children: "Why Us"
      }
    ),
    /* @__PURE__ */ jsx(
      "p",
      {
        className: "text-base tracking-wide font-semibold hover:text-primary-900 hover:cursor-pointer",
        onClick: onLinkClick("service"),
        children: "Services"
      }
    ),
    /* @__PURE__ */ jsx(
      "p",
      {
        className: "text-base tracking-wide font-semibold hover:text-primary-900 hover:cursor-pointer",
        onClick: onLinkClick("faq"),
        children: "FAQs"
      }
    ),
    /* @__PURE__ */ jsx(
      "p",
      {
        className: "text-base tracking-wide font-semibold hover:text-primary-900 hover:cursor-pointer",
        onClick: onLinkClick("contact_us"),
        children: "Contact Us"
      }
    )
  ] });
};

const Navbar = () => {
  const scrollY = useScrollOffset();
  const navbarRef = useRef(null);
  const [showCard, setShowCard] = useState(false);
  useEffect(() => {
    const target = document.getElementById("navbar_hide_trigger");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
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
  return /* @__PURE__ */ jsx(
    "nav",
    {
      ref: navbarRef,
      className: `fixed top-0 left-0 w-full z-30  ${scrollY > 14 ? "bg-opacity-60 backdrop-blur-lg backdrop-filter bg-white sm:shadow-md" : "bg-transparent"}`,
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 ", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "/assets/logo/logo.png",
            className: "h-10 hover:cursor-pointer",
            alt: "Dr. Nathan Logo",
            onClick: () => scrollToElement("hero")
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `${showCard ? "" : "hidden"} absolute w-[100vw] h-[100vh]`,
            onClick: () => setShowCard(false)
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "block md:hidden relative",
            onClick: () => setShowCard(true),
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `${showCard ? "inline-block" : "hidden"} absolute right-0 bg-white rounded-sm shadow-md p-6 top-[56px] w-64 z-10`,
                  children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4", children: /* @__PURE__ */ jsx(NavbarContent, {}) })
                }
              ),
              /* @__PURE__ */ jsxs(
                "svg",
                {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  className: "w-10 h-10",
                  xmlns: "http://www.w3.org/2000/svg",
                  children: [
                    /* @__PURE__ */ jsx("g", { id: "SVGRepo_bgCarrier", strokeWidth: "0" }),
                    /* @__PURE__ */ jsx(
                      "g",
                      {
                        id: "SVGRepo_tracerCarrier",
                        strokeLinecap: "round",
                        strokeLinejoin: "round"
                      }
                    ),
                    /* @__PURE__ */ jsxs("g", { id: "SVGRepo_iconCarrier", children: [
                      /* @__PURE__ */ jsx(
                        "line",
                        {
                          x1: "5",
                          y1: "7",
                          x2: "19",
                          y2: "7",
                          stroke: "#000000",
                          strokeWidth: "2",
                          strokeLinecap: "round",
                          strokeLinejoin: "round"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "line",
                        {
                          x1: "5",
                          y1: "12",
                          x2: "19",
                          y2: "12",
                          stroke: "#000000",
                          strokeWidth: "2",
                          strokeLinecap: "round",
                          strokeLinejoin: "round"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "line",
                        {
                          x1: "5",
                          y1: "17",
                          x2: "19",
                          y2: "17",
                          stroke: "#000000",
                          strokeWidth: "2",
                          strokeLinecap: "round",
                          strokeLinejoin: "round"
                        }
                      )
                    ] })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: " hidden flex-row gap-8  md:flex", children: /* @__PURE__ */ jsx(NavbarContent, {}) })
      ] })
    }
  );
};

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/assets/logo/logo.png"><meta name="generator"${addAttribute(Astro2.generator, "content")}><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet"><!-- Primary Meta Tags --><title>Dr. Nathan Marketing & Consultancy</title><meta name="title" content="Dr. Nathan Marketing & Consultancy"><meta name="description" content="Startup Business founded by a group of doctors, providing marketing
      service for healthcare industry in Myanmar."><meta name="keywords" content="Dr. Nathan Marketing, healthcare marketing Myanmar, marketing consultancy Myanmar, startup marketing services, medical marketing Myanmar"><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url" content="https://www.drnathanmarketing.com/"><meta property="og:title" content="Dr. Nathan Marketing & Consultancy"><meta property="og:description" content="Startup Business founded by a group of doctors, providing marketing
      service for healthcare industry in Myanmar."><meta property="og:image" content="/assets/logo/logo.png"><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url" content="https://www.drnathanmarketing.com/"><meta property="twitter:title" content="Dr. Nathan Marketing & Consultancy"><meta property="twitter:description" content="Startup Business founded by a group of doctors, providing marketing
      service for healthcare industry in Myanmar."><meta property="twitter:image" content="/assets/logo/logo.png"><!-- Meta Tags Generated with https://metatags.io -->${renderHead()}</head> <body class="font-openSan"> ${renderComponent($$result, "Navbar", Navbar, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@components/common/Navbar", "client:component-export": "default" })} <div class="h-[70px]"></div> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/layouts/Layout.astro", void 0);

const glucos = new Proxy({"src":"/_astro/1.aCn6NNc9.png","width":1000,"height":500,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/clients/1.png";
							}
							
							return target[name];
						}
					});

const dugro = new Proxy({"src":"/_astro/2.BQtf8w9X.png","width":1788,"height":1166,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/clients/2.png";
							}
							
							return target[name];
						}
					});

const avolac = new Proxy({"src":"/_astro/3.C_sLqTxO.png","width":1500,"height":900,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/clients/3.png";
							}
							
							return target[name];
						}
					});

const sun = new Proxy({"src":"/_astro/4.UiCRuHX9.png","width":1189,"height":1600,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/clients/4.png";
							}
							
							return target[name];
						}
					});

const vital = new Proxy({"src":"/_astro/5.DvoURZ6a.png","width":1000,"height":500,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/clients/5.png";
							}
							
							return target[name];
						}
					});

const roche = new Proxy({"src":"/_astro/6.DS6ivfaS.png","width":528,"height":275,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/clients/6.png";
							}
							
							return target[name];
						}
					});

const skinland = new Proxy({"src":"/_astro/7.TcHXbAcS.png","width":450,"height":225,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/clients/7.png";
							}
							
							return target[name];
						}
					});

const goneyay = new Proxy({"src":"/_astro/8.8WCW8X2v.png","width":450,"height":225,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/clients/8.png";
							}
							
							return target[name];
						}
					});

const ohoo = new Proxy({"src":"/_astro/9.ZtWVi5s-.png","width":3000,"height":1134,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/clients/9.png";
							}
							
							return target[name];
						}
					});

const rejuve = new Proxy({"src":"/_astro/10.DG8sABXg.png","width":800,"height":1000,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/clients/10.png";
							}
							
							return target[name];
						}
					});

const homedoctor = new Proxy({"src":"/_astro/11.jRugKNU3.png","width":800,"height":1000,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/clients/11.png";
							}
							
							return target[name];
						}
					});

const s = new Proxy({"src":"/_astro/12.CWsylbyi.png","width":800,"height":1000,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/clients/12.png";
							}
							
							return target[name];
						}
					});

const $$Hero = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="hero" class="max-w-screen-xl mx-auto flex flex-col p-4 pt-6 md:pt-10 mb-16 gap-12 h-[90vh] items-center text-center justify-center"> <div class="basis-1/2 flex flex-col gap-4"> <div class="h-[35px]"></div> <p class="text-sm">Dr. Nathan Marketing & Consultancy</p> <div class="relative"> <p class="text-5xl font-bold">Elevate Your Brand</p> ${renderComponent($$result, "Image", $$Image, { "alt": "brand_icons", "src": glucos, "class": "w-[80px] xl:w-[140px] object-contain absolute -top-[100px] xl:-top-[200px] left-1/2 transform -translate-x-1/2 opacity-0", "data-fade-in": true })} ${renderComponent($$result, "Image", $$Image, { "alt": "brand_icons", "src": dugro, "class": "w-[57.14px] xl:w-[100px] object-contain absolute -top-[80px] xl:-top-[150px] -left-[15px] xl:-left-[50px] opacity-0", "data-fade-in": true })} ${renderComponent($$result, "Image", $$Image, { "alt": "brand_icons", "src": avolac, "class": "w-[80px] xl:w-[140px] object-contain absolute -top-[80px] xl:-top-[150px] -right-[15px] xl:-right-[50px] opacity-0", "data-fade-in": true })} ${renderComponent($$result, "Image", $$Image, { "alt": "brand_icons", "src": sun, "class": "w-[45.71px] xl:w-[80px] object-contain absolute -top-[150px] xl:-top-[50px] left-[75px] xl:-left-[150px] opacity-0", "data-fade-in": true })} ${renderComponent($$result, "Image", $$Image, { "alt": "brand_icons", "src": vital, "class": "w-[80px] xl:w-[140px] object-contain absolute -top-[150px] xl:-top-[50px] right-[75px] xl:-right-[150px] opacity-0", "data-fade-in": true })} ${renderComponent($$result, "Image", $$Image, { "alt": "brand_icons", "src": roche, "class": "w-[68.57px] xl:w-[120px] object-contain absolute -top-[200px] xl:top-[0px] left-1/2 transform -translate-x-1/2 xl:-left-[350px] opacity-0", "data-fade-in": true })} ${renderComponent($$result, "Image", $$Image, { "alt": "brand_icons", "src": skinland, "class": "w-[80px] xl:w-[140px] object-contain absolute -top-[200px] xl:top-[0px] -right-[0px] xl:-right-[350px] opacity-0", "data-fade-in": true })} ${renderComponent($$result, "Image", $$Image, { "alt": "brand_icons", "src": goneyay, "class": "w-[80px] xl:w-[140px] object-contain absolute -top-[200px] xl:-top-[300px] -left-[0px] xl:-left-[150px] opacity-0", "data-fade-in": true })} ${renderComponent($$result, "Image", $$Image, { "alt": "brand_icons", "src": ohoo, "class": "w-[80px] xl:w-[140px] object-contain absolute -top-[250px] xl:-top-[250px] left-[60px] xl:left-[50px] opacity-0", "data-fade-in": true })} ${renderComponent($$result, "Image", $$Image, { "alt": "brand_icons", "src": homedoctor, "class": "w-[68.57px] xl:w-[120px] object-contain absolute -top-[275px] xl:-top-[300px] right-[70px] xl:right-[50px] opacity-0", "data-fade-in": true })} ${renderComponent($$result, "Image", $$Image, { "alt": "brand_icons", "src": s, "class": "w-[80px] xl:w-[140px] object-contain absolute -top-[100px] xl:-top-[250px] -left-[300px] hidden xl:block opacity-0", "data-fade-in": true })} ${renderComponent($$result, "Image", $$Image, { "alt": "brand_icons", "src": rejuve, "class": "w-[80px] xl:w-[140px] object-contain absolute -top-[100px] xl:-top-[250px] -right-[250px] hidden xl:block opacity-0", "data-fade-in": true })} </div> <p class="text-sm sm:text-base mt-2 max-w-[560px] mx-auto">
We are dedicated, forward-thinking individuals committed to exploring and
      delivering innovative solutions tailored specifically for you.
</p> <div> <button id="hero_learn_more_btn" type="submit" class="text-white bg-primary-900 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none">Learn More</button> </div> </div> </div> ${renderScript($$result, "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/components/home/Hero.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/components/home/Hero.astro", void 0);

const $$AboutUs = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="about_us" class="max-w-screen-xl mx-auto bg-primary-900 rounded-md"> <div id="about_us_slide_in" class="flex flex-col md:flex-row px-8 bg-primary-50 py-16 rounded-md gap-20"> <div class="basis-1/2"> <p class="text-left text-sm">We are a</p> <p class="text-4xl tracking-wide max-w-4xl text-left">
Startup Business founded by a group of doctors, providing marketing
        service for healthcare industry in Myanmar.
</p> </div> <div class="basis-1/2 flex flex-col gap-4 text-left md:text-center"> <div class="basis-1/3 flex flex-col"> <p class="text-3xl text-primary-900 font-semibold">3.5K+</p> <p class="text-base">Creative Contents</p> </div> <div class="basis-1/3 flex flex-col"> <p class="text-3xl text-primary-900 font-semibold">80+</p> <p class="text-base">Campaigns</p> </div> <div class="basis-1/3 flex flex-col"> <p class="text-3xl text-primary-900 font-semibold">5M+</p> <p class="text-base">Engagements</p> </div> </div> </div> </div> ${renderScript($$result, "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/components/home/AboutUs.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/components/home/AboutUs.astro", void 0);

const $$WhyUs = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="testimonial" class="max-w-screen-xl mx-auto p-4 py-48"> <div class="flex flex-col lg:flex-row gap-10"> <div class="basis-2/5 flex flex-col gap-8"> <p class="text-base">Why choose us?</p> <p class="text-5xl font-bold">
At Dr. Nathan<br> Marketing & Consultancy
</p> <p class="text-sm max-w-[400px] text-wrap">
We specialize in innovative and creative marketing strategies tailored
        specifically for the healthcare industry. Our team includes experienced
        doctors who combine medical expertise with marketing acumen, offering a
        unique advantage. Here are four key benefits of partnering with us.
</p> <div> <button id="testimonial_contact_us_btn" class="hover:cursor-pointer flex flex-row gap-1 items-center"> <span class="text-base text-primary-900 font-bold">Contact Us</span> <span class="h-8 w-8"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 7L15 12L10 17" stroke="#004a7d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></span> </button> </div> </div> <div id="why_us_facts" class="basis-3/5 lg:mt-40 flex flex-row gap-5 justify-center overflow-hidden"> <div class="basis-1/2 flex flex-col gap-5"> <div id="fact_1" class="basis-1/2 pt-32 flex flex-col md:flex-row gap-4"> <div> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12 text-gray-900 dark:text-gray-50"> <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path> <rect width="20" height="14" x="2" y="6" rx="2"></rect> </svg> </div> <div class="flex flex-col gap-2"> <p class="text-base font-bold">Expert-Led Marketing Strategies</p> <p class="text-sm">
Leverage industry insights to effectively target audiences,
              optimize campaigns, and drive significant business growth and
              brand loyalty.
</p> </div> </div> <div class="bg-black min-h-1"></div> <div id="fact_2" class="basis-1/2 flex flex-col md:flex-row gap-4 pb-10"> <div> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12 text-gray-900 dark:text-gray-50"> <path d="m3 11 18-5v12L3 14v-3z"></path> <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path> </svg> </div> <div class="flex flex-col gap-2"> <p class="text-base font-bold">Targeted Brand Communication</p> <p class="text-sm">
Enhances customer engagement by delivering personalized messages,
              fostering loyalty, and strengthening brand identity across various
              platforms.
</p> </div> </div> </div> <div class="bg-black min-w-1"></div> <div class="basis-1/2 flex flex-col gap-5"> <div id="fact_3" class="basis-1/2 flex flex-col md:flex-row gap-4 pt-10"> <div> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12 text-gray-900 dark:text-gray-50"> <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path> <circle cx="9" cy="7" r="4"></circle> <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path> <path d="M16 3.13a4 4 0 0 1 0 7.75"></path> </svg> </div> <div class="flex flex-col gap-2"> <p class="text-base font-bold">Collaborative Approach</p> <p class="text-sm">
Unites diverse perspectives, fosters innovation, enhances
              teamwork, and drives successful outcomes through shared goals and
              mutual support.
</p> </div> </div> <div class="bg-black min-h-1"></div> <div id="fact_4" class="basis-1/2 flex flex-col md:flex-row gap-4 pb-32"> <div> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12 text-gray-900 dark:text-gray-50"> <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path> <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path> <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path> <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path> </svg> </div> <div class="flex flex-col gap-2"> <p class="text-base font-bold">Cutting-Edge Innovation</p> <p class="text-sm">
Propels industries forward, integrating advanced technologies and
              creative solutions to solve complex problems and enhance user
              experiences.
</p> </div> </div> </div> </div> </div> </div> ${renderScript($$result, "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/components/home/WhyUs.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/components/home/WhyUs.astro", void 0);

const $$Service = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="navbar_hide_trigger"> <div id="service" class="overflow-hidden"> <section id="section1" class="parallax__item w-full h-screen relative p-4"> <!-- <span
        class="absolute right-5 bottom-5 text-lg md:text-3xl leading-none z-10 font-bold text-primary-800"
        >#01</span
      > --> <div class="absolute left-0 top-0 w-full h-screen bg-cover bg-center bg-[url('assets/img/images02@2.jpg')] bg-primary-100"></div> <div class="flex flex-col gap-[4vh] md:gap-10 max-w-screen-lg mx-auto mt-[2vh]"> <p class="z-20 text-lg md:text-3xl leading-none font-bold text-primary-800">
#01
</p> <div class="flex flex-col-reverse md:flex-row justify-center md:mt-20 gap-[4vh] md:gap-10"> <div class="z-20 grid grid-cols-2 gap-2 basis-1/2"> <img src="assets/services/cm1.jpg" class="w-[100%] aspect-square object-cover"> <img src="assets/services/cm2.jpg" class="w-[100%] aspect-square object-cover"> <img src="assets/services/cm5.jpg" class="w-[100%] aspect-square object-cover"> <img src="assets/services/cm6.jpg" class="w-[100%] aspect-square object-cover"> </div> <div class="z-20 flex flex-col gap-[4vh] md:gap-6 basis-1/2"> <h2 class="text-lg md:text-3xl uppercase inline-block text-primary-800 font-bold">
Content Development By Medical Doctors
</h2> <p class="text-base">
Trust our team of experienced medical doctors to craft accurate,
              insightful, and patient-centric content. From blog posts to
              educational materials, our content development services ensure
              your messaging is both authoritative and accessible.
</p> </div> </div> </div> </section> <!-- //section1 --> <section id="section2" class="parallax__item w-full h-screen relative flex flex-col p-4"> <div class="absolute left-0 top-0 w-full h-screen bg-cover bg-center bg-[url('assets/img/images03@2.jpg')] bg-primary-200"></div> <div class="flex flex-col gap-[4vh] md:gap-10 max-w-screen-lg mx-auto mt-[2vh]"> <p class="z-20 text-lg md:text-3xl leading-none font-bold text-primary-800">
#02
</p> <div class="flex flex-col-reverse md:flex-row justify-center md:mt-20 gap-[4vh] md:gap-10"> <div class="z-20 basis-1/2"> <img src="assets/services/sm1.jpg" class="w-[100%] aspect-square object-cover"> </div> <div class="z-20 flex flex-col gap-[4vh] md:gap-6 basis-1/2"> <h2 class="text-lg md:text-3xl uppercase inline-block text-primary-800 font-bold">
Social Media Marketing
</h2> <p class="text-base">
Engage with your audience through strategic social media
              marketing. We create compelling campaigns that build your online
              presence, foster community interaction, and promote your
              healthcare services effectively across all major platforms.
</p> </div> </div> </div> </section> <!-- //section2 --> <section id="section3" class="parallax__item w-full h-screen relative flex flex-col p-4"> <div class="absolute left-0 top-0 w-full h-screen bg-cover bg-center bg-[url('assets/img/images04@2.jpg')] bg-primary-300"></div> <div class="flex flex-col gap-[4vh] md:gap-10 max-w-screen-lg mx-auto mt-[2vh]"> <p class="z-20 text-lg md:text-3xl leading-none font-bold text-primary-800">
#03
</p> <div class="flex flex-col-reverse md:flex-row justify-center md:mt-20 gap-[4vh] md:gap-10"> <div class="z-20 grid grid-cols-2 gap-2 basis-1/2"> <img src="assets/services/ep1.jpg" class="w-[100%] aspect-square object-cover"> <img src="assets/services/ep2.jpg" class="w-[100%] aspect-square object-cover"> <img src="assets/services/ep3.jpg" class="w-[100%] aspect-square object-cover"> <img src="assets/services/ep4.jpg" class="w-[100%] aspect-square object-cover"> </div> <div class="z-20 flex flex-col gap-[4vh] md:gap-6 basis-1/2"> <h2 class="text-lg md:text-3xl uppercase inline-block text-primary-800 font-bold">
Event Planning and Management
</h2> <p class="text-base">
From medical conferences to health awareness campaigns, our event
              planning and management services are designed to ensure your
              events are flawlessly executed and leave a lasting impression on
              attendees.
</p> </div> </div> </div> </section> <!-- //section3 --> <section id="section4" class="parallax__item w-full h-screen relative flex flex-col p-4"> <div class="absolute left-0 top-0 w-full h-screen bg-cover bg-center bg-[url('assets/img/images05@2.jpg')] bg-primary-400"></div> <div class="flex flex-col gap-[4vh] md:gap-10 max-w-screen-lg mx-auto mt-[2vh]"> <p class="z-20 text-lg md:text-3xl leading-none font-bold text-primary-800">
#04
</p> <div class="flex flex-col-reverse md:flex-row justify-center md:mt-20 gap-[4vh] md:gap-10"> <div class="z-20 basis-1/2"> <img src="assets/services/com1.jpg" class="w-[100%] aspect-square object-cover"> </div> <div class="z-20 flex flex-col gap-[4vh] md:gap-6 basis-1/2"> <h2 class="text-lg md:text-3xl uppercase inline-block text-primary-800 font-bold">
Community Management
</h2> <p class="text-base">
Build and nurture a vibrant online community with our dedicated
              community management services. We manage your forums, social media
              groups, and patient networks, fostering a supportive and
              informative environment for all members.
</p> </div> </div> </div> </section> <!-- //section4 --> <section id="section5" class="parallax__item w-full h-screen relative flex flex-col p-4"> <div class="absolute left-0 top-0 w-full h-screen bg-cover bg-center bg-[url('assets/img/images06@2.jpg')] bg-primary-500"></div> <div class="flex flex-col gap-[4vh] md:gap-10 max-w-screen-lg mx-auto mt-[2vh]"> <p class="z-20 text-lg md:text-3xl leading-none font-bold text-primary-200">
#05
</p> <div class="flex flex-col-reverse md:flex-row justify-center md:mt-20 gap-[4vh] md:gap-10"> <div class="z-20 grid grid-cols-2 gap-2 basis-1/2"> <img src="assets/services/vppp1.jpg" class="w-[100%] aspect-square object-cover"> <img src="assets/services/vppp2.jpg" class="w-[100%] aspect-square object-cover"> <img src="assets/services/vppp3.jpg" class="w-[100%] aspect-square object-cover"> <img src="assets/services/vppp4.jpg" class="w-[100%] aspect-square object-cover"> </div> <div class="z-20 flex flex-col gap-[4vh] md:gap-6 basis-1/2"> <h2 class="text-lg md:text-3xl uppercase inline-block text-primary-200 font-bold">
Video Production and Product Photography
</h2> <p class="text-base">
Showcase your services and products with high-quality video
              production and photography. Our team produces professional visual
              content that highlights the unique aspects of your healthcare
              offerings, boosting your brand's visual appeal.
</p> </div> </div> </div> </section> <!-- //section5 --> <section id="section6" class="parallax__item w-full h-screen relative flex flex-col p-4"> <div class="absolute left-0 top-0 w-full h-screen bg-cover bg-center bg-[url('assets/img/images07@2.jpg')] bg-primary-600"></div> <div class="flex flex-col gap-[4vh] md:gap-10 max-w-screen-lg mx-auto mt-[2vh]"> <p class="z-20 text-lg md:text-3xl leading-none font-bold text-primary-200">
#06
</p> <div class="flex flex-col-reverse md:flex-row justify-center md:mt-20 gap-[4vh] md:gap-10"> <div class="z-20 basis-1/2"> <img src="assets/services/mb1.png" class="w-[100%] aspect-square object-cover"> </div> <div class="z-20 flex flex-col gap-[4vh] md:gap-6 basis-1/2"> <h2 class="text-lg md:text-3xl uppercase inline-block text-primary-200 font-bold">
Media Buying
</h2> <p class="text-base">
Maximize your advertising budget with our expert media buying
              services. We strategically purchase ad spaces that reach your
              target audience, ensuring optimal exposure and return on
              investment for your healthcare campaigns.
</p> </div> </div> </div> </section> <!-- //section6 --> <section id="section7" class="parallax__item w-full h-screen relative flex flex-col p-4"> <div class="absolute left-0 top-0 w-full h-screen bg-cover bg-center bg-[url('assets/img/images08@2.jpg')] bg-primary-700"></div> <div class="flex flex-col gap-[4vh] md:gap-10 max-w-screen-lg mx-auto mt-[2vh]"> <p class="z-20 text-lg md:text-3xl leading-none font-bold text-primary-200">
#07
</p> <div class="flex flex-col-reverse md:flex-row justify-center md:mt-20 gap-[4vh] md:gap-10"> <div class="z-20 grid grid-cols-2 gap-2 basis-1/2"> <img src="assets/services/tm1.jpg" class="w-[100%] aspect-square object-cover"> <img src="assets/services/tm4.jpg" class="w-[100%] aspect-square object-cover"> <img src="assets/services/tm2.jpg" class="w-[100%] aspect-square object-cover"> <img src="assets/services/tm3.jpg" class="w-[100%] aspect-square object-cover"> </div> <div class="z-20 flex flex-col gap-[4vh] md:gap-6 basis-1/2"> <h2 class="text-lg md:text-3xl uppercase inline-block text-primary-200 font-bold">
Talent Management
</h2> <p class="text-base text-white">
Enhance your healthcare practice with our talent management
              services. We help you find, recruit, and retain top medical
              professionals and influencers, ensuring your team is composed of
              the best talent in the industry.
</p> </div> </div> </div> </section> <!-- //section7 --> <section id="section8" class="parallax__item w-full h-screen relative flex flex-col p-4"> <div class="absolute left-0 top-0 w-full h-screen bg-cover bg-center bg-[url('assets/img/images09@2.jpg')] bg-primary-800"></div> <div class="flex flex-col gap-[4vh] md:gap-10 max-w-screen-lg mx-auto mt-[2vh]"> <p class="z-20 text-lg md:text-3xl leading-none font-bold text-primary-200">
#08
</p> <div class="flex flex-col-reverse md:flex-row justify-center md:mt-20 gap-[4vh] md:gap-10"> <div class="z-20 basis-1/2"> <img src="assets/services/wd1.jpg" class="w-[100%] aspect-square object-cover"> </div> <div class="z-20 flex flex-col gap-[4vh] md:gap-6 basis-1/2"> <h2 class="text-lg md:text-3xl uppercase inline-block text-primary-200 font-bold">
Web Development
</h2> <p class="text-base text-white">
Dr. Nathan specializes in creating state-of-the-art websites
              tailored specifically for healthcare professionals and
              organizations. We build responsive, secure, and user-friendly
              websites that enhance patient engagement and showcase your
              expertise.
</p> </div> </div> </div> </section> <!-- //section8 --> <!-- <section
      id="section9"
      class="parallax__item w-full h-screen relative flex flex-col p-4"
    >
      <span class="absolute right-5 bottom-5 text-lg md:text-3xl leading-none z-10 font-bold"
        >#09</span
      >
      <div
        class="absolute left-0 top-0 w-full h-screen bg-cover bg-center bg-[url('assets/img/images10@2.jpg')] bg-primary-900"
      >
      </div>
      <h2 class="text-lg md:text-3xl font-bold z-20 uppercase inline-block">More</h2>
    </section> --> <!-- //section9 --> </div> </div> ${renderScript($$result, "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/components/home/Service.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/components/home/Service.astro", void 0);

const $$ContactUs = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="contact_us" class="p-4 py-24 flex flex-col gap-2 max-w-screen-md mx-auto"> <div class="flex flex-col gap-4"> <p class="text-sm text-slate-400">Contact Us</p> <p class="text-4xl tracking-wide">We'd love to hear from you.</p> <p class="text-base font-thin">
Have questions or feedback? We're here to help. Send us a message.
</p> </div> <form class="mt-10 flex flex-col gap-4 md:gap-8" action="https://formspree.io/f/xnnaazew" method="POST"> <!-- <input type="hidden" name="_next" value="https://dr-nathan.vercel.app/" />
    <input type="hidden" name="_template" value="box" />
    <input type="hidden" name="_subject" value="New Client Message" /> --> <div class="flex flex-row gap-4 md:gap-8"> <input type="text" name="Name" placeholder="Name" class="block w-full p-4 text-gray-900 border rounded-lg bg-gray-50 text-base focus:ring-primary-700"> <input type="text" name="Email" placeholder="Email" class="block w-full p-4 text-gray-900 border rounded-lg bg-gray-50 text-base focus:ring-primary-700"> </div> <textarea id="message" rows="8" name="Message" class="block p-4 w-full text-base text-gray-900 bg-gray-50 rounded-lg border focus:ring-primary-700" placeholder="Write your message here..."></textarea> <div> <button type="submit" class="text-white bg-primary-900 hover:bg-primary-800 focus:ring-4 focus:ring-primary-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none">Send Message</button> </div> </form> </div>`;
}, "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/components/home/ContactUs.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="py-24"> <div class="flex flex-col max-w-screen-xl mx-auto gap-6 p-4"> <div class="flex flex-col md:flex-row justify-between gap-10"> <img src="/assets/logo/logo.png" class="h-16 w-16 object-contain" alt="Dr. Nathan Logo"> <div class="flex flex-row gap-4 md:gap-14"> <div class="flex flex-col gap-2"> <p class="text-base font-semibold tracking-wide">Socials</p> <a href="https://www.facebook.com/drnathandigitalmarketing?mibextid=LQQJ4d" class="text-base tracking-wide">Facebook</a> <a href="https://www.linkedin.com/company/dr-nathan-marketing-and-consultancy/" class="text-base tracking-wide">Linkedin</a> <a href="https://www.tiktok.com/@dr.nathanmarketing?_t=8kGJhb2YKfa" class="text-base tracking-wide">Tiktok</a> </div> <div class="flex flex-col gap-2"> <p class="text-base font-semibold tracking-wide">Contact Us</p> <p class="text-base tracking-wide">+95 9 776 299 099</p> <p class="text-base tracking-wide">info@drnathanmarketing.com</p> <p class="text-base tracking-wide">
No. 143, Botahtaung Pagoda Road, <br>Botahtaung Township, Yangon
</p> </div> </div> </div> <hr> <p class="text-xs text-slate-400">
© 2024 Dr. Nathan Marketing & Consultancy.
</p> </div> </div>`;
}, "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/components/common/Footer.astro", void 0);

const AccordionCard = ({ title, answer, index, value, callback }) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("h2", { children: /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => callback(index),
        type: "button",
        className: "flex items-center justify-between w-full py-5 font-medium rtl:text-right border-b border-gray-200 gap-3",
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-base font-[500] text-start", children: title }),
          /* @__PURE__ */ jsx(
            "svg",
            {
              "data-accordion-icon": true,
              className: `w-3 h-3 ${!(index === value) && "rotate-180"} shrink-0`,
              "aria-hidden": "true",
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 10 6",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  stroke: "currentColor",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "2",
                  d: "M9 5 5 1 1 5"
                }
              )
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `mb-2 text-gray-700 text-sm tracking-[0.2px] text-start overflow-hidden mt-4 transition-all duration-300 ease-in-out ${value === index ? "max-h-[100rem]" : "max-h-[0rem]"}`,
        children: answer?.split("\n").map((a) => /* @__PURE__ */ jsx("p", { children: a }, a))
      }
    )
  ] });
};

const FAQ = () => {
  const [show, setShow] = useState(void 0);
  const onAccordionChange = (index) => setShow((prev) => prev === index ? void 0 : index);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      id: "faq",
      className: "max-w-screen-xl mx-auto p-4 py-40 flex flex-col md:flex-row gap-4",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 basis-1/2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400", children: "FAQs" }),
          /* @__PURE__ */ jsx("p", { className: "text-4xl tracking-wide", children: "You have Questions?" }),
          /* @__PURE__ */ jsx("p", { className: "text-base font-thin", children: "We have answers. For more inquiries, contact us." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "basis-1/2", children: [
          /* @__PURE__ */ jsx(
            AccordionCard,
            {
              title: "What services do you offer?",
              answer: "We offer marketing strategies and solutions, both digital and on-ground, tailored to your branding perspective and business plan.",
              index: 0,
              value: show,
              callback: onAccordionChange
            }
          ),
          /* @__PURE__ */ jsx(
            AccordionCard,
            {
              title: "Do you offer customized marketing strategies?",
              answer: "Yes, you can request us to create a customized marketing package based on your business plan and budget.",
              index: 1,
              value: show,
              callback: onAccordionChange
            }
          ),
          /* @__PURE__ */ jsx(
            AccordionCard,
            {
              title: "What industries do you specialize in?",
              answer: "Currently, we exclusively specialize in the healthcare industry.",
              index: 2,
              value: show,
              callback: onAccordionChange
            }
          ),
          /* @__PURE__ */ jsx(
            AccordionCard,
            {
              title: "What is your pricing structure?",
              answer: "We have created a standard rate card for different business categories.",
              index: 3,
              value: show,
              callback: onAccordionChange
            }
          ),
          /* @__PURE__ */ jsx(
            AccordionCard,
            {
              title: "What is your process for working with clients?",
              answer: "1) Initial consultation to understand client goals. 2) Research target audience and industry trends. 3) Develop tailored digital marketing strategy. 4) Implement campaigns across relevant channels. 5) Monitor and analyze campaign performance. 6) Regular reporting and communication with the client. 7) Adjust strategies based on feedback and results.",
              index: 4,
              value: show,
              callback: onAccordionChange
            }
          )
        ] })
      ]
    }
  );
};

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Hero", $$Hero, {})} ${renderComponent($$result2, "AboutUs", $$AboutUs, {})} ${renderComponent($$result2, "WhyUs", $$WhyUs, {})} ${renderComponent($$result2, "Service", $$Service, {})} ${renderComponent($$result2, "FAQ", FAQ, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@components/home/FAQ", "client:component-export": "default" })} ${renderComponent($$result2, "ContactUs", $$ContactUs, {})} ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/pages/index.astro", void 0);

const $$file = "/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
