import data from "@shared/data/policy.json";

const terms = data.terms;

export default function PrivacyPage() {
  return (
    <div className="w-3/4 mx-auto">
      <div className="flex flex-col items-center justify-center pt-9">
        <h1 className="flex items-center justify-center font-extrabold text-4xl lg:text-6xl pb-4">
          TERMS & CONDITIONS
        </h1>
        <p className="text-sm ps-9 lg:-translate-y-3">
          Last updated: February 14, 2023
        </p>
      </div>
      {terms.map((section, index) => (
        <div key={index} className="pb-9">
          <h2 className="text-2xl font-bold pt-10">
            {index + 1}. {section.title}
          </h2>
          <p className="whitespace-pre-line">{section.content}</p>
          {section.list && (
            <ul className="list-disc list-inside ps-9">
              {section.list.map((item, itemIndex) => (
                <li key={itemIndex}>
                  {item.term ? (
                    <span className="font-bold">{item.term} :</span>
                  ) : null}
                  {item.definition}
                </li>
              ))}
            </ul>
          )}
          {section.footer ? <p>{section.footer}</p> : null}
          {section.sections && (
            <>
              {section.sections.map((subsection, subIndex) => (
                <div key={subIndex} className="ps-9">
                  <h3 className="font-bold">
                    {String.fromCharCode(97 + subIndex).toUpperCase()}.&nbsp;
                    {subsection.title}
                  </h3>
                  <p>{subsection.content}</p>
                  {subsection.list && (
                    <ul className="list-disc list-inside ps-9">
                      {subsection.list.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          {item.term ? (
                            <span className="font-bold">{item.term} :</span>
                          ) : null}
                          {item.definition}
                        </li>
                      ))}
                    </ul>
                  )}
                  {subsection.sections && (
                    <ul>
                      {subsection.sections.map((subsubsection, subsubIndex) => (
                        <li key={subsubIndex} className="pt-1">
                          {subsubsection.title ? (
                            <span className="font-bold">
                              {subsubsection.title} :<br />
                            </span>
                          ) : null}
                          {subsubsection.content}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
