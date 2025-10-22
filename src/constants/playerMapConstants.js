// Constantes personnalisées pour PlayerMap dans staging-front
// Ces constantes remplaceront les valeurs par défaut de Player-map

// Prédicats communs
export const COMMON_IDS = {
  GAMES_ID: "0x5dc0a2335c12343d8e0f71b62a73fbf70d06fcbaf647f57d82a189873ad90da3",
  FOLLOWS: "0x8f9b5dc2e7b8bd12f6762c839830672f1d13c08e72b5f09f194cafc153f2df8a", // prédicat --> follows
  IS: "0x2af261bce70c2fc3a1abf882e3e89b23066fcd150bfda27fab69f9f55ed2d9d0",  // prédicat --> is
  IS_PLAYER_OF: "0x05f1707d8cb50571d01021f09a664826aa1be2ff43504c0cca55eef87142f84f",  // prédicat --> is player of
};

// Types de triples pour les joueurs
export const PLAYER_TRIPLE_TYPES = {
  PLAYER_GAME: {
    predicateId: COMMON_IDS.IS_PLAYER_OF, // predicat --> is player of !!!
    objectId: COMMON_IDS.GAMES_ID // object --> games (BossFighters)
  },
  PLAYER_QUALITY_1: {
    predicateId: COMMON_IDS.IS, // predicat --> is 
    objectId: "0xc9559c712c264e5f94ce450ed9473c451b6fd01ab6a436a726fbae767cd67b9c" // object --> fairplay !!!
  },
  PLAYER_QUALITY_2: {
    predicateId: COMMON_IDS.IS, // predicat --> is 
    objectId: "0x56d28a901a7f2617247f1663b0c25c77ba6403a8141bac43b1e94eb32a2de941" // object --> strong boss !!!
  },
  PLAYER_QUALITY_3: {
    predicateId: COMMON_IDS.IS, // predicat --> is 
    objectId: "0xc8433466cda62c0e8bb4fc5433f3faa51949072d6c7b0df50a595c95fb97f1bb" // object --> strong fighter !!!
  },
  PLAYER_GUILD: {
    predicateId: COMMON_IDS.IS_PLAYER_OF, // predicat --> is player of !!!
    objectId: null // Sera défini dynamiquement en fonction du choix de guilde
  }
};

// Liste des guildes officielles du jeu
export const OFFICIAL_GUILDS = [
  { id: "0x4320ae619f6a9c9b79ee8e2a9415585aff1c287f0b72b08c049cf7a5780eb08d", name: "The Alchemists" }, // id --> The Alchemists !!!
  { id: "0x12d4b4425dcfeaf46af6543e8de0133f22f768a69d56a3aa28662ecb06aa9ca1", name: "Big Time Warriors" }, // id --> Big Time Warriors !!!
  { id: "0xd9e1d54c0cb904c23e04caea94f9d0dae00874ec18849ca74a832e94c6de01fa", name: "The NEST" }, // id --> The NEST !!!
  { id: "0xd473ceacf850609ff8881c398e85e59aadbc315588ca78182313cc1af05a2800", name: "Clock Work Gamers" }, // id --> Clock Work Gamers !!!
  { id: "0x14511bc4065a1e7d67ba7d50d4706a8899a148a2e68b55213794c14e347acaa", name: "Vast Impact Gaming" }, // id --> Vast Impact Gaming !!!
  { id: "0x93815368a0d207e11be12da396d51dea4e3f8e637fe49f696648feb451f6f9c7", name: "Kraken Gaming" }, // id --> Kraken Gaming !!!
  { id: "0x508dee963f045411bd0bf4ab9433f40b72ca4270eb0f31222f299211cffbb0bc", name: "FAM" } // id --> FAM
];

