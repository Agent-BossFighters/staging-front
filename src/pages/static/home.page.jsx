import { AgentLogo, Thp, Intuition, Alchemists } from "@img/index";
export default function HomePage() {
  return (
    <div className="w-5/6 mx-auto h-full">
      <div className="flex flex-col text-center items-center justify-center my-5">
        <img src={AgentLogo} alt="Agent Logo" className="md:w-1/2" />
        <h2 className="text-xs font-extrabold">
          Boss Figthers community&#39;s Open Source Platform
        </h2>
      </div>
      <div className="my-5 flex flex-col gap-2 border-b border-border/50 py-2">
        <p>
          Agent is designed to facilitate and enhance the in-game experience for
          players and streamers and/or investors.
        </p>
        <p className="">
          Built for the community and by the community via Open Source
          Contribution and/or feedback from the Boss Fighters community, it will
          offers complementary tools for better Boss Fighters understanding and
          creating content for its community.
        </p>
        <p>
          The aim is to offer a range of tools to all stakeholders (players,
          content creators, investors, player council members and Boss Fighters
          Studio) to help improve and develop the game and the community.
        </p>
      </div>
      <div className="my-5 flex flex-col gap-5 items-center border-b border-border/50 py-2 text-start">
        <img src={Thp} alt="THP" className="" />
        <p className="">
          In partnership with the decentralized training center{" "}
          <span className="font-bold">&#34;The Hacking Project&#34;</span> alias
          THP, students will be asked to develop functionalities for their
          internship to validate their training.
        </p>
      </div>
      <div className="my-5 flex flex-col gap-5 items-center border-b border-border/50 py-2 text-start">
        <div className="flex items-center gap-2">
          <img src={Intuition} alt="Intuition" className="" />
          <h3 className="font-extrabold text-center text-3xl">Intuition</h3>
        </div>
        <p className="">
          New unprecedented features in gaming via{" "}
          <span className="font-bold">&#34;Intuition&#34;</span>
          &nbsp;partnership, a decentralized technology that enables users to
          create attestations on any subject, stored in a navigable, searchable
          and verifiable way.
        </p>
      </div>
      <div className="my-5 flex flex-col gap-5 items-center border-b border-border/50 py-2 text-start">
        <img src={Alchemists} alt="Alchemists" className="" />
        <p className="">
          <span className="font-bold">&#34;The Alchemist&#34;</span> as Agent
          ambassador guild, it will help collect in-game information, test and
          use features on stream to guarantee the platform quality and give
          feedback to improve the product.
        </p>
      </div>
      <h3 className="font-extrabold text-center">
        Let&#39;s build tomorrow&#39;s success together !
      </h3>
    </div>
  );
}
