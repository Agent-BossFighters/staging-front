import { AgentLogo, Thp, IntuitionLogo, Alchemists, A } from "@img/index";
import WalletConnector from "@features/wallet/WalletConnector";

export default function HomePage() {
  return (
    <div className="w-5/6 mx-auto">
      <div className="flex flex-col text-center items-center justify-center my-24">
        <img src={AgentLogo} alt="Agent Logo" className="w-[400px]" />
        <p className="text-s font-extrabold">
          Boss Fighters community&#39;s Open Source Platform
        </p>
        
      </div>
      <div className="w-4/5 mx-auto max-lg:w-2/3">
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
      <div className="flex w-full justify-center gap-36 mt-24 mb-12 max-lg:flex-col max-lg:gap-12">
        <div className="flex flex-col items-center mb-20 w-1/3 mx-auto max-lg:w-2/3">
          <div className="flex flex-row items-center mb-12">
            <h2 className="text-6xl font-bold">
              P
            </h2>
            <img src={A} alt="A" className="w-14 h-14 translate-y-2" />
            <h2 className="text-6xl font-bold">
              RTNERS
            </h2>
          </div>
          <div className="flex flex-col items-center mb-16 mx-2 gap-4">
            <div className="h-[120px] flex items-center">
              <img src={Thp} alt="Thp" className="w-13 h-13" />
            </div>
            <p className="text-justify">
              "THP Lab" is a decentralized open collective, bootstrapped by "The Hacking 
              Project" students of the development bootcamp, experimenting on innovative 
              product development.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center mb-20 w-1/3 mx-auto max-lg:w-2/3">
          <div className="flex flex-row items-center mb-12">
            <img src={A} alt="A" className="w-14 h-14 translate-y-2" />
            <h2 className="text-6xl font-bold">
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
      </div> 
      <div className="flex flex-col items-center mb-20 w-1/3 mx-auto max-lg:w-2/3">
        <div className="flex flex-row items-center mb-16">
          <img src={A} alt="A" className="w-14 h-14 translate-y-2" />
          <h2 className="text-6xl font-bold">
            TTESTATIONS
          </h2>
        </div>
        <div className="flex flex-col items-center mb-16 mx-2 gap-6">
          <img src={IntuitionLogo} alt="Intuition" className="w-13 h-13" />
          <p className="text-justify">
            Decentralized technology that enables users to create attestations on any 
            subject, stored in a navigable, searchable and verifiable way. Feature for Boss 
            Fighters community will be available in a next iteration.
          </p>
        </div>
      </div>
    </div>
  );
}
