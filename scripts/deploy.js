const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting Multi-Signature Wallet deployment...");
  
  // Get the contract factory
  const MultiSigWallet = await hre.ethers.getContractFactory("Project");
  
  // Get signers
  const [deployer] = await hre.ethers.getSigners();
  console.log(`📋 Deploying contract with account: ${deployer.address}`);
  
  // Check deployer balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Account balance: ${hre.ethers.formatEther(balance)} ETH`);
  
  // Define initial owners and required confirmations
  const owners = [
    deployer.address,
    "0x1234567890123456789012345678901234567890", // Replace with actual addresses
    "0x9876543210987654321098765432109876543210"  // Replace with actual addresses
  ];
  
  const numConfirmationsRequired = 2; // Require 2 out of 3 confirmations
  
  console.log("🔧 Deployment Parameters:");
  console.log(`   Owners: ${owners.length}`);
  owners.forEach((owner, index) => {
    console.log(`   Owner ${index + 1}: ${owner}`);
  });
  console.log(`   Required Confirmations: ${numConfirmationsRequired}`);
  
  try {
    // Deploy the contract
    console.log("📦 Deploying Multi-Signature Wallet...");
    const multiSigWallet = await MultiSigWallet.deploy(owners, numConfirmationsRequired);
    
    // Wait for deployment
    await multiSigWallet.waitForDeployment();
    
    const contractAddress = await multiSigWallet.getAddress();
    console.log("✅ Multi-Signature Wallet deployed successfully!");
    console.log(`📍 Contract address: ${contractAddress}`);
    
    // Verify deployment
    console.log("🔍 Verifying deployment...");
    const deployedOwners = await multiSigWallet.getOwners();
    const requiredConfirmations = await multiSigWallet.numConfirmationsRequired();
    
    console.log("✨ Deployment Verification:");
    console.log(`   Contract Address: ${contractAddress}`);
    console.log(`   Number of Owners: ${deployedOwners.length}`);
    console.log(`   Required Confirmations: ${requiredConfirmations}`);
    console.log(`   Initial Balance: ${hre.ethers.formatEther(await hre.ethers.provider.getBalance(contractAddress))} ETH`);
    
    // Save deployment info
    const deploymentInfo = {
      network: hre.network.name,
      contractAddress: contractAddress,
      deployer: deployer.address,
      owners: deployedOwners,
      requiredConfirmations: requiredConfirmations.toString(),
      deploymentTime: new Date().toISOString(),
      transactionHash: multiSigWallet.deploymentTransaction()?.hash
    };
    
    console.log("\n📋 Deployment Summary:");
    console.log(JSON.stringify(deploymentInfo, null, 2));
    
    console.log("\n🎉 Deployment completed successfully!");
    console.log("💡 Next steps:");
    console.log("   1. Fund the wallet by sending ETH to the contract address");
    console.log("   2. Use submitTransaction() to propose transactions");
    console.log("   3. Use confirmTransaction() to approve transactions");
    console.log("   4. Use executeTransaction() to execute approved transactions");
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("💥 Deployment script failed:", error);
    process.exit(1);
  });
