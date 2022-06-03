const { expect } = require("chai");
const { ethers } = require("hardhat");

let MyToken;
let mytoken;
let deployer;
let addr1;

describe("Test FrogToken Contract", function () {
  it("Should return the new greeting once it's changed", async function () {
    MyToken = await ethers.getContractFactory("MyToken");
    mytoken = await MyToken.deploy();
    await mytoken.deployed();
    console.log("mytoken.address: ", mytoken.address);
    console.log(await mytoken);
  
  });
});
