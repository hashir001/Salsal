require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
const fs = require('fs');

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    goerli: {
      
      url:"https://eth-goerli.g.alchemy.com/v2/ZGzDvvZOpx2RDdlKwQg88atEtaPJ5L0J",
      //process.env.REACT_APP_ALCHEMY_API_URL ,
      accounts: ['ee634744107e45469ffb2c08fd35ab9b2b8ca2c56155efa380c84eb70ef2539e','458aaca4c957f3ae88538069350e1422006ee3d81121da9d1492b1a48ff98410']
      //process.env.REACT_APP_ALCHEMY_API_ACCOUNTS
      
    }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};