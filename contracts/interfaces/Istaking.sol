// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;
interface Staking{

     function setNiitERC20Addr (address _NiitERC20Addr) external onlyOwner;

    function stakeFromMatureBonds() external;

    function stake(uint256 _amount) external;

    // this function re-compounds the staker's stakes if the lastStakedTime is greater than 7 days each time its being called 
    function _stake(uint256 _amountIn) internal;

     // this function re-compounds the staker's stakes if the lastStakedTime is greater than 3 days each time its being called 
    function withdrawStake (uint _amount) external;

    // This function checks the compounded balance for each staker
    function checkStakingBalance (address _account) external view returns (uint balance);
}