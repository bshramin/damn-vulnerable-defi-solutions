// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/interfaces/IERC3156FlashLender.sol";
import "@openzeppelin/contracts/interfaces/IERC3156FlashBorrower.sol";
import "./SimpleGovernance.sol";

contract SelfiePoolHack {
    function hack() external {
        // Get a flash loan from the SelfiePool contract
        // Now that you have a lot of governance tokens
        // you can queue an emergency withdrawal action
    }

    function executeAction(uint256 actionId) external {
        // Call this function to execute the action After two days
    }
}
