import { ethers } from "hardhat";

async function main() {
   const BondDepositoryContract = await ethers.getContractFactory("BondDepository");
    let DeployedBondDepo = await BondDepositoryContract.deploy();
    await DeployedBondDepo.deployed();

    // deploy NiiToken contracct
    const VaultContract = await ethers.getContractFactory("Vault");
    let DeployedVault = await VaultContract.deploy(DeployedBondDepo.address);
    await DeployedVault.deployed();

    // deploy Bondable Asset contract
    const AssetERC20Contract = await ethers.getContractFactory("AssetToken");
    let DeployedBondable = await AssetERC20Contract.deploy();
    await DeployedBondable.deployed();

    //deploy Staking contract
    const StakingContract = await ethers.getContractFactory("Staking");
    let DeployedStaking = await StakingContract.deploy(DeployedBondDepo.address, DeployedVault.address);
    await DeployedStaking.deployed();

    // deploy NiiToken contracct
    const NiitERC20Contract = await ethers.getContractFactory("NahmiiERC20Token");
    let DeployedNiit = await NiitERC20Contract.deploy(DeployedVault.address, DeployedStaking.address, DeployedBondDepo.address);
    await DeployedNiit.deployed();

      //setting the bondable asset address
        await DeployedBondDepo.setBondableAsset(DeployedBondable.address);

        //Setting vault address
        await DeployedBondDepo.setVaultAddress(DeployedVault.address)

        // Setting staking contract addr 
        await DeployedBondDepo.setStakingContractaddr(DeployedStaking.address);

        // setting the NiiToken contract address 
        await DeployedBondDepo.setNiitERC20Addr(DeployedNiit.address);
        await DeployedStaking.setNiitERC20Addr(DeployedNiit.address);

  // console.log(DeployedBondDepo.address,DeployedVault.address,DeployedBondable.address, DeployedStaking.address, DeployedNiit.address);
}
// vault= 0x3F7DBA89C0d6a6D97110D353Aea26E3978417587

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
