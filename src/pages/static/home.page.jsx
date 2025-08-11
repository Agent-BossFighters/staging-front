import { AgentLogo, IntuitionLogo, Alchemists, A, BossFighters, THP } from "@img/index";


export default function HomePage() {
  return (
    <div className="w-5/6 mx-auto">
      <div className="flex flex-col text-center items-center justify-center my-24">
        <img src={AgentLogo} alt="Agent Logo" className="w-[400px]" />
        <p className="text-s font-extrabold">
          Boss Fighters community&#39;s Open Source Platform
        </p>      
      </div>
      <div className="flex flex-col text-center items-center justify-center my-24">
        <p className="text-justify max-w-5xl">
          Built for and by the Boss Fighters community via Open Source
          contributions and/or feedback or improvements seen together, the
          platform offers complementary tools for understanding and managing
          Boss Fighters as well as for content creation. All stakeholders are
          included in the target user (players, content creators, investors,
          player board members and Boss Fighters Studio) to help improve the
          game and the community.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-x-24 gap-y-16 mt-24 mb-20">
        <div className="flex flex-col items-center basis-full max-w-6xl mb-20">
          <div className="flex flex-row justify-center items-center mb-6 md:mb-12">
            <h2 className="text-4xl md:text-6xl font-bold">
              P
            </h2>
            <img src={A} alt="A" className="w-14 h-14 translate-y-2" />
            <h2 className="text-4xl md:text-6xl font-bold">
              RTNERS
            </h2>
          </div>
          <div className="flex flex-wrap gap-x-20 gap-y-6 justify-center items-center basis-full max-w-6xl">
            <div className="flex flex-col items-center w-5/6 max-w-md">
              <div className="h-[120px] flex items-center">
                <img src={BossFighters} alt="BossFighters" className="w-13 h-13" />
              </div>
              <p className="text-justify">
              The Boss Fighters team is an official partner of its community platform. 
              It will offer rewards to be won during various events that will be organized, 
              as well as each month for one randomly selected user who has met the conditions.
              </p>
            </div>
            <div className="flex flex-col items-center w-5/6 max-w-md">
              <div className="h-[120px] flex items-center">
                <img src={THP} alt="Thp" className="w-20 h-20" />
              </div>
              <p className="text-justify">
                "THP.Box" is a decentralized open collective, bootstrapped by "The Hacking 
                Project" students of the development bootcamp, experimenting on innovative 
                product development to validate their training during an internship.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center md:basis-[45%] max-w-md mb-20">
          <div className="flex flex-row justify-center items-center md:mb-16">
            <img src={A} alt="A" className="w-14 h-14 translate-y-2" />
            <h2 className="text-4xl md:text-6xl font-bold">
              MBASSADOR
            </h2>
          </div>
          <div className="flex flex-col items-center gap-4 mx-2">
            <div className="h-[120px] flex items-center">
              <img src={Alchemists} alt="Alchemists" className="w-13 h-13" />
            </div>
            <p className="text-justify">
              "The Alchemists" guild, present since Boss Fighters inception, is focusing on  
              improving the user experience of web3 games by proposing improvements 
              and creating content. 
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center md:basis-[45%] max-w-md">
          <div className="flex flex-row justify-center items-center md:mb-16">
            <img src={A} alt="A" className="w-14 h-14 translate-y-2" />
            <h2 className="text-4xl md:text-6xl font-bold">
              TTESTATIONS
            </h2>
          </div>
          <div className="flex flex-col items-center gap-4 mx-2">
            <div className="h-[120px] flex items-center">
              <img src={IntuitionLogo} alt="Intuition" className="w-13 h-13" />
            </div>  
            <p className="text-justify">
              Decentralized technology that enables users to create attestations on any 
              subject, stored in a navigable, searchable and verifiable way. Feature for Boss 
              Fighters community will be available in a next iteration.
            </p>
          </div>
        </div>
      </div> 
      
    </div>
  );
}
