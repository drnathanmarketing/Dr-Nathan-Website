import React, { useState } from 'react';
import { PortableText } from '@portabletext/react';

export default function VacanciesList({ vacanciesData }) {
  const [openIndex, setOpenIndex] = useState(null);

  let vacancies = [];
  try {
    vacancies = typeof vacanciesData === 'string' ? JSON.parse(vacanciesData) : vacanciesData;
  } catch (e) {
    console.error("Error parsing vacancies data", e);
  }

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const portableTextComponents = {
    block: {
      normal: ({ children }) => <p className="mb-4 text-slate-600 leading-relaxed text-sm font-roboto">{children}</p>,
      h3: ({ children }) => <h3 className="mt-8 mb-4 text-lg font-bold text-slate-900 font-helvetica">{children}</h3>,
      h4: ({ children }) => <h4 className="mt-6 mb-3 text-base font-bold text-slate-800 font-helvetica">{children}</h4>,
    },
    list: {
      bullet: ({ children }) => <ul className="list-disc pl-5 mb-6 space-y-2 text-slate-600 text-sm font-roboto">{children}</ul>,
      number: ({ children }) => <ol className="list-decimal pl-5 mb-6 space-y-2 text-slate-600 text-sm font-roboto">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li className="pl-1">{children}</li>,
      number: ({ children }) => <li className="pl-1">{children}</li>,
    },
    marks: {
      strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
      em: ({ children }) => <em className="italic text-slate-700">{children}</em>,
    },
  };

  return (
    <div className="flex flex-col gap-6">
      {vacancies.map((job, index) => {
        const isOpen = openIndex === index;

        return (
          <div 
            key={job._id || index} 
            className="bg-white rounded-xl overflow-hidden border border-white transition-all duration-300 hover:border-primary-100 shadow-2xl shadow-slate-900/10"
          >
            {/* Header (Always Visible) */}
            <button 
              onClick={() => handleToggle(index)}
              className="w-full text-left p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer focus:outline-none focus:bg-slate-50 transition-colors"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-primary-50 text-primary-600 text-[0.65rem] font-bold tracking-widest uppercase rounded-full border border-primary-100">
                    {job.department}
                  </span>
                  <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[0.65rem] font-bold tracking-widest uppercase rounded-full border border-slate-200">
                    {job.employmentType}
                  </span>
                  {job.location && (
                     <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[0.65rem] font-bold tracking-widest uppercase rounded-full border border-slate-200">
                      {job.location}
                    </span>
                  )}
                </div>
                <h3 className="font-helvetica text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                  {job.jobTitle}
                </h3>
              </div>
              
              <div className="flex items-center gap-4 text-slate-500">
                <span className="text-sm font-semibold tracking-wide uppercase hidden md:block">
                  {isOpen ? "Close Details" : "View Role"}
                </span>
                <svg 
                  className={`w-6 h-6 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary-600" : ""}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </button>

            {/* Expanded Content */}
            <div 
              className={`grid transition-all duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50/50">
                  
                  {/* Summary */}
                  {job.summary && (
                    <p className="text-slate-700 text-base md:text-lg leading-relaxed mb-8 font-roboto border-l-2 border-primary-500 pl-4">
                      {job.summary}
                    </p>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Description */}
                    <div className="lg:col-span-2">
                      {job.description && (
                        <div className="mb-10">
                          <h4 className="font-helvetica text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-4 border-b border-slate-200 pb-2">The Role</h4>
                          <PortableText value={job.description} components={portableTextComponents} />
                        </div>
                      )}
                    </div>

                    {/* Right Column: Requirements & Info */}
                    <div className="space-y-10">
                      
                      {job.salaryRange && (
                        <div>
                          <h4 className="font-helvetica text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-3 border-b border-slate-200 pb-2">Compensation</h4>
                          <p className="text-slate-800 text-sm font-semibold">{job.salaryRange}</p>
                        </div>
                      )}

                      {job.requirements?.length > 0 && (
                        <div>
                          <h4 className="font-helvetica text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-4 border-b border-slate-200 pb-2">Requirements</h4>
                          <ul className="space-y-3">
                            {job.requirements.map((req, i) => (
                              <li key={i} className="flex gap-3 text-slate-600 text-sm font-roboto items-start">
                                <svg className="w-5 h-5 text-primary-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {job.niceToHave?.length > 0 && (
                        <div>
                          <h4 className="font-helvetica text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-4 border-b border-slate-200 pb-2">Bonus Points</h4>
                          <ul className="space-y-3">
                            {job.niceToHave.map((req, i) => (
                              <li key={i} className="flex gap-3 text-slate-500 text-sm font-roboto items-start">
                                <svg className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {job.whatWeOffer?.length > 0 && (
                        <div>
                          <h4 className="font-helvetica text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-4 border-b border-slate-200 pb-2">What We Offer</h4>
                          <ul className="space-y-3">
                            {job.whatWeOffer.map((offer, i) => (
                              <li key={i} className="flex gap-3 text-slate-600 text-sm font-roboto items-start">
                                <span className="text-primary-500 shrink-0">✦</span>
                                <span>{offer}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="mt-10 pt-8 border-t border-slate-200 text-center md:text-left">
                    <a 
                      href="#apply" 
                      onClick={(e) => {
                        const select = document.querySelector('select[name="role"]');
                        if (select) select.value = job.jobTitle;
                      }} 
                      className="inline-flex items-center gap-3 px-8 py-4 bg-primary-600 text-white font-helvetica text-sm font-bold tracking-widest uppercase rounded-sm hover:bg-primary-700 transition-colors shadow-lg shadow-primary-900/20 group"
                    >
                      Apply for this position
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </a>
                  </div>

                </div>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}
