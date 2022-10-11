// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;
import './BondDepository';
import "./NiitERC20.sol";
contract Staking{
    mapping(address => Staker) stakerToStakes;
    address BondDepositoryAddress;
    address VaultAddress;
    uint96 constant minStakePeriod = 7 days;

    BondDepository BondContract;

     struct UserBonds{
        uint256 id,
        address UserAddress,
        uint96 lastTimeDeposited,
        uint256 tokenAmountToBeGotten,
    }

    struct Staker{
        address owner;
        uint96 lastTimeStake;
        uint currentStake;   
    }
    // Staking is done at 50% interest per year, and accumulated for users per second.

    constructor (address _BondDepositoryAddress, address _NiitAddress, address _vaultAddress){
        BondContract = BondDepository(_BondDepositoryAddress);
        VaultAddress = _VaultAddress;
    }
    function stakeFromMatureBonds() external{
       require(BondContract.checkBondExisist(msg.sender), 'Er1: Bond does not exist');
       (, bool matured) = BondContract.checkMaturity(msg.sender);
       require(matured === true, 'Er2: Bond not mature');
       UserBonds bond = BondContract.fetchExistingUserBond(msg.sender);
       uint256 amountToStake = bond.tokenAmountToBeGotten;
        _stake(amountToStake);
        BondContract.deleteBondAfterStake(msg.sender);

    }
    function stake(uint256 _amount, address NiitAddress){
        require(NiitERC20(NiitAddress).transferFrom(msg.sender, VaultAddress, _amount), 'Er3: Asset transfer failed')
        _stake(_amount);
    }

    // this function re-compounds the staker's stakes if the lastStakedTime is greater than 7 days each time its being called 
    function _stake(uint256 _amountIn) internal {
        Staker storage o = stakerToStakes[msg.sender];
        if(o.lastTimeStake == 0){
        o.owner = msg.sender;
        o.currentStake = _amountIn;
        o.lastTimeStake = uint96(block.timestamp);
        } else {
        uint stakePeriod = block.timestamp - o.lastTimeStake;
        if(stakePeriod >= minStakePeriod){
            uint bonus = (o.currentStake * 2/100000000 * stakePeriod);
            o.currentStake += _amountIn + bonus;
        } else {
            o.currentStake += _amountIn;
        }
        o.lastTimeStake = uint96(block.timestamp);
        }
    }

     // this function re-compounds the staker's stakes if the lastStakedTime is greater than 3 days each time its being called 
    function withdrawStake (uint _amount) external{
        Staker storage o = stakerToStakes[msg.sender];
        uint stakePeriod = block.timestamp - o.lastTimeStake;
        if(stakePeriod >= minStakePeriod){
            uint bonus = (o.currentStake *  2/100000000 * stakePeriod);
            o.currentStake += bonus;
        }
        require (o.currentStake >= _amount, 'Er4: Stake balance less than request amount');
        o.currentStake -= _amount;
        o.lastTimeStake = uint96(block.timestamp);
        MintFromStake()
    }

    // This function checks the compounded balance for each staker
    function checkStakingBalance () external view returns (uint balance){
        Staker storage o = stakerToStakes[msg.sender];
        uint stakePeriod = block.timestamp - o.lastTimeStake;
        if(stakePeriod >= minStakePeriod){
            uint bonus = (o.currentStake *  2/100000000 * stakePeriod);
           return balance= o.currentStake + bonus;
        } 
        return balance = o.currentStake;
    }
}