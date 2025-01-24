import { AgentLogo } from "@img/index";
export default function HomePage() {
  return (
    <div>
      <img src={AgentLogo} alt="Agent Logo" />
      <h2>Boss Figthers community&#39;s Open Source Platform</h2>
      <p>
        Agent is designed to facilitate and enhance the in-game experience for
        players and streamers and/or investors.
      </p>
      <p>
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
      {/* THP LOGO */}
      <p>
        In partnership with the decentralized training center &#34;The Hacking
        Project&#34; alias THP, students will be asked to develop
        functionalities for their internship to validate their training.
      </p>
      {/* Intuition LOGO */}
      <p>
        New unprecedented features in gaming via &#34;Intuition&#34;
        partnership, a decentralized technology that enables users to create
        attestations on any subject, stored in a navigable, searchable and
        verifiable way.
      </p>
      {/* Alchemist LOGO */}
      <p>
        &#34;The Alchemist&#34; as Agent ambassador guild, it will help collect
        in-game information, test and use features on stream to guarantee the
        platform quality and give feedback to improve the product.
      </p>
      <p>Let&#39;s build tomorrow&#39;s success together !</p>
    </div>
  );
}
