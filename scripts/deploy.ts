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

  console.log(DeployedBondDepo.address,DeployedVault.address,DeployedBondable.address, DeployedStaking.address, DeployedNiit.address);
  // 0x5b2B088dD9c5be1476F400227Ef3f2Fa99748ea4 0x21C6bDEdc49dd548B3b1a2A8c5F320A86061071D 0xEB3F3be965074c0e0b639C55E121F5C6815BFdEC 0x2F70499b22fCAf53b91A81Edc1A385679b0cD1df 0x4F9242A4035d9256d2206f01CfB35d5b9b34F275
}
// vault= 0x3F7DBA89C0d6a6D97110D353Aea26E3978417587

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
