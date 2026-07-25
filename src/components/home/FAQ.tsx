import AccordionCard from "@components/common/AccordionCard.jsx";
import { useEffect, useRef, useState } from "react";
import { revealOnScroll } from "src/utils/animations";

const faqs = [
  {
    q: "What services do you offer?",
    a: "We offer marketing strategies and solutions, both digital and on-ground, tailored to your branding perspective and business plan.",
  },
  {
    q: "Do you offer customized marketing strategies?",
    a: "Yes, you can request us to create a customized marketing package based on your business plan and budget.",
  },
  {
    q: "What industries do you specialize in?",
    a: "Currently, we exclusively specialize in the healthcare industry.",
  },
  {
    q: "What is your pricing structure?",
    a: "We have created a standard rate card for different business categories.",
  },
  {
    q: "What is your process for working with clients?",
    a: "1) Initial consultation to understand client goals. 2) Research target audience and industry trends. 3) Develop tailored digital marketing strategy. 4) Implement campaigns across relevant channels. 5) Monitor and analyze campaign performance. 6) Regular reporting and communication with the client. 7) Adjust strategies based on feedback and results.",
  },
];

const FAQ = () => {
  const [show, setShow] = useState<number | undefined>(undefined);
  const rootRef = useRef<HTMLDivElement>(null);

  const onAccordionChange = (index: number) =>
    setShow((prev) => (prev === index ? undefined : index));

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    revealOnScroll(el.querySelectorAll<HTMLElement>(".faq-reveal"), { y: 22, stagger: 0.1 });
    revealOnScroll(el.querySelectorAll<HTMLElement>(".faq-item"), { y: 26, stagger: 0.08 });
  }, []);

  return (
    <section id="faq" className="bg-white">
      <div
        ref={rootRef}
        className="section-pad shell grid lg:grid-cols-[0.8fr_1.2fr] gap-14 lg:gap-24"
      >
        {/* Left: sticky intro */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="faq-reveal flex items-center gap-4 mb-8">
            <span className="h-px w-10 bg-primary-500" />
            <p className="eyebrow font-helvetica text-primary-600">
              FAQ
            </p>
          </div>
          <h2 className="faq-reveal font-helvetica text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-[1.15] sm:leading-[1.1] tracking-tight mb-6">
            You have questions.
          </h2>
          <p className="faq-reveal font-roboto text-sm lg:text-base text-slate-500 leading-relaxed max-w-sm">
            We have answers. If there's anything else on your mind, we're only one message away.
          </p>
        </div>

        {/* Right: accordion */}
        <div className="flex flex-col">
          {faqs.map((item, i) => (
            <div className="faq-item" key={item.q}>
              <AccordionCard
                title={item.q}
                answer={item.a}
                index={i}
                value={show}
                callback={onAccordionChange}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
