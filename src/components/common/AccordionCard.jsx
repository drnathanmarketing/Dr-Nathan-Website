const AccordionCard = ({ title, answer, index, value, callback }) => {
  return (
    <>
      <h2>
        <button
          onClick={() => callback(index)}
          type="button"
          className="flex items-center justify-between w-full py-5 font-medium rtl:text-right border-b border-gray-200 gap-3"
        >
          <span className="text-base font-[500] text-start">{title}</span>
          <svg
            data-accordion-icon
            className={`w-3 h-3 ${!(index === value) && "rotate-180"} shrink-0`}
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
              d="M9 5 5 1 1 5"
            ></path>
          </svg>
        </button>
      </h2>

      <div
        className={`mb-2 text-gray-700 text-sm tracking-[0.2px] text-start overflow-hidden mt-4 transition-all duration-300 ease-in-out ${
          value === index ? "max-h-[100rem]" : "max-h-[0rem]"
        }`}
      >
        {answer?.split("\n").map((a) => (
          <p key={a}>{a}</p>
        ))}
      </div>
    </>
  );
};

export default AccordionCard;
