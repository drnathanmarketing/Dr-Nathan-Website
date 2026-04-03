import AccordionCard from "@components/common/AccordionCard";
import { useState } from "react";

const FAQ = () => {
  const [show, setShow] = useState<number | undefined>(undefined);

  const onAccordionChange = (index: number) =>
    setShow((prev) => (prev === index ? undefined : index));

  return (
    <div
      id="faq"
      className="max-w-screen-xl mx-auto p-4 py-40 flex flex-col md:flex-row gap-4"
    >
      <div className="flex flex-col gap-4 basis-1/2">
        <p className="text-sm text-slate-400">FAQs</p>
        <p className="text-4xl tracking-wide">You have Questions?</p>
        <p className="text-base font-thin">
          We have answers. For more inquiries, contact us.
        </p>
      </div>
      <div className="basis-1/2">
        <AccordionCard
          title="What services do you offer?"
          answer="We offer marketing strategies and solutions, both digital and on-ground, tailored to your branding perspective and business plan."
          index={0}
          value={show}
          callback={onAccordionChange}
        />
        <AccordionCard
          title="Do you offer customized marketing strategies?"
          answer="Yes, you can request us to create a customized marketing package based on your business plan and budget."
          index={1}
          value={show}
          callback={onAccordionChange}
        />
        <AccordionCard
          title="What industries do you specialize in?"
          answer="Currently, we exclusively specialize in the healthcare industry."
          index={2}
          value={show}
          callback={onAccordionChange}
        />
        <AccordionCard
          title="What is your pricing structure?"
          answer="We have created a standard rate card for different business categories."
          index={3}
          value={show}
          callback={onAccordionChange}
        />
        <AccordionCard
          title="What is your process for working with clients?"
          answer="1) Initial consultation to understand client goals. 2) Research target audience and industry trends. 3) Develop tailored digital marketing strategy. 4) Implement campaigns across relevant channels. 5) Monitor and analyze campaign performance. 6) Regular reporting and communication with the client. 7) Adjust strategies based on feedback and results."
          index={4}
          value={show}
          callback={onAccordionChange}
        />
      </div>
    </div>
  );
};

export default FAQ;
