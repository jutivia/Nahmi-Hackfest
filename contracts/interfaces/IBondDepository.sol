// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;

interface IBondDepository {

    function setBondableAsset(address _BondableAsset) external onlyOwner;

    function setVaultAddress (address _vaultAddress) external onlyOwner ;
    function setNiitERC20Addr (address _NiitERC20Addr) external onlyOwner;

    function setStakingContractaddr (address _stakingContractAddr) external onlyOwner;
    function deposit(uint256 _amount, address _user) external ;

    function fetchExistingUserBond (address _userAddress) external view returns (uint256 amount) ;

    function checkBondExist (address _userAddress) external view returns (bool exists);
    function checkMaturity (address _userAddress) external view returns (uint256 waitingTimeLeft, bool matured);
    function getTokens() external ;
    function deleteBondAfterStake(address _userAddress) external ;
}
