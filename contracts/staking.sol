// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;

import './interfaces/IBondDepository.sol';
import "./interfaces/INiitERC20.sol";
import "./interfaces/IERC20.sol";

contract Staking{
    mapping(address => Staker) stakerToStakes;
    address BondDepositoryAddress;
    address VaultAddress;
    address NiitERC20Addr;
    address owner;
    uint96 constant minStakePeriod = 7 days;

    IBondDepository BondContract;

    struct Staker{
        address owner;
        uint96 lastTimeStake;
        uint currentStake;   
    }
    // Staking is done at 50% interest per year, and accumulated for users per second.

    constructor (address _BondDepositoryAddress, address _vaultAddress){
        BondContract = IBondDepository(_BondDepositoryAddress);
        VaultAddress = _vaultAddress;
        owner = msg.sender;
    }
    modifier onlyOwner(){
        require(msg.sender == owner, "Er1: Only owner");
        _;
    }
     function setNiitERC20Addr (address _NiitERC20Addr) external onlyOwner{
        NiitERC20Addr = _NiitERC20Addr;
    }

    function stakeFromMatureBonds() external{
       require(BondContract.checkBondExist(msg.sender), 'Er1: Bond does not exist');
       (, bool matured) = BondContract.checkMaturity(msg.sender);
       require(matured == true, 'Er2: Bond not mature');
       (uint256 amountToStake) = BondContract.fetchExistingUserBond(msg.sender);
        _stake(amountToStake);
        BondContract.deleteBondAfterStake(msg.sender);
    }

    function stake(uint256 _amount) external{
       INahmiiERC20Token(NiitERC20Addr).burnFrom(msg.sender, _amount);
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
            o.currentStake = o.currentStake + _amountIn + bonus;
        } else {
            o.currentStake += _amountIn;
        }
        o.lastTimeStake = uint96(block.timestamp);
        }
    }

     // this function re-compounds the staker's stakes if the lastStakedTime is greater than 3 days each time its being called 
    function withdrawStake (uint _amount) external {
        Staker storage o = stakerToStakes[msg.sender];
        uint stakePeriod = block.timestamp - o.lastTimeStake;
        if(stakePeriod >= minStakePeriod){
            uint bonus = (o.currentStake *  2/100000000 * stakePeriod);
            o.currentStake += bonus;
        }
        require (o.currentStake >= _amount, 'Er4: Stake balance less than request amount');
        o.currentStake -= _amount;
        o.lastTimeStake = uint96(block.timestamp);
        INahmiiERC20Token(NiitERC20Addr).MintFromStake(msg.sender, _amount);
    }

    // This function checks the compounded balance for each staker
    function checkStakingBalance (address _account) external view returns (uint balance){
        Staker storage o = stakerToStakes[_account];
        uint stakePeriod = block.timestamp - o.lastTimeStake;
        if(stakePeriod >= minStakePeriod){
            uint bonus = (o.currentStake *  2/100000000 * stakePeriod);
           return balance= o.currentStake + bonus;
        } 
        return balance = o.currentStake;
    }
}