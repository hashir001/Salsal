const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace", function () {
  it("Should return listing price", async function () {
    const Contract = await ethers.getContractFactory("NFTMarketplace");
    const contract = await Contract.deploy();
    await contract.deployed();

    const contractListingPrice = ethers.utils.parseUnits('0.01', 'ether')
    let getListingPrice = await contract.getListPrice()
    expect(getListingPrice).to.equal(contractListingPrice);
  });

  it("Should perform a Blockchain transaction", async function () {
    const Contract = await ethers.getContractFactory("NFTMarketplace");
    const contract = await Contract.deploy();
    await contract.deployed();

    let getCollectionIdentifier = await contract.createCollection('randomURI','testIdentifier',120,'details','provDetails')
    console.log(getCollectionIdentifier)
    expect(getCollectionIdentifier.blockHash !== undefined)
  });

});
