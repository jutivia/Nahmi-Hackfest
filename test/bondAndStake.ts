import { expect } from "chai";
import { ethers } from "hardhat";

import {AssetToken, NahmiiERC20Token, BondDepository, Vault, Staking} from '../typechain'

let DeployedNiit: NahmiiERC20Token;
let DeployedBondable: AssetToken;
let DeployedBondDepo: BondDepository;
let DeployedVault: Vault;
let DeployedStaking: Staking;

let user1, user2, user3;
describe("Test mining Niit using Nahmii native coin", function () {
  this.beforeEach(async () => {
    [user1, user2, user3] = await ethers.getSigners();
     // deploy Bond depository contract
    const BondDepositoryContract = await ethers.getContractFactory("BondDepository");
    DeployedBondDepo = await BondDepositoryContract.deploy();
    await DeployedBondDepo.deployed();

    // deploy NiiToken contracct
    const VaultContract = await ethers.getContractFactory("Vault");
    DeployedVault = await VaultContract.deploy(DeployedBondDepo.address);
    await DeployedVault.deployed();

    // deploy Bondable Asset contract
    const AssetERC20Contract = await ethers.getContractFactory("AssetToken");
    DeployedBondable = await AssetERC20Contract.deploy();
    await DeployedBondable.deployed();

    //deploy Staking contract
    const StakingContract = await ethers.getContractFactory("Staking");
    DeployedStaking = await StakingContract.deploy(DeployedBondDepo.address, DeployedVault.address);
    await DeployedStaking.deployed();

    // deploy NiiToken contracct
    const NiitERC20Contract = await ethers.getContractFactory("NahmiiERC20Token");
    DeployedNiit = await NiitERC20Contract.deploy(DeployedVault.address, DeployedStaking.address, DeployedBondDepo.address);
    await DeployedNiit.deployed();

  });
  it("Should mint the amount of tokens worth the coins deposited ", async function () {
    await DeployedNiit.connect(user1).mintForSale(
     user1.address, {
        value: ethers.utils.parseEther("100")
    });
    expect(await DeployedNiit.balanceOf(user1.address)).to.equal(
      "1000000000000000000"
    );
  });
   it("Should revert mintByBond Function when called directly from Niit contract ", async function () {
        await expect(DeployedNiit.mintFromBond(user1.address,'1000000000000000000', 1 )).to.be.revertedWith(
           "Er2: Only Bond Depo contract"
    );
  });

    it("Should revert mintFromStake Function when called directly from Niit contract ", async function () {
        await expect(DeployedNiit.MintFromStake(user1.address,'1000000000000000000')).to.be.revertedWith(
            "Er3: Only staking contract"
    );
  });
  it("Should be able to create a bond, check if it exists, check its maturity and withdraw NII tokens when maturity is reached", async function () {
        //setting the bondable asset address
        await DeployedBondDepo.setBondableAsset(DeployedBondable.address);

        //Setting vault address
        await DeployedBondDepo.setVaultAddress(DeployedVault.address)

        // Setting staking contract addr 
        await DeployedBondDepo.setStakingContractaddr(DeployedStaking.address);

        // setting the NiiToken contract address 
        await DeployedBondDepo.setNiitERC20Addr(DeployedNiit.address);
        await DeployedStaking.setNiitERC20Addr(DeployedNiit.address);

        // minting bondable assets for a user
        await DeployedBondable.mint(user2.address, '100000000000000000000')
         expect(await DeployedBondable.balanceOf(user2.address)).to.equal(
        "100000000000000000000"
        );
        
        //checking if bond exists before creating bond
        expect(await DeployedBondDepo.checkBondExist(user2.address)).to.equal(false)
        // approving allowance from the user to the bond repository
        await DeployedBondable.connect(user2).approve(DeployedBondDepo.address,'100000000000000000000')

        // Deposit Bondable funds for bonding
        await DeployedBondDepo.connect(user2).deposit('100000000000000000000', user2.address)
        
        // Checking if bond exists after creating bond 
         expect(await DeployedBondDepo.checkBondExist(user2.address)).to.equal(true)
         expect(await DeployedBondDepo.fetchExistingUserBond(user2.address)).to.equal('5200000000000000000')
        
         // increasing time by 1 day
         await network.provider.send("evm_increaseTime", [97200])
         await network.provider.send("evm_mine")
         // confirm bond is not yet mature
        const result = await DeployedBondDepo.connect(user2).checkMaturity(user2.address)
        expect(result.matured).to.equal(false)
        expect (Number(result.waitingTimeLeft)).to.be.greaterThan(0)
        
        // trying to withdraw niit tokens when bond is not yet mature 
        await expect( DeployedBondDepo.connect(user2).getTokens()).to.be.revertedWith(
        "Er5: Bond maturity period not yet reached"
        );

         // increasing time by 6 days more
         await network.provider.send("evm_increaseTime", [507600])
         await network.provider.send("evm_mine")
        
         //confirm bond is mature
         const result2 = await DeployedBondDepo.connect(user2).checkMaturity(user2.address)
        expect(result2.matured).to.equal(true)
        expect (Number(result2.waitingTimeLeft)).to.equal(0)
        
        // Should not be able to delete bond except owner 
         await expect(DeployedBondDepo.connect(user1).deleteBondAfterStake(user1.address)).to.be.revertedWith(
            "Er6: Only Staking contract"
        );

        // Withdraw niit tokens
         await DeployedBondDepo.connect(user2).getTokens()
          expect(await DeployedNiit.balanceOf(user2.address)).to.equal(
        "5200000000000000000"
        );

        
  });
  it("Should be able to stake tokens received from bond directly ", async function () {
    // Setting staking address
        await DeployedBondDepo.setStakingContractaddr(DeployedStaking.address);
        //setting the bondable asset address
        await DeployedBondDepo.setBondableAsset(DeployedBondable.address);

        //Setting vault address
        await DeployedBondDepo.setVaultAddress(DeployedVault.address)

         // setting the NiiToken contract address 
        await DeployedBondDepo.setNiitERC20Addr(DeployedNiit.address);
        await DeployedStaking.setNiitERC20Addr(DeployedNiit.address);
        // minting bondable assets for a user
        await DeployedBondable.mint(user2.address, '100000000000000000000')
         expect(await DeployedBondable.balanceOf(user2.address)).to.equal(
        "100000000000000000000"
        );
        
        // approving allowance from the user to the bond repository
        await DeployedBondable.connect(user2).approve(DeployedBondDepo.address,'100000000000000000000')

        // Deposit Bondable funds for bonding
        await DeployedBondDepo.connect(user2).deposit('100000000000000000000', user2.address)
        
         // increasing time by 7 days 
         await network.provider.send("evm_increaseTime", [604800])
         await network.provider.send("evm_mine")

        // Stake Tokens to be gotten from Bond
        await  DeployedStaking.connect(user2).stakeFromMatureBonds()
        
        // Add 7 days for the minimum staking period
         await network.provider.send("evm_increaseTime", [604800])
         await network.provider.send("evm_mine")
        expect(await DeployedStaking.connect(user2).checkStakingBalance(user2.address)).to.equal("5262899200000000000")
        

        // staking more tokens
        // Mint with native coin 
         await DeployedNiit.connect(user2).mintForSale(
            user2.address, {
                value: ethers.utils.parseEther("2")
            });
            expect(await DeployedNiit.balanceOf(user2.address)).to.equal(
            "20000000000000000"
            );
        
        // approve staking contract for pspening
        await DeployedNiit.connect(user2).approve(DeployedStaking.address,'20000000000000000')
        
        // Stake bought tokens
        await DeployedStaking.connect(user2).stake("20000000000000000")
         // Check user2 NIIt balance berfore withdrawing stake
        expect(await DeployedNiit.balanceOf(user2.address)).to.equal(
            "0"
            );
            
        expect(await DeployedStaking.connect(user2).checkStakingBalance(user2.address)).to.be.greaterThan("5282899200000000000")
        
        //withdraw staked tokens 
        await DeployedStaking.connect(user2).withdrawStake("5280000000000000000")
         expect(await DeployedNiit.balanceOf(user2.address)).to.equal(
            "5280000000000000000"
            );
        
            // Check if bond still exisits
        expect(await DeployedBondDepo.checkBondExist(user2.address)).to.equal(false)
        expect(await DeployedBondDepo.fetchExistingUserBond(user2.address)).to.equal('0')

            // Try to withdraw funds from bond after withdrawing from stake
        await expect (DeployedBondDepo.connect(user2).getTokens()).to.be.revertedWith("Er4: No funds to withdraw ")

  });
});

