// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;
interface IStaking{

     function setNiitERC20Addr (address _NiitERC20Addr) external;

    function stakeFromMatureBonds() external;

    function stake(uint256 _amount) external;

    function withdrawStake (uint _amount) external;

    function checkStakingBalance (address _account) external view returns (uint balance);
}