export default {
  contractAddress: process.env.VOTE_CONTRACT_ADDRESS || '0x87ae49b6ffd2ea714fb08710ce5ccda5e490e07b',
  rocksideBackend: process.env.VUE_APP_API_URL || 'https://rockside-showcase.appspot.com',
  infuraId: process.env.INFURA_ID || 'e26432acb1774b39b4118f571e88cf5a',
  network: process.env.NETWORK || 'ropsten',
  etherscan: 'https://ropsten.etherscan.io/',
};