// List of predefined claim IDs for voting
export const PREDEFINED_CLAIM_IDS = [
  "0xe4230213119263e56f54b1775cc68a17044459ff9eb173c027296a71183b0e1f", // pixward game - is - player first
  "0x5d0520046c19ee1d11394eee35b552a22c33cfb12436d70f4f0a532876fcac4d", // pixward game - is - transparent
  "0xf558c9b2dce229d3b179ac8bfb82391daf132217dafab1ae97ba0347f3ce7c5c", // pixward game - is - open to feedback
  "0xbd8e011371e763cd198d65b984d97095ba8683aaea54e6bf649a6a8bf318bbd8", // pixward game - is - trustful
  "0x6f6e8b77d841dc7f1f6db1d4a9d343c82fa8b7e9b8cc0994df0acc6043d40031", // pixward game - listens to - its community
  "0x3e85439a1af56cdff9a43e8a816b63e04b43867a3127247dc0acf1df96316a4e", // pixward game - listens to - pixward game
  "0x4c4d6868d5904a20a15d4f3c9747d12181bc44aa73e2678411cad233af2aa9da", // boss fighters - is - play-to-earn
  "0xaa179c3eb2a324d1c21bd2e8cba5154cad3597a0d233a139dbc5faee63817f93", // boss fighters - is - pay-to-win
  "0x008c734e4367e902c953741e1d630a7633e7d6adb6473312bd184977008cd03b", // boss fighters - is - fun
  "0xb1e561929163310cb385c918a66012131d920e3df35fb77be03af1ea75be858d", // boss fighters - is - casual
  "0x4b1be50d1c8fcc7a54c3aaaa30cbb48f9b9393e8dfbd4b2dc910a04831d56d8b", // boss fighters - is - esport
  "0x4f8975d9b2438d5716f416587693f55142f586c4c62c3601e5e924777a72e312", // boss fighters - is - teamplay
  "0x42f298ac414b20975a6ab8c94c4b683debe798a09f6957a6bfbcca4af1cdd63b", // boss fighters - is - skill-based
  "0xef3ef30cd762429314bccfd46d8b056c9b1706d934ef419b47b7d8248ad096da", // boss fighters - is - innovative
  "0x5c7f37f87e63beed18989f62fbcaa1bb76b4c97723aebae3f6758e714bde31fe", // high stakes - is - esport
  "0xa389d4eb5f75617a19f9d8d4a960b34fce0878e58289679435261e4085ef8929", // high stakes - is - tactical
  "0xb17dfa387c586717567c5e2c27edabd1f2cfbd46807d45046a3a2a1f29f51280", // high stakes - is - solo mod
  "0x1e31fc307251b307c10cbe4aebf18dff85ba196f4429a4183d546fde68eedeba", // high stakes - is - team mode
  "0x5b5c9fa73f6be933c0580d1a25ca590e5d97c0cc6e92027699f0c7b5b660b8fb", // matchmaking - is - balanced
  "0x27191de92fe0308355319ec8f2359e5ce85123bd243bf7ffa6eb8028347b3eab", // toxic - is map of - bossfights
  "0x9df847b39391899840d7973d9718d8caef5c5467dde9374a96d1f71727bae7c4", // toxic river - is - balanced
  "0x561a2c3e4359c8ed1c468aef27691e8e48b4424344a38c7693b9127b1911efc9", // toxic river - is - fun
  "0x6d7e52c5e80bf6c2873a21cb7013ba0655dc0458c77f2c0e7446c49efdbd0033", // toxic river - is - immersive
  "0xef6da30d2734115c4707a178f33e927d3ce62e7744cf86f54019c4780ed4c36c", // award - is - balanced
  "0xb21f02971c2ebaa877c303cb026bc27309f7505634aff8bac596c7d7ed039146", // award - is - fun
  "0xc8f8c5e7df4e7e8e19089011b0d7521c0043a86384f349ecf608a0e1ca1ebb08", // award - is - immersive
  "0xbfc8bc7590631a0b0bdf16976e826ba486428dc8549bc5654148cba9d7ac4e51", // radiation rift - is - balanced
  "0x6ce2ce2b368db249ce6826e75191c3fdb1eb0bcef7a6a8f842e0cde97b6af120", // radiation rift - is - fun
  "0x898586a158385db51d063e6982fda2f9104a79736dc83897d52a8b09e3068a44", // radiation rift - is - immersive
];

// Variables d'environnement Pinata (SÉCURISÉES)
export const PINATA_CONFIG = {
  JWT_KEY: import.meta.env.VITE_PINATA_JWT_KEY,
  IPFS_GATEWAY: import.meta.env.VITE_IPFS_GATEWAY || 'gateway.pinata.cloud'
};

// Export des constantes personnalisées pour PlayerMap
export const CUSTOM_PLAYER_MAP_CONSTANTS = {
  COMMON_IDS,
  PLAYER_TRIPLE_TYPES,
  OFFICIAL_GUILDS,
  PREDEFINED_CLAIM_IDS,
  PINATA_CONFIG // ← IMPORTANT : Ajouter PINATA_CONFIG (sécurisé)
};
