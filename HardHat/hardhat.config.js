require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "ropsten",
  networks: {
    ropsten: {
      url: "https://ropsten.infura.io/v3/6780316e173b457c8ade056310790a31",
      accounts: ["0x3b2a7877b628f18983751cd483a1848afe31ba32816298c88151bd2b3add8f7f"]
    }
  }
};
