const AccordionCard = ({ title, answer, index, value, callback }) => {
  const open = value === index;
  const num = String(index + 1).padStart(2, "0");

  return (
    <div className="group border-b border-slate-200">
      <button
        onClick={() => callback(index)}
        type="button"
        aria-expanded={open}
        className="flex w-full items-center gap-5 py-6 text-left"
      >
        <span
          className={`font-helvetica text-sm font-bold tabular-nums transition-colors duration-300 ${
            open ? "text-primary-600" : "text-slate-300"
          }`}
        >
          {num}
        </span>
        <span
          className={`flex-1 font-helvetica text-base lg:text-lg font-semibold leading-snug transition-colors duration-300 ${
            open ? "text-primary-700" : "text-slate-800 group-hover:text-primary-700"
          }`}
        >
          {title}
        </span>
        <span
          className={`relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            open ? "border-primary-500 bg-primary-50" : "border-slate-200 group-hover:border-primary-300"
          }`}
        >
          {/* horizontal bar (always) */}
          <span
            className={`absolute h-[1.5px] w-3.5 rounded transition-colors duration-300 ${
              open ? "bg-primary-600" : "bg-slate-500"
            }`}
          />
          {/* vertical bar (hides on open → makes a minus) */}
          <span
            className={`absolute h-3.5 w-[1.5px] rounded bg-slate-500 transition-all duration-300 ${
              open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
            }`}
          />
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pl-10 pr-4 pb-7 font-roboto text-sm text-slate-500 leading-relaxed space-y-2">
            {answer?.split("\n").map((a) => (
              <p key={a}>{a}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccordionCard;
