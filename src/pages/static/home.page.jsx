import { AgentLogo, Thp, IntuitionLogo, Alchemists, A } from "@img/index";
import WalletConnector from "@features/wallet/WalletConnector";

export default function HomePage() {
  return (
    <div className="w-5/6 mx-auto">
      <div className="flex flex-col text-center items-center justify-center my-24">
        <img src={AgentLogo} alt="Agent Logo" className="md:w-1/5" />
        <p className="text-s font-extrabold">
          Boss Fighters community&#39;s Open Source Platform
        </p>
        
        <WalletConnector />
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
      <div className="flex w-full justify-center gap-6 mt-24 mb-12">
        <div className="lg:w-1/3 flex flex-col items-center justify-center mx-2">
          <h2 className="text-6xl font-bold flex items-end mb-20">
            P
            <span>
              <img src={A} alt="A" className="w-14 h-14 translate-y-2" />
            </span>
            RTNERS
          </h2>
          <div className="flex flex-col items-center mb-16 mx-2 gap-4">
            <img src={Thp} alt="Thp" className="w-13 h-13" />
            <p className="mt-8 text-justify">
              "THP Lab" is a decentralized open collective, bootstrapped by "The Hacking 
              Project" students of the development bootcamp, experimenting on innovative 
              product development.
            </p>
          </div>
        </div>
        <div className="lg:w-1/3 flex flex-col items-center mx-2">
          <h2 className="text-6xl font-bold flex items-end mb-12">
            <span>
              <img src={A} alt="A" className="w-14 h-14 translate-y-2" />
            </span>
            MBASSADOR
          </h2>
          <div className="flex flex-col items-center gap-4 mx-2">
            <img src={Alchemists} alt="Alchemists" className="w-13 h-13" />
            <p className="text-justify">
              "The Alchemists" guild, present since Boss Fighters inception, is focusing on 
              improving the user experience of web3 games by proposing improvements 
              and creating content. 
            </p>
          </div>
        </div>
      </div> 
      <div className="flex flex-col items-center mb-20 w-1/3 mx-auto">
        <h2 className="text-6xl font-bold flex items-end mb-20">
          <span>
            <img src={A} alt="A" className="w-14 h-14 translate-y-2" />
          </span>
          TTESTATIONS
        </h2>
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
