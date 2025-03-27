import data from "@shared/data/policy.json";
import { A } from "@img/index";

const privacy = data.privacy;

export default function PrivacyPage() {
  return (
    <div className="w-3/4 mx-auto">
      <div className="flex flex-col items-center justify-center pt-9">
        <h1 className="flex items-center justify-center font-extrabold text-4xl lg:text-6xl">
          PRIV
          <img src={A} alt="A" className="w-14 lg:w-20 h-14 lg:h-20" />
          CY POLICY
        </h1>
        <p className="text-sm ps-9 lg:-translate-y-3">
          Last updated: February 14, 2023
        </p>
      </div>
      {privacy.map((section, index) => (
        <div key={index} className="pb-9">
          <h2 className="text-2xl font-bold pt-10">
            {index + 1}.{section.title}
          </h2>
          <p>{section.content}</p>
          {section.sections && (
            <ul className="list-none ps-9">
              {section.sections.map((subsection, subIndex) => (
                <li key={subIndex} className="">
                  <h3 className="font-bold">
                    {String.fromCharCode(97 + subIndex).toUpperCase()}.
                    {subsection.title}
                  </h3>
                  <p>{subsection.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
