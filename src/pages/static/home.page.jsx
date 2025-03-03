import { AgentLogo, Thp, Intuition, Alchemists, A } from "@img/index";
export default function HomePage() {
  return (
    <div className="w-5/6 mx-auto">
      <div className="flex flex-col text-center items-center justify-center my-24">
        <img src={AgentLogo} alt="Agent Logo" className="md:w-1/5" />
        <p className="text-sm font-extrabold">
          Boss Figthers community&#39;s Open Source Platform
        </p>
      </div>
      <div className="w-3/5 mx-auto">
        <p>
          Built for and by the Boss Fighters community via Open Source
          contributions and/or feedback or improvements seen together, the
          platform offers complementary tools for understanding and managing
          Boss Fighters as well as for content creation. All stakeholders are
          included in the target user (players, content creators, investors,
          player board members and Boss Fighters Studio) to help improve the
          game and the community.
        </p>
      </div>
      <div className="flex w-full justify-center gap-6 my-24">
        <div className="lg:w-1/3 flex flex-col items-center justify-center">
          <h2 className="text-6xl font-bold flex items-end mb-24">
            P
            <span>
              <img src={A} alt="A" className="w-14 h-14 translate-y-2" />
            </span>
            RTNERS
          </h2>
          <div className="flex flex-col items-center mb-16 gap-4">
            <img src={Thp} alt="Thp" className="w-13 h-13" />
            <p>
              "The Hacking Project" decentralized training center (students
              internship)
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-4xl font-bold flex items-center gap-6">
              <img src={Intuition} alt="Intuition" className="w-13 h-13" />
              Intuition
            </h3>
            <p>
              Decentralized technology that enables users to create attestations
              on any subject, stored in a navigable, searchable and verifiable
              way.
            </p>
          </div>
        </div>
        <div className="lg:w-1/3 flex flex-col items-center">
          <h2 className="text-6xl font-bold flex items-end mb-16">
            <span>
              <img src={A} alt="A" className="w-14 h-14 translate-y-2" />
            </span>
            MBASSADOR
          </h2>
          <div className="flex flex-col items-center gap-4">
            <img src={Alchemists} alt="Alchemists" className="w-13 h-13" />
            <p>"The Alchemists" guild present since Boss Fighters inception</p>
          </div>
        </div>
      </div>
    </div>
  );
}
