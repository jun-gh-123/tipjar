export const RECIPIENT =
  "0xf1baf5680e033987203069162625097cefdc6ec1de66de38720cc8036c243eb5";

export const CONFIG = {
  mainnet: {
    network: "mainnet",
    baseUrl: "https://fullnode.mainnet.sui.io:443",
  },
  testnet: {
    network: "testnet",
    baseUrl: "https://fullnode.testnet.sui.io:443",
  },
};

export const TOKENS = {
  "sui": {
    address: {
      "mainnet": "0x2::sui::SUI",
      "testnet": "0x2::sui::SUI"
    },
    decimals: 9
  },
  "usdc": {
    address: {
      "mainnet": "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
      "testnet": "0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC"
    },
    decimals: 6
  }
}
