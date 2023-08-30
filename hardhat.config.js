require("@nomiclabs/hardhat-waffle");

const privateKey = "40c59bc40683c5ca68a4ae3a572c77c48618a0ce745fe8ed550e1b8a13f0e6b4"

module.exports = {
  networks: {
    Mumbai: {
      url: "https://rpc-mumbai.maticvigil.com/",
      chainId:80001,
      accounts: [privateKey]
      },
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};