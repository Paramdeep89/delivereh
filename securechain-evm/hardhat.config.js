require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
    url: "http://127.0.0.1:8545"
  },
  //  amoy: {
  //     url: "https://rpc-amoy.polygon.technology", // Amoy RPC
  //     chainId: 80002,
  //     accounts: [process.env.PRIVATE_KEY]
  //   }
  }
};